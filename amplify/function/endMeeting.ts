import {
  ChimeSDKMeetingsClient,
  DeleteMeetingCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import { Schema } from "../data/resource";

const chimeSdkMeetingsClient = new ChimeSDKMeetingsClient();

export const handler: Schema["endMeeting"]["functionHandler"] = async (
  input,
) => {
  await chimeSdkMeetingsClient.send(
    new DeleteMeetingCommand({
      MeetingId: input.arguments.meetingName,
    }),
  );
  return {
    value: "success",
  };
};
