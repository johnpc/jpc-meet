import { describe, it, expect, vi } from "vitest";
import {
  getRecordingState,
  getRecordingLabel,
  getRecordingIconType,
  getRecordingClickAction,
  pollForResult,
} from "./recording";

describe("getRecordingState", () => {
  it("returns 'idle' when no recording, not stopping, no download", () => {
    expect(getRecordingState("", false, "")).toBe("idle");
  });

  it("returns 'recording' when recordingId is set", () => {
    expect(getRecordingState("rec-123", false, "")).toBe("recording");
  });

  it("returns 'stopping' when isRecordStopping is true", () => {
    expect(getRecordingState("rec-123", true, "")).toBe("stopping");
  });

  it("returns 'ready' when downloadKey is set (highest priority)", () => {
    expect(getRecordingState("rec-123", true, "key.mp4")).toBe("ready");
  });

  it("returns 'ready' even with no recordingId if downloadKey exists", () => {
    expect(getRecordingState("", false, "key.mp4")).toBe("ready");
  });
});

describe("getRecordingLabel", () => {
  it("returns 'Record' for idle", () => {
    expect(getRecordingLabel("idle")).toBe("Record");
  });

  it("returns 'Stop Recording' for recording", () => {
    expect(getRecordingLabel("recording")).toBe("Stop Recording");
  });

  it("returns 'Preparing...' for stopping", () => {
    expect(getRecordingLabel("stopping")).toBe("Preparing...");
  });

  it("returns 'Download Recording' for ready", () => {
    expect(getRecordingLabel("ready")).toBe("Download Recording");
  });
});

describe("getRecordingIconType", () => {
  it("returns 'record' for idle", () => {
    expect(getRecordingIconType("idle")).toBe("record");
  });

  it("returns 'pause' for recording", () => {
    expect(getRecordingIconType("recording")).toBe("pause");
  });

  it("returns 'loader' for stopping", () => {
    expect(getRecordingIconType("stopping")).toBe("loader");
  });

  it("returns 'play' for ready", () => {
    expect(getRecordingIconType("ready")).toBe("play");
  });
});

describe("getRecordingClickAction", () => {
  it("returns 'noop' for stopping", () => {
    expect(getRecordingClickAction("stopping")).toBe("noop");
  });

  it("returns 'download' for ready", () => {
    expect(getRecordingClickAction("ready")).toBe("download");
  });

  it("returns 'toggle' for idle", () => {
    expect(getRecordingClickAction("idle")).toBe("toggle");
  });

  it("returns 'toggle' for recording", () => {
    expect(getRecordingClickAction("recording")).toBe("toggle");
  });
});

describe("pollForResult", () => {
  it("returns immediately when fn returns a value on first call", async () => {
    vi.useFakeTimers();
    const fn = vi.fn().mockResolvedValue("done");
    const promise = pollForResult(fn, 10);
    await vi.advanceTimersByTimeAsync(10);
    const result = await promise;
    expect(result).toBe("done");
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("polls until fn returns a truthy value", async () => {
    vi.useFakeTimers();
    const fn = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue("found");
    const promise = pollForResult(fn, 10);
    await vi.advanceTimersByTimeAsync(10);
    await vi.advanceTimersByTimeAsync(10);
    await vi.advanceTimersByTimeAsync(10);
    const result = await promise;
    expect(result).toBe("found");
    expect(fn).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });
});
