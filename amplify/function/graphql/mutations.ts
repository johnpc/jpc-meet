/* tslint:disable */

// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAttendee = /* GraphQL */ `mutation CreateAttendee(
  $condition: ModelAttendeeConditionInput
  $input: CreateAttendeeInput!
) {
  createAttendee(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAttendeeMutationVariables,
  APITypes.CreateAttendeeMutation
>;
export const createMeeting = /* GraphQL */ `mutation CreateMeeting(
  $condition: ModelMeetingConditionInput
  $input: CreateMeetingInput!
) {
  createMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMeetingMutationVariables,
  APITypes.CreateMeetingMutation
>;
export const deleteAttendee = /* GraphQL */ `mutation DeleteAttendee(
  $condition: ModelAttendeeConditionInput
  $input: DeleteAttendeeInput!
) {
  deleteAttendee(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAttendeeMutationVariables,
  APITypes.DeleteAttendeeMutation
>;
export const deleteMeeting = /* GraphQL */ `mutation DeleteMeeting(
  $condition: ModelMeetingConditionInput
  $input: DeleteMeetingInput!
) {
  deleteMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMeetingMutationVariables,
  APITypes.DeleteMeetingMutation
>;
export const updateAttendee = /* GraphQL */ `mutation UpdateAttendee(
  $condition: ModelAttendeeConditionInput
  $input: UpdateAttendeeInput!
) {
  updateAttendee(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAttendeeMutationVariables,
  APITypes.UpdateAttendeeMutation
>;
export const updateMeeting = /* GraphQL */ `mutation UpdateMeeting(
  $condition: ModelMeetingConditionInput
  $input: UpdateMeetingInput!
) {
  updateMeeting(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMeetingMutationVariables,
  APITypes.UpdateMeetingMutation
>;
