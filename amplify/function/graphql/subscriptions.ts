/* tslint:disable */

// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAttendee =
  /* GraphQL */ `subscription OnCreateAttendee($filter: ModelSubscriptionAttendeeFilterInput) {
  onCreateAttendee(filter: $filter) {
    attendeeId
    attendeeName
    createdAt
    externalUserId
    id
    joinToken
    meetingName
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateAttendeeSubscriptionVariables,
    APITypes.OnCreateAttendeeSubscription
  >;
export const onCreateMeeting =
  /* GraphQL */ `subscription OnCreateMeeting($filter: ModelSubscriptionMeetingFilterInput) {
  onCreateMeeting(filter: $filter) {
    audioFallbackUrl
    audioHostUrl
    createdAt
    eventIngestionUrl
    externalMeetingId
    id
    mediaRegion
    meetingId
    meetingName
    screenDataUrl
    screenSharingUrl
    screenViewingUrl
    signalingUrl
    turnControlUrl
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateMeetingSubscriptionVariables,
    APITypes.OnCreateMeetingSubscription
  >;
export const onDeleteAttendee =
  /* GraphQL */ `subscription OnDeleteAttendee($filter: ModelSubscriptionAttendeeFilterInput) {
  onDeleteAttendee(filter: $filter) {
    attendeeId
    attendeeName
    createdAt
    externalUserId
    id
    joinToken
    meetingName
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteAttendeeSubscriptionVariables,
    APITypes.OnDeleteAttendeeSubscription
  >;
export const onDeleteMeeting =
  /* GraphQL */ `subscription OnDeleteMeeting($filter: ModelSubscriptionMeetingFilterInput) {
  onDeleteMeeting(filter: $filter) {
    audioFallbackUrl
    audioHostUrl
    createdAt
    eventIngestionUrl
    externalMeetingId
    id
    mediaRegion
    meetingId
    meetingName
    screenDataUrl
    screenSharingUrl
    screenViewingUrl
    signalingUrl
    turnControlUrl
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteMeetingSubscriptionVariables,
    APITypes.OnDeleteMeetingSubscription
  >;
export const onUpdateAttendee =
  /* GraphQL */ `subscription OnUpdateAttendee($filter: ModelSubscriptionAttendeeFilterInput) {
  onUpdateAttendee(filter: $filter) {
    attendeeId
    attendeeName
    createdAt
    externalUserId
    id
    joinToken
    meetingName
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateAttendeeSubscriptionVariables,
    APITypes.OnUpdateAttendeeSubscription
  >;
export const onUpdateMeeting =
  /* GraphQL */ `subscription OnUpdateMeeting($filter: ModelSubscriptionMeetingFilterInput) {
  onUpdateMeeting(filter: $filter) {
    audioFallbackUrl
    audioHostUrl
    createdAt
    eventIngestionUrl
    externalMeetingId
    id
    mediaRegion
    meetingId
    meetingName
    screenDataUrl
    screenSharingUrl
    screenViewingUrl
    signalingUrl
    turnControlUrl
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateMeetingSubscriptionVariables,
    APITypes.OnUpdateMeetingSubscription
  >;
