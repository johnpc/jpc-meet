import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import {
  AttendeeNamesProvider,
  useAttendeeNamesContext,
} from "./AttendeeNamesContext";

const mockAudioVideo = {
  realtimeSubscribeToReceiveDataMessage: vi.fn(),
  realtimeUnsubscribeFromReceiveDataMessage: vi.fn(),
  realtimeSendDataMessage: vi.fn(),
};

const mockMeetingManager = {
  meetingSessionConfiguration: {
    credentials: { attendeeId: "attendee-123" },
  },
};

const mockRoster: Record<string, { name?: string; externalUserId?: string }> = {
  "attendee-123": { name: "Alice", externalUserId: "Alice#123" },
  "attendee-456": { name: "Bob", externalUserId: "Bob#456" },
};

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useAudioVideo: () => mockAudioVideo,
  useMeetingManager: () => mockMeetingManager,
  useRosterState: () => ({ roster: mockRoster }),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AttendeeNamesProvider>{children}</AttendeeNamesProvider>;
}

describe("AttendeeNamesContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides getAttendeeName that returns roster name", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });
    expect(result.current.getAttendeeName("attendee-123")).toBe("Alice");
    expect(result.current.getAttendeeName("attendee-456")).toBe("Bob");
  });

  it("returns externalUserId prefix for unknown attendees in roster", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });
    expect(result.current.getAttendeeName("unknown-id")).toBe("Unknown");
  });

  it("subscribes to data messages on mount", () => {
    renderHook(() => useAttendeeNamesContext(), { wrapper });
    expect(
      mockAudioVideo.realtimeSubscribeToReceiveDataMessage,
    ).toHaveBeenCalledWith("attendee-name-change", expect.any(Function));
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = renderHook(() => useAttendeeNamesContext(), {
      wrapper,
    });
    unmount();
    expect(
      mockAudioVideo.realtimeUnsubscribeFromReceiveDataMessage,
    ).toHaveBeenCalledWith("attendee-name-change");
  });

  it("broadcastNameChange sends data message and updates local state", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });

    act(() => {
      result.current.broadcastNameChange("NewAlice");
    });

    expect(mockAudioVideo.realtimeSendDataMessage).toHaveBeenCalledWith(
      "attendee-name-change",
      JSON.stringify({ attendeeId: "attendee-123", newName: "NewAlice" }),
      300000,
    );

    expect(result.current.getAttendeeName("attendee-123")).toBe("NewAlice");
  });

  it("handles incoming name change data messages", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });

    const callback =
      mockAudioVideo.realtimeSubscribeToReceiveDataMessage.mock.calls[0][1];

    const payload = JSON.stringify({
      attendeeId: "attendee-456",
      newName: "Robert",
    });

    act(() => {
      callback({ data: new TextEncoder().encode(payload) });
    });

    expect(result.current.getAttendeeName("attendee-456")).toBe("Robert");
  });

  it("ignores malformed data messages", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });

    const callback =
      mockAudioVideo.realtimeSubscribeToReceiveDataMessage.mock.calls[0][1];

    act(() => {
      callback({ data: new TextEncoder().encode("not json") });
    });

    expect(result.current.getAttendeeName("attendee-456")).toBe("Bob");
  });

  it("name overrides take precedence over roster names", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });

    act(() => {
      result.current.broadcastNameChange("OverriddenAlice");
    });

    expect(result.current.getAttendeeName("attendee-123")).toBe(
      "OverriddenAlice",
    );
  });

  it("getAttendeeName falls back to externalUserId prefix when no name", () => {
    mockRoster["attendee-789"] = { externalUserId: "Charlie#789" };
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });
    expect(result.current.getAttendeeName("attendee-789")).toBe("Charlie");
    delete mockRoster["attendee-789"];
  });

  it("getAttendeeName returns Unknown when no roster entry at all", () => {
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });
    expect(result.current.getAttendeeName("no-such-id")).toBe("Unknown");
  });

  it("broadcastNameChange is no-op when attendeeId is empty", () => {
    mockMeetingManager.meetingSessionConfiguration = {
      credentials: { attendeeId: "" },
    };
    const { result } = renderHook(() => useAttendeeNamesContext(), { wrapper });

    act(() => {
      result.current.broadcastNameChange("NewName");
    });

    expect(mockAudioVideo.realtimeSendDataMessage).not.toHaveBeenCalled();
    mockMeetingManager.meetingSessionConfiguration = {
      credentials: { attendeeId: "attendee-123" },
    };
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useAttendeeNamesContext());
    }).toThrow(
      "useAttendeeNamesContext must be used within AttendeeNamesProvider",
    );
  });
});
