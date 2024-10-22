import { defineFunction } from "@aws-amplify/backend";

export const getMeetingMetadata = defineFunction({
  name: "getMeetingMetadata",
  entry: "./getMeetingMetadata.ts",
});

export const endMeeting = defineFunction({
  name: "endMeeting",
  entry: "./endMeeting.ts",
});

export const startRecording = defineFunction({
  name: "startRecording",
  entry: "./startRecording.ts",
});

export const stopRecording = defineFunction({
  name: "stopRecording",
  entry: "./stopRecording.ts",
});

export const getRecordingDownloadKey = defineFunction({
  name: "getRecordingDownloadKey",
  entry: "./getRecordingDownloadKey.ts",
});
