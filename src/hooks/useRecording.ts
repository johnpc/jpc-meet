import { useState } from "react";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import {
  getRecordingState,
  getRecordingLabel,
  getRecordingIconType,
  getRecordingClickAction,
  pollForResult,
  RecordingState,
  RecordingIconType,
  RecordingClickAction,
} from "../utils/recording";

const client = generateClient<Schema>();

export interface UseRecordingReturn {
  recordingState: RecordingState;
  recordingLabel: string;
  iconType: RecordingIconType;
  clickAction: RecordingClickAction;
  handleRecord: () => Promise<void>;
  handleDownloadRecording: () => Promise<void>;
}

export function useRecording(): UseRecordingReturn {
  const meetingManager = useMeetingManager();
  const [isRecordStopping, setIsRecordStopping] = useState(false);
  const [recordingId, setRecordingId] = useState("");
  const [downloadKey, setDownloadKey] = useState("");

  const handleDownloadRecording = async () => {
    if (!downloadKey) return;
    const url = await getUrl({ path: downloadKey });
    window.open(url.url);
  };

  const handleStartRecording = async () => {
    const response = await client.queries.startRecording({
      meetingId: meetingManager.meetingId!,
    });
    if (!response.data?.value) {
      console.log({ response });
      alert("Failed to start recording");
      return;
    }
    setRecordingId(response.data.value);
  };

  const handleStopRecording = async () => {
    setIsRecordStopping(true);
    await client.queries.stopRecording({ recordingId });
    const key = await pollForResult(async () => {
      const response = await client.queries.getRecordingDownloadKey({
        recordingId: meetingManager.meetingId!,
      });
      return response.data?.value;
    });
    setDownloadKey(key);
    setRecordingId("");
    setIsRecordStopping(false);
  };

  const handleRecord = async () => {
    if (!recordingId) {
      await handleStartRecording();
    } else {
      await handleStopRecording();
    }
  };

  const recordingState = getRecordingState(
    recordingId,
    isRecordStopping,
    downloadKey,
  );

  return {
    recordingState,
    recordingLabel: getRecordingLabel(recordingState),
    iconType: getRecordingIconType(recordingState),
    clickAction: getRecordingClickAction(recordingState),
    handleRecord,
    handleDownloadRecording,
  };
}
