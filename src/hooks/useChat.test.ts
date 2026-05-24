import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockRealtimeSendDataMessage = vi.fn();
const mockRealtimeSubscribeToReceiveDataMessage = vi.fn();
const mockRealtimeUnsubscribeFromReceiveDataMessage = vi.fn();

const mockAudioVideo = {
  realtimeSendDataMessage: mockRealtimeSendDataMessage,
  realtimeSubscribeToReceiveDataMessage:
    mockRealtimeSubscribeToReceiveDataMessage,
  realtimeUnsubscribeFromReceiveDataMessage:
    mockRealtimeUnsubscribeFromReceiveDataMessage,
};

let audioVideoValue: typeof mockAudioVideo | null = mockAudioVideo;

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useAudioVideo: () => audioVideoValue,
}));

vi.mock("../utils/attendee", () => ({
  generateAttendeeName: () => "Test User",
}));

import { useChat } from "./useChat";

function createDataMessage(
  topic: string,
  payload: object,
  overrides: Partial<{
    senderAttendeeId: string;
    senderExternalUserId: string;
    timestampMs: number;
    throttled: boolean;
  }> = {},
) {
  return {
    topic,
    data: new TextEncoder().encode(JSON.stringify(payload)),
    senderAttendeeId: overrides.senderAttendeeId ?? "attendee-1",
    senderExternalUserId: overrides.senderExternalUserId ?? "external-1",
    timestampMs: overrides.timestampMs ?? 1000,
    throttled: overrides.throttled ?? false,
  };
}

describe("useChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    audioVideoValue = mockAudioVideo;
  });

  it("sendMessage calls realtimeSendDataMessage with correct args", () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hello world");
    });

    expect(mockRealtimeSendDataMessage).toHaveBeenCalledTimes(1);
    const [topic, payloadStr, lifetime] =
      mockRealtimeSendDataMessage.mock.calls[0];
    expect(topic).toBe("chat-message");
    expect(lifetime).toBe(300000);

    const payload = JSON.parse(payloadStr);
    expect(payload.message).toBe("Hello world");
    expect(payload.senderName).toBe("Test User");
    expect(payload.messageId).toBeDefined();
    expect(payload.timestamp).toBeDefined();
  });

  it("incoming DataMessage on chat-message topic adds to messages state", () => {
    const { result } = renderHook(() => useChat());

    // Capture the callback registered for chat-message
    const chatMessageCallback =
      mockRealtimeSubscribeToReceiveDataMessage.mock.calls.find(
        (call) => call[0] === "chat-message",
      )?.[1];
    expect(chatMessageCallback).toBeDefined();

    const incomingPayload = {
      senderName: "Remote User",
      message: "Hi there",
      messageId: "msg-123",
      timestamp: 1700000000,
    };

    act(() => {
      chatMessageCallback(createDataMessage("chat-message", incomingPayload));
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({
      id: "msg-123",
      senderName: "Remote User",
      text: "Hi there",
      timestamp: 1700000000,
      reactions: {},
    });
  });

  it("sendReaction calls realtimeSendDataMessage with correct args", () => {
    const { result } = renderHook(() => useChat());

    // First send a message to have something to react to
    act(() => {
      result.current.sendMessage("Hello");
    });

    const messageId = result.current.messages[0].id;
    mockRealtimeSendDataMessage.mockClear();

    act(() => {
      result.current.sendReaction(messageId, "👍");
    });

    expect(mockRealtimeSendDataMessage).toHaveBeenCalledTimes(1);
    const [topic, payloadStr, lifetime] =
      mockRealtimeSendDataMessage.mock.calls[0];
    expect(topic).toBe("chat-reaction");
    expect(lifetime).toBe(300000);

    const payload = JSON.parse(payloadStr);
    expect(payload.messageId).toBe(messageId);
    expect(payload.emoji).toBe("👍");
    expect(payload.senderName).toBe("Test User");
  });

  it("incoming reaction DataMessage updates the message reactions", () => {
    const { result } = renderHook(() => useChat());

    // Send a message first
    act(() => {
      result.current.sendMessage("Hello");
    });

    const messageId = result.current.messages[0].id;

    // Capture the reaction callback
    const reactionCallback =
      mockRealtimeSubscribeToReceiveDataMessage.mock.calls.find(
        (call) => call[0] === "chat-reaction",
      )?.[1];
    expect(reactionCallback).toBeDefined();

    const reactionPayload = {
      messageId,
      emoji: "🎉",
      senderName: "Remote User",
    };

    act(() => {
      reactionCallback(createDataMessage("chat-reaction", reactionPayload));
    });

    expect(result.current.messages[0].reactions).toEqual({
      "🎉": ["Remote User"],
    });
  });

  it("unsubscribes from both topics on unmount", () => {
    const { unmount } = renderHook(() => useChat());

    unmount();

    expect(mockRealtimeUnsubscribeFromReceiveDataMessage).toHaveBeenCalledTimes(
      2,
    );
    expect(mockRealtimeUnsubscribeFromReceiveDataMessage).toHaveBeenCalledWith(
      "chat-message",
    );
    expect(mockRealtimeUnsubscribeFromReceiveDataMessage).toHaveBeenCalledWith(
      "chat-reaction",
    );
  });

  it("sendMessage and sendReaction are no-ops when audioVideo is null", () => {
    audioVideoValue = null;

    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hello");
    });

    act(() => {
      result.current.sendReaction("some-id", "👍");
    });

    expect(mockRealtimeSendDataMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);
  });

  it("sendMessage returns error and does not send when payload exceeds 2048 bytes", () => {
    const { result } = renderHook(() => useChat());

    // Generate a message long enough to exceed 2048 bytes when serialized as JSON payload
    const longMessage = "x".repeat(2100);
    let sendResult: { error?: string } = {};

    act(() => {
      sendResult = result.current.sendMessage(longMessage);
    });

    expect(sendResult.error).toBe("Message is too long to send");
    expect(mockRealtimeSendDataMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);
  });

  it("handleChatMessage drops malformed payloads without crashing", () => {
    renderHook(() => useChat());

    const chatMessageCallback =
      mockRealtimeSubscribeToReceiveDataMessage.mock.calls.find(
        (call) => call[0] === "chat-message",
      )?.[1];
    expect(chatMessageCallback).toBeDefined();

    // Send invalid JSON - should not throw
    const malformedMessage = {
      topic: "chat-message",
      data: new TextEncoder().encode("not valid json {{{"),
      senderAttendeeId: "attendee-1",
      senderExternalUserId: "external-1",
      timestampMs: 1000,
      throttled: false,
    };

    expect(() => {
      act(() => {
        chatMessageCallback(malformedMessage);
      });
    }).not.toThrow();
  });

  it("handleChatReaction drops malformed payloads without crashing", () => {
    renderHook(() => useChat());

    const reactionCallback =
      mockRealtimeSubscribeToReceiveDataMessage.mock.calls.find(
        (call) => call[0] === "chat-reaction",
      )?.[1];
    expect(reactionCallback).toBeDefined();

    // Send invalid JSON - should not throw
    const malformedMessage = {
      topic: "chat-reaction",
      data: new TextEncoder().encode("<<<invalid>>>"),
      senderAttendeeId: "attendee-1",
      senderExternalUserId: "external-1",
      timestampMs: 1000,
      throttled: false,
    };

    expect(() => {
      act(() => {
        reactionCallback(malformedMessage);
      });
    }).not.toThrow();
  });
});
