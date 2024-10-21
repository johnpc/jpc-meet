import { defineFunction } from "@aws-amplify/backend";

export const getMeetingMetadata = defineFunction({
  name: "getMeetingMetadata",
  entry: "./getMeetingMetadata.ts",
});

export const endMeeting = defineFunction({
  name: "endMeeting",
  entry: "./endMeeting.ts",
});
