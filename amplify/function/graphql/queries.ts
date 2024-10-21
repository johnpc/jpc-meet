/* tslint:disable */

// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAttendee = /* GraphQL */ `query GetAttendee($id: ID!) {
  getAttendee(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAttendeeQueryVariables,
  APITypes.GetAttendeeQuery
>;
export const getMeeting = /* GraphQL */ `query GetMeeting($id: ID!) {
  getMeeting(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMeetingQueryVariables,
  APITypes.GetMeetingQuery
>;
export const getMeetingMetadata =
  /* GraphQL */ `query GetMeetingMetadata($attendeeName: String!, $meetingName: String!) {
  getMeetingMetadata(attendeeName: $attendeeName, meetingName: $meetingName) {
    attendeeId
    attendeeName
    audioFallbackUrl
    audioHostUrl
    eventIngestionUrl
    externalMeetingId
    externalUserId
    joinToken
    mediaRegion
    meetingId
    meetingName
    screenDataUrl
    screenSharingUrl
    screenViewingUrl
    signalingUrl
    turnControlUrl
    __typename
  }
}
` as GeneratedQuery<
    APITypes.GetMeetingMetadataQueryVariables,
    APITypes.GetMeetingMetadataQuery
  >;
export const listAttendeeByMeetingName =
  /* GraphQL */ `query ListAttendeeByMeetingName(
  $filter: ModelAttendeeFilterInput
  $limit: Int
  $meetingName: String!
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAttendeeByMeetingName(
    filter: $filter
    limit: $limit
    meetingName: $meetingName
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListAttendeeByMeetingNameQueryVariables,
    APITypes.ListAttendeeByMeetingNameQuery
  >;
export const listAttendees = /* GraphQL */ `query ListAttendees(
  $filter: ModelAttendeeFilterInput
  $limit: Int
  $nextToken: String
) {
  listAttendees(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendeesQueryVariables,
  APITypes.ListAttendeesQuery
>;
export const listMeetingByMeetingName =
  /* GraphQL */ `query ListMeetingByMeetingName(
  $filter: ModelMeetingFilterInput
  $limit: Int
  $meetingName: String!
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMeetingByMeetingName(
    filter: $filter
    limit: $limit
    meetingName: $meetingName
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
    APITypes.ListMeetingByMeetingNameQueryVariables,
    APITypes.ListMeetingByMeetingNameQuery
  >;
export const listMeetings = /* GraphQL */ `query ListMeetings(
  $filter: ModelMeetingFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeetings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeetingsQueryVariables,
  APITypes.ListMeetingsQuery
>;
