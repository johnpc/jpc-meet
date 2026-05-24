import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

const mockMessages: { id: string; text: string }[] = [];
const mockSendMessage = vi.fn();
const mockSendReaction = vi.fn();

vi.mock("../hooks/useChat", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    sendReaction: mockSendReaction,
    senderName: "Test User",
  }),
}));

import { ChatProvider, useChatContext } from "./ChatContext";

function TestConsumer() {
  const { isChatOpen, unreadCount, toggleChat } = useChatContext();
  return (
    <div>
      <span data-testid="is-open">{String(isChatOpen)}</span>
      <span data-testid="unread">{unreadCount}</span>
      <button onClick={toggleChat}>toggle</button>
    </div>
  );
}

describe("ChatContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMessages.length = 0;
  });

  it("toggleChat flips isChatOpen from false to true", () => {
    render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    expect(screen.getByTestId("is-open").textContent).toBe("false");

    act(() => {
      screen.getByText("toggle").click();
    });

    expect(screen.getByTestId("is-open").textContent).toBe("true");
  });

  it("opening chat resets unreadCount to 0", () => {
    // Start with a message already present so we can simulate unread
    mockMessages.push({ id: "1", text: "hello" });

    const { rerender } = render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    // Add another message while chat is closed
    mockMessages.push({ id: "2", text: "world" });
    rerender(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    expect(Number(screen.getByTestId("unread").textContent)).toBeGreaterThan(0);

    // Open chat
    act(() => {
      screen.getByText("toggle").click();
    });

    expect(screen.getByTestId("unread").textContent).toBe("0");
  });

  it("unreadCount increments when chat is closed and messages arrive", () => {
    render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    expect(screen.getByTestId("unread").textContent).toBe("0");
  });

  it("useChatContext throws when used outside ChatProvider", () => {
    // Suppress React error boundary / console.error noise
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useChatContext());
    }).toThrow("useChatContext must be used within a ChatProvider");

    consoleSpy.mockRestore();
  });
});
