import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockStartRecording = vi.fn();
const mockStopRecording = vi.fn();
const mockGetRecordingDownloadKey = vi.fn();

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useMeetingManager: () => ({
    meetingId: "meeting-123",
  }),
}));

vi.mock("aws-amplify/api", () => ({
  generateClient: () => ({
    queries: {
      startRecording: (...args: unknown[]) => mockStartRecording(...args),
      stopRecording: (...args: unknown[]) => mockStopRecording(...args),
      getRecordingDownloadKey: (...args: unknown[]) =>
        mockGetRecordingDownloadKey(...args),
    },
  }),
}));

vi.mock("aws-amplify/storage", () => ({
  getUrl: vi.fn().mockResolvedValue({ url: "https://download.url" }),
}));

vi.mock("../../amplify/data/resource", () => ({}));

import { useRecording } from "./useRecording";

describe("useRecording", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useRecording());
    expect(result.current.recordingState).toBe("idle");
    expect(result.current.recordingLabel).toBe("Record");
    expect(result.current.iconType).toBe("record");
    expect(result.current.clickAction).toBe("toggle");
  });

  it("starts recording successfully", async () => {
    mockStartRecording.mockResolvedValue({ data: { value: "rec-456" } });

    const { result } = renderHook(() => useRecording());
    await act(async () => {
      await result.current.handleRecord();
    });

    expect(result.current.recordingState).toBe("recording");
    expect(result.current.recordingLabel).toBe("Stop Recording");
    expect(result.current.iconType).toBe("pause");
  });

  it("alerts on start recording failure", async () => {
    mockStartRecording.mockResolvedValue({ data: null });
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    const { result } = renderHook(() => useRecording());
    await act(async () => {
      await result.current.handleRecord();
    });

    expect(alertSpy).toHaveBeenCalledWith("Failed to start recording");
    expect(result.current.recordingState).toBe("idle");
  });

  it("stops recording and polls for download key", async () => {
    vi.useFakeTimers();
    mockStartRecording.mockResolvedValue({ data: { value: "rec-789" } });
    mockStopRecording.mockResolvedValue({});
    mockGetRecordingDownloadKey
      .mockResolvedValueOnce({ data: { value: undefined } })
      .mockResolvedValueOnce({ data: { value: "recordings/file.mp4" } });

    const { result } = renderHook(() => useRecording());

    await act(async () => {
      await result.current.handleRecord();
    });
    expect(result.current.recordingState).toBe("recording");

    await act(async () => {
      const stopPromise = result.current.handleRecord();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(1000);
      await stopPromise;
    });

    expect(result.current.recordingState).toBe("ready");
    expect(result.current.recordingLabel).toBe("Download Recording");
    expect(result.current.iconType).toBe("play");
    expect(result.current.clickAction).toBe("download");
    vi.useRealTimers();
  });

  it("handleDownloadRecording does nothing when no key", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const { result } = renderHook(() => useRecording());
    await act(async () => {
      await result.current.handleDownloadRecording();
    });
    expect(openSpy).not.toHaveBeenCalled();
  });
});
