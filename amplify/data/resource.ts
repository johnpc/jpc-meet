import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {
  getMeetingMetadata,
  getRecordingDownloadKey,
  startRecording,
  stopRecording,
} from "../function/resource";

const schema = a
  .schema({
    MeetingAndAttendee: a.customType({
      meetingName: a.string().required(),
      externalMeetingId: a.string(),
      audioFallbackUrl: a.string(),
      audioHostUrl: a.string(),
      eventIngestionUrl: a.string(),
      screenDataUrl: a.string(),
      screenSharingUrl: a.string(),
      screenViewingUrl: a.string(),
      signalingUrl: a.string(),
      turnControlUrl: a.string(),
      mediaRegion: a.string(),
      meetingId: a.string(),
      attendeeName: a.string().required(),
      attendeeId: a.string(),
      externalUserId: a.string(),
      joinToken: a.string(),
    }),
    StringLike: a.customType({
      value: a.string().required(),
    }),
    Meeting: a
      .model({
        meetingName: a.string().required(),
        externalMeetingId: a.string(),
        audioFallbackUrl: a.string(),
        audioHostUrl: a.string(),
        eventIngestionUrl: a.string(),
        screenDataUrl: a.string(),
        screenSharingUrl: a.string(),
        screenViewingUrl: a.string(),
        signalingUrl: a.string(),
        turnControlUrl: a.string(),
        mediaRegion: a.string(),
        meetingId: a.string(),
      })
      .secondaryIndexes((index) => [index("meetingName")])
      .authorization((allow) => [allow.guest()]),

    Attendee: a
      .model({
        meetingName: a.string().required(),
        attendeeName: a.string().required(),
        attendeeId: a.string(),
        externalUserId: a.string(),
        joinToken: a.string(),
      })
      .secondaryIndexes((index) => [index("meetingName")])
      .authorization((allow) => [allow.guest()]),
    getMeetingMetadata: a
      .query()
      .arguments({
        meetingName: a.string().required(),
        attendeeName: a.string().required(),
      })
      .returns(a.ref("MeetingAndAttendee"))
      .handler(a.handler.function(getMeetingMetadata))
      .authorization((allow) => allow.guest()),
    startRecording: a
      .query()
      .arguments({
        meetingId: a.string().required(),
      })
      .returns(a.ref("StringLike"))
      .handler(a.handler.function(startRecording))
      .authorization((allow) => allow.guest()),
    stopRecording: a
      .query()
      .arguments({
        recordingId: a.string().required(),
      })
      .returns(a.ref("StringLike"))
      .handler(a.handler.function(stopRecording))
      .authorization((allow) => allow.guest()),
    endMeeting: a
      .query()
      .arguments({
        meetingName: a.string().required(),
      })
      .returns(a.ref("StringLike"))
      .handler(a.handler.function(getMeetingMetadata))
      .authorization((allow) => allow.guest()),
    getRecordingDownloadKey: a
      .query()
      .arguments({
        recordingId: a.string().required(),
      })
      .returns(a.ref("StringLike"))
      .handler(a.handler.function(getRecordingDownloadKey))
      .authorization((allow) => allow.guest()),
  })
  .authorization((allow) => allow.resource(getMeetingMetadata));

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
