export type RecordingState = "idle" | "recording" | "stopping" | "ready";
export type RecordingIconType = "record" | "pause" | "loader" | "play";

export function getRecordingState(
  recordingId: string,
  isRecordStopping: boolean,
  downloadKey: string,
): RecordingState {
  if (downloadKey) return "ready";
  if (isRecordStopping) return "stopping";
  if (recordingId) return "recording";
  return "idle";
}

export function getRecordingLabel(state: RecordingState): string {
  switch (state) {
    case "idle":
      return "Record";
    case "recording":
      return "Stop Recording";
    case "stopping":
      return "Preparing...";
    case "ready":
      return "Download Recording";
  }
}

export function getRecordingIconType(state: RecordingState): RecordingIconType {
  switch (state) {
    case "idle":
      return "record";
    case "recording":
      return "pause";
    case "stopping":
      return "loader";
    case "ready":
      return "play";
  }
}

export type RecordingClickAction = "noop" | "download" | "toggle";

export function getRecordingClickAction(
  state: RecordingState,
): RecordingClickAction {
  switch (state) {
    case "stopping":
      return "noop";
    case "ready":
      return "download";
    default:
      return "toggle";
  }
}

export async function pollForResult<T>(
  fn: () => Promise<T | undefined>,
  intervalMs: number = 1000,
): Promise<T> {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  let result: T | undefined;
  do {
    await sleep(intervalMs);
    result = await fn();
  } while (!result);
  return result;
}
