import { v4 as uuidv4 } from "uuid";
import { env } from "$amplify/env/getMeetingMetadata";
import { getDataClient } from "./getDataClient";
import { listAttendeeByMeetingName } from "../graphql/queries";
import { MeetingFields } from "./getMeetingFields";
import { createAttendee } from "../graphql/mutations";
import {
  ChimeSDKMeetings,
  CreateAttendeeCommand,
} from "@aws-sdk/client-chime-sdk-meetings";

export type AttendeeFields = {
  attendeeName: string;
  attendeeId: string | undefined | null;
  externalUserId: string | undefined | null;
  joinToken: string | undefined | null;
};

const getExistingAttendee = async (
  meetingName: string,
  attendeeName: string,
): Promise<AttendeeFields | void> => {
  const dataClient = getDataClient();
  const attendeeResponse = await dataClient.graphql({
    query: listAttendeeByMeetingName,
    variables: {
      meetingName,
    },
  });
  const attendee = attendeeResponse.data.listAttendeeByMeetingName.items.find(
    (t) => t.attendeeName === attendeeName,
  );
  if (!attendee) {
    return;
  }

  return {
    attendeeName: attendee.attendeeName,
    attendeeId: attendee.attendeeId,
    externalUserId: attendee.externalUserId,
    joinToken: attendee.joinToken,
  };
};

const createChimeAttendee = async (
  meetingName: string,
  attendeeName: string,
  meetingFields: MeetingFields,
): Promise<AttendeeFields> => {
  const chime = new ChimeSDKMeetings({ region: env.AWS_REGION });
  const dataClient = getDataClient();
  const attendeeResponse = await chime.send(
    new CreateAttendeeCommand({
      MeetingId: meetingFields.meetingId!,
      ExternalUserId: uuidv4(),
    }),
  );
  const attendeeFields = {
    attendeeName,
    attendeeId: attendeeResponse.Attendee?.AttendeeId,
    externalUserId: attendeeResponse.Attendee?.ExternalUserId,
    joinToken: attendeeResponse.Attendee?.JoinToken,
  };

  await dataClient.graphql({
    query: createAttendee,
    variables: {
      input: { meetingName, ...attendeeFields },
    },
  });

  return attendeeFields;
};

export const getAttendeeFields = async (
  meetingName: string,
  attendeeName: string,
  meetingFields: MeetingFields,
): Promise<AttendeeFields> => {
  const existingAttendee = await getExistingAttendee(meetingName, attendeeName);
  if (existingAttendee) {
    console.log({ existingAttendee });
  } else {
    console.log(
      `Creating attendee with name ${attendeeName} for meeting ${meetingName}`,
    );
  }
  return await createChimeAttendee(meetingName, attendeeName, meetingFields);
};
