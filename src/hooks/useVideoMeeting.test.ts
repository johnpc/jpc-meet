import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useVideoMeeting } from "./useVideoMeeting";

const mockToggleVideo = vi.fn().mockResolvedValue(undefined);
let mockMeetingStatus = 0;

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useLocalVideo: () => ({ toggleVideo: mockToggleVideo }),
  useMeetingStatus: () => mockMeetingStatus,
  MeetingStatus: { Succeeded: 1, Ended: 3 },
}));

describe("useVideoMeeting", () => {
  it("toggles video when meeting succeeds", async () => {
    mockMeetingStatus = 1; // Succeeded
    renderHook(() => useVideoMeeting());
    await new Promise((r) => setTimeout(r, 0));
    expect(mockToggleVideo).toHaveBeenCalled();
  });

  it("logs when meeting ends", async () => {
    mockMeetingStatus = 3; // Ended
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    renderHook(() => useVideoMeeting());
    await new Promise((r) => setTimeout(r, 0));
    expect(consoleSpy).toHaveBeenCalledWith("Meeting Ended");
    consoleSpy.mockRestore();
  });

  it("does nothing for other statuses", async () => {
    mockMeetingStatus = 0;
    mockToggleVideo.mockClear();
    renderHook(() => useVideoMeeting());
    await new Promise((r) => setTimeout(r, 0));
    expect(mockToggleVideo).not.toHaveBeenCalled();
  });
});
