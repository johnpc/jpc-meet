import { defineStorage } from "@aws-amplify/backend";
import {
  getRecordingDownloadKey,
  startRecording,
  stopRecording,
} from "../function/resource";

export const storage = defineStorage({
  name: "meeting-recordings",
  access: ({ authenticated, guest, resource }) => ({
    "public/*": [
      authenticated.to(["read", "write"]),
      guest.to(["read", "write"]),
      resource(startRecording).to(["read", "write"]),
      resource(stopRecording).to(["read", "write"]),
      resource(getRecordingDownloadKey).to(["read", "write"]),
    ],
  }),
});
