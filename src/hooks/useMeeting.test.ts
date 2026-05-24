import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockJoin = vi.fn().mockResolvedValue(undefined);
const mockStart = vi.fn().mockResolvedValue(undefined);
const mockInvokeDeviceProvider = vi.fn();
const mockGetMeetingMetadata = vi.fn();

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useMeetingManager: () => ({
    join: mockJoin,
    start: mockStart,
    invokeDeviceProvider: mockInvokeDeviceProvider,
  }),
  DeviceLabels: { AudioAndVideo: 3 },
}));

vi.mock("amazon-chime-sdk-js", () => ({
  MeetingSessionConfiguration: vi.fn().mockImplementation((a, b) => ({ a, b })),
}));

vi.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

vi.mock("../utils/attendee", () => ({
  generateAttendeeName: () => "Playful Cat",
}));

vi.mock("aws-amplify/api", () => ({
  generateClient: () => ({
    queries: {
      getMeetingMetadata: (...args: unknown[]) =>
        mockGetMeetingMetadata(...args),
    },
  }),
}));

vi.mock("../../amplify/data/resource", () => ({}));

import { useMeeting } from "./useMeeting";

describe("useMeeting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { pathname: "/" },
    });
  });

  it("starts with no joined meeting", () => {
    const { result } = renderHook(() => useMeeting());
    expect(result.current.joinedMeetingId).toBe("");
    expect(result.current.loadingAction).toBeNull();
    expect(result.current.error).toBe("");
  });

  it("sets error for invalid meeting pin", async () => {
    const { result } = renderHook(() => useMeeting());
    await act(async () => {
      await result.current.handleJoinMeeting("invalid pin!");
    });
    expect(result.current.error).toContain("Invalid meeting PIN");
  });

  it("joins a meeting successfully", async () => {
    mockGetMeetingMetadata.mockResolvedValue({
      data: {
        audioFallbackUrl: "url1",
        audioHostUrl: "url2",
        signalingUrl: "url3",
        turnControlUrl: "url4",
      },
    });

    const { result } = renderHook(() => useMeeting());
    await act(async () => {
      await result.current.handleJoinMeeting("valid-pin");
    });

    expect(result.current.joinedMeetingId).toBe("valid-pin");
    expect(result.current.error).toBe("");
    expect(mockJoin).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it("sets error on join failure", async () => {
    mockGetMeetingMetadata.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMeeting());
    await act(async () => {
      await result.current.handleJoinMeeting("valid-pin");
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.joinedMeetingId).toBe("");
  });

  it("auto-joins from URL path", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { pathname: "/my-meeting" },
    });
    mockGetMeetingMetadata.mockResolvedValue({
      data: {
        audioFallbackUrl: "u",
        audioHostUrl: "u",
        signalingUrl: "u",
        turnControlUrl: "u",
      },
    });

    renderHook(() => useMeeting());
    expect(mockGetMeetingMetadata).toHaveBeenCalled();
  });

  it("handleStartMeeting generates a pin and joins", async () => {
    mockGetMeetingMetadata.mockResolvedValue({
      data: {
        audioFallbackUrl: "u",
        audioHostUrl: "u",
        signalingUrl: "u",
        turnControlUrl: "u",
      },
    });

    const { result } = renderHook(() => useMeeting());
    await act(async () => {
      await result.current.handleStartMeeting();
    });

    expect(result.current.joinedMeetingId).toHaveLength(10);
  });

  it("passes a friendly attendeeName to getMeetingMetadata instead of a UUID", async () => {
    mockGetMeetingMetadata.mockResolvedValue({
      data: {
        audioFallbackUrl: "u",
        audioHostUrl: "u",
        signalingUrl: "u",
        turnControlUrl: "u",
      },
    });

    const { result } = renderHook(() => useMeeting());
    await act(async () => {
      await result.current.handleJoinMeeting("valid-pin");
    });

    const callArgs = mockGetMeetingMetadata.mock.calls[0][0];
    expect(callArgs.attendeeName).toBe("Playful Cat");
    expect(callArgs.attendeeName).not.toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("returns attendeeName from the hook", () => {
    const { result } = renderHook(() => useMeeting());
    expect(result.current.attendeeName).toBe("Playful Cat");
  });

  it("setAttendeeName updates the attendee name", async () => {
    const { result } = renderHook(() => useMeeting());
    expect(result.current.attendeeName).toBe("Playful Cat");

    act(() => {
      result.current.setAttendeeName("Custom Name");
    });

    expect(result.current.attendeeName).toBe("Custom Name");
  });

  it("uses updated attendeeName when joining after setAttendeeName", async () => {
    mockGetMeetingMetadata.mockResolvedValue({
      data: {
        audioFallbackUrl: "u",
        audioHostUrl: "u",
        signalingUrl: "u",
        turnControlUrl: "u",
      },
    });

    const { result } = renderHook(() => useMeeting());

    act(() => {
      result.current.setAttendeeName("Custom Name");
    });

    await act(async () => {
      await result.current.handleJoinMeeting("valid-pin");
    });

    const callArgs = mockGetMeetingMetadata.mock.calls[0][0];
    expect(callArgs.attendeeName).toBe("Custom Name");
  });

  it("strips # characters from attendee name", () => {
    const { result } = renderHook(() => useMeeting());

    act(() => {
      result.current.setAttendeeName("Jane #1");
    });

    expect(result.current.attendeeName).toBe("Jane 1");
  });

  it("strips multiple # characters from attendee name", () => {
    const { result } = renderHook(() => useMeeting());

    act(() => {
      result.current.setAttendeeName("A#B#C");
    });

    expect(result.current.attendeeName).toBe("ABC");
  });
});
