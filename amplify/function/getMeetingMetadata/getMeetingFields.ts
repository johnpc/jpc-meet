// import { Chime } from "@aws-sdk/client-chime";
import { v4 as uuidv4 } from "uuid";
import { env } from "$amplify/env/getMeetingMetadata";
import { getDataClient } from "./getDataClient";
import { listMeetingByMeetingName } from "../graphql/queries";
import { createMeeting } from "../graphql/mutations";
import {
  ChimeSDKMeetings,
  CreateMeetingCommand,
} from "@aws-sdk/client-chime-sdk-meetings";

export type MeetingFields = {
  externalMeetingId: string | undefined | null;
  audioFallbackUrl: string | undefined | null;
  audioHostUrl: string | undefined | null;
  eventIngestionUrl: string | undefined | null;
  screenDataUrl: string | undefined | null;
  screenSharingUrl: string | undefined | null;
  screenViewingUrl: string | undefined | null;
  signalingUrl: string | undefined | null;
  turnControlUrl: string | undefined | null;
  mediaRegion: string | undefined | null;
  meetingId: string | undefined | null;
};

const getExistingMeeting = async (
  meetingName: string,
): Promise<MeetingFields | void> => {
  const dataClient = getDataClient();
  const meetingResponse = await dataClient.graphql({
    query: listMeetingByMeetingName,
    variables: {
      meetingName,
    },
  });
  const meeting = meetingResponse.data.listMeetingByMeetingName.items.find(
    (t) => t,
  );
  if (!meeting) {
    return;
  }
  return {
    externalMeetingId: meeting.externalMeetingId,
    audioFallbackUrl: meeting.audioFallbackUrl,
    audioHostUrl: meeting.audioHostUrl,
    eventIngestionUrl: meeting.eventIngestionUrl,
    screenDataUrl: meeting.screenDataUrl,
    screenSharingUrl: meeting.screenSharingUrl,
    screenViewingUrl: meeting.screenViewingUrl,
    signalingUrl: meeting.signalingUrl,
    turnControlUrl: meeting.turnControlUrl,
    mediaRegion: meeting.mediaRegion,
    meetingId: meeting.meetingId,
  };
};

const createChimeMeeting = async (
  meetingName: string,
): Promise<MeetingFields> => {
  const dataClient = getDataClient();
  const chime = new ChimeSDKMeetings({ region: env.AWS_REGION });

  const meetingResponse = await chime.send(
    new CreateMeetingCommand({
      ClientRequestToken: meetingName || uuidv4(),
      MediaRegion: env.AWS_REGION,
      ExternalMeetingId: uuidv4(),
    }),
  );

  const meetingFields = {
    externalMeetingId: meetingResponse.Meeting?.ExternalMeetingId,
    audioFallbackUrl: meetingResponse.Meeting?.MediaPlacement?.AudioFallbackUrl,
    audioHostUrl: meetingResponse.Meeting?.MediaPlacement?.AudioHostUrl,
    eventIngestionUrl:
      meetingResponse.Meeting?.MediaPlacement?.EventIngestionUrl,
    screenDataUrl: meetingResponse.Meeting?.MediaPlacement?.ScreenDataUrl,
    screenSharingUrl: meetingResponse.Meeting?.MediaPlacement?.ScreenSharingUrl,
    screenViewingUrl: meetingResponse.Meeting?.MediaPlacement?.ScreenViewingUrl,
    signalingUrl: meetingResponse.Meeting?.MediaPlacement?.SignalingUrl,
    turnControlUrl: meetingResponse.Meeting?.MediaPlacement?.TurnControlUrl,
    mediaRegion: meetingResponse.Meeting?.MediaRegion,
    meetingId: meetingResponse.Meeting?.MeetingId,
  };

  await dataClient.graphql({
    query: createMeeting,
    variables: {
      input: { meetingName, ...meetingFields },
    },
  });

  return meetingFields;
};

export const getMeetingFields = async (
  meetingName: string,
): Promise<MeetingFields> => {
  const existingMeeting = await getExistingMeeting(meetingName);
  if (existingMeeting) {
    console.log({ existingMeeting });
  } else {
    console.log(`Creating meeting with name ${meetingName}`);
  }
  return await createChimeMeeting(meetingName);
};
