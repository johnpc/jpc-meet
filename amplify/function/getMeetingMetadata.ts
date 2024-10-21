import { Schema } from "../data/resource";
import { getAttendeeFields } from "./getMeetingMetadata/getAttendeeFields";
import { getMeetingFields } from "./getMeetingMetadata/getMeetingFields";

export const handler: Schema["getMeetingMetadata"]["functionHandler"] = async (
  input,
) => {
  const meetingFields = await getMeetingFields(input.arguments.meetingName);
  const attendeeFields = await getAttendeeFields(
    input.arguments.meetingName,
    input.arguments.attendeeName,
    meetingFields,
  );

  return {
    meetingName: input.arguments.meetingName,
    ...meetingFields,
    ...attendeeFields,
  };
};
