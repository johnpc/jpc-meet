/* tslint:disable */

//  This file was automatically generated and should not be edited.

export type Attendee = {
  __typename: "Attendee";
  attendeeId?: string | null;
  attendeeName: string;
  createdAt: string;
  externalUserId?: string | null;
  id: string;
  joinToken?: string | null;
  meetingName: string;
  updatedAt: string;
};

export type Meeting = {
  __typename: "Meeting";
  audioFallbackUrl?: string | null;
  audioHostUrl?: string | null;
  createdAt: string;
  eventIngestionUrl?: string | null;
  externalMeetingId?: string | null;
  id: string;
  mediaRegion?: string | null;
  meetingId?: string | null;
  meetingName: string;
  screenDataUrl?: string | null;
  screenSharingUrl?: string | null;
  screenViewingUrl?: string | null;
  signalingUrl?: string | null;
  turnControlUrl?: string | null;
  updatedAt: string;
};

export type MeetingAndAttendee = {
  __typename: "MeetingAndAttendee";
  attendeeId?: string | null;
  attendeeName: string;
  audioFallbackUrl?: string | null;
  audioHostUrl?: string | null;
  eventIngestionUrl?: string | null;
  externalMeetingId?: string | null;
  externalUserId?: string | null;
  joinToken?: string | null;
  mediaRegion?: string | null;
  meetingId?: string | null;
  meetingName: string;
  screenDataUrl?: string | null;
  screenSharingUrl?: string | null;
  screenViewingUrl?: string | null;
  signalingUrl?: string | null;
  turnControlUrl?: string | null;
};

export type ModelAttendeeFilterInput = {
  and?: Array<ModelAttendeeFilterInput | null> | null;
  attendeeId?: ModelStringInput | null;
  attendeeName?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  externalUserId?: ModelStringInput | null;
  id?: ModelIDInput | null;
  joinToken?: ModelStringInput | null;
  meetingName?: ModelStringInput | null;
  not?: ModelAttendeeFilterInput | null;
  or?: Array<ModelAttendeeFilterInput | null> | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelStringInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}

export type ModelSizeInput = {
  between?: Array<number | null> | null;
  eq?: number | null;
  ge?: number | null;
  gt?: number | null;
  le?: number | null;
  lt?: number | null;
  ne?: number | null;
};

export type ModelIDInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export type ModelAttendeeConnection = {
  __typename: "ModelAttendeeConnection";
  items: Array<Attendee | null>;
  nextToken?: string | null;
};

export type ModelMeetingFilterInput = {
  and?: Array<ModelMeetingFilterInput | null> | null;
  audioFallbackUrl?: ModelStringInput | null;
  audioHostUrl?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  eventIngestionUrl?: ModelStringInput | null;
  externalMeetingId?: ModelStringInput | null;
  id?: ModelIDInput | null;
  mediaRegion?: ModelStringInput | null;
  meetingId?: ModelStringInput | null;
  meetingName?: ModelStringInput | null;
  not?: ModelMeetingFilterInput | null;
  or?: Array<ModelMeetingFilterInput | null> | null;
  screenDataUrl?: ModelStringInput | null;
  screenSharingUrl?: ModelStringInput | null;
  screenViewingUrl?: ModelStringInput | null;
  signalingUrl?: ModelStringInput | null;
  turnControlUrl?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelMeetingConnection = {
  __typename: "ModelMeetingConnection";
  items: Array<Meeting | null>;
  nextToken?: string | null;
};

export type ModelAttendeeConditionInput = {
  and?: Array<ModelAttendeeConditionInput | null> | null;
  attendeeId?: ModelStringInput | null;
  attendeeName?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  externalUserId?: ModelStringInput | null;
  joinToken?: ModelStringInput | null;
  meetingName?: ModelStringInput | null;
  not?: ModelAttendeeConditionInput | null;
  or?: Array<ModelAttendeeConditionInput | null> | null;
  updatedAt?: ModelStringInput | null;
};

export type CreateAttendeeInput = {
  attendeeId?: string | null;
  attendeeName: string;
  externalUserId?: string | null;
  id?: string | null;
  joinToken?: string | null;
  meetingName: string;
};

export type ModelMeetingConditionInput = {
  and?: Array<ModelMeetingConditionInput | null> | null;
  audioFallbackUrl?: ModelStringInput | null;
  audioHostUrl?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  eventIngestionUrl?: ModelStringInput | null;
  externalMeetingId?: ModelStringInput | null;
  mediaRegion?: ModelStringInput | null;
  meetingId?: ModelStringInput | null;
  meetingName?: ModelStringInput | null;
  not?: ModelMeetingConditionInput | null;
  or?: Array<ModelMeetingConditionInput | null> | null;
  screenDataUrl?: ModelStringInput | null;
  screenSharingUrl?: ModelStringInput | null;
  screenViewingUrl?: ModelStringInput | null;
  signalingUrl?: ModelStringInput | null;
  turnControlUrl?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type CreateMeetingInput = {
  audioFallbackUrl?: string | null;
  audioHostUrl?: string | null;
  eventIngestionUrl?: string | null;
  externalMeetingId?: string | null;
  id?: string | null;
  mediaRegion?: string | null;
  meetingId?: string | null;
  meetingName: string;
  screenDataUrl?: string | null;
  screenSharingUrl?: string | null;
  screenViewingUrl?: string | null;
  signalingUrl?: string | null;
  turnControlUrl?: string | null;
};

export type DeleteAttendeeInput = {
  id: string;
};

export type DeleteMeetingInput = {
  id: string;
};

export type UpdateAttendeeInput = {
  attendeeId?: string | null;
  attendeeName?: string | null;
  externalUserId?: string | null;
  id: string;
  joinToken?: string | null;
  meetingName?: string | null;
};

export type UpdateMeetingInput = {
  audioFallbackUrl?: string | null;
  audioHostUrl?: string | null;
  eventIngestionUrl?: string | null;
  externalMeetingId?: string | null;
  id: string;
  mediaRegion?: string | null;
  meetingId?: string | null;
  meetingName?: string | null;
  screenDataUrl?: string | null;
  screenSharingUrl?: string | null;
  screenViewingUrl?: string | null;
  signalingUrl?: string | null;
  turnControlUrl?: string | null;
};

export type ModelSubscriptionAttendeeFilterInput = {
  and?: Array<ModelSubscriptionAttendeeFilterInput | null> | null;
  attendeeId?: ModelSubscriptionStringInput | null;
  attendeeName?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  externalUserId?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  joinToken?: ModelSubscriptionStringInput | null;
  meetingName?: ModelSubscriptionStringInput | null;
  or?: Array<ModelSubscriptionAttendeeFilterInput | null> | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionMeetingFilterInput = {
  and?: Array<ModelSubscriptionMeetingFilterInput | null> | null;
  audioFallbackUrl?: ModelSubscriptionStringInput | null;
  audioHostUrl?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  eventIngestionUrl?: ModelSubscriptionStringInput | null;
  externalMeetingId?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  mediaRegion?: ModelSubscriptionStringInput | null;
  meetingId?: ModelSubscriptionStringInput | null;
  meetingName?: ModelSubscriptionStringInput | null;
  or?: Array<ModelSubscriptionMeetingFilterInput | null> | null;
  screenDataUrl?: ModelSubscriptionStringInput | null;
  screenSharingUrl?: ModelSubscriptionStringInput | null;
  screenViewingUrl?: ModelSubscriptionStringInput | null;
  signalingUrl?: ModelSubscriptionStringInput | null;
  turnControlUrl?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type GetAttendeeQueryVariables = {
  id: string;
};

export type GetAttendeeQuery = {
  getAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type GetMeetingQueryVariables = {
  id: string;
};

export type GetMeetingQuery = {
  getMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type GetMeetingMetadataQueryVariables = {
  attendeeName: string;
  meetingName: string;
};

export type GetMeetingMetadataQuery = {
  getMeetingMetadata?: {
    __typename: "MeetingAndAttendee";
    attendeeId?: string | null;
    attendeeName: string;
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    externalUserId?: string | null;
    joinToken?: string | null;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
  } | null;
};

export type ListAttendeeByMeetingNameQueryVariables = {
  filter?: ModelAttendeeFilterInput | null;
  limit?: number | null;
  meetingName: string;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListAttendeeByMeetingNameQuery = {
  listAttendeeByMeetingName?: {
    __typename: "ModelAttendeeConnection";
    items: Array<{
      __typename: "Attendee";
      attendeeId?: string | null;
      attendeeName: string;
      createdAt: string;
      externalUserId?: string | null;
      id: string;
      joinToken?: string | null;
      meetingName: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListAttendeesQueryVariables = {
  filter?: ModelAttendeeFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListAttendeesQuery = {
  listAttendees?: {
    __typename: "ModelAttendeeConnection";
    items: Array<{
      __typename: "Attendee";
      attendeeId?: string | null;
      attendeeName: string;
      createdAt: string;
      externalUserId?: string | null;
      id: string;
      joinToken?: string | null;
      meetingName: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListMeetingByMeetingNameQueryVariables = {
  filter?: ModelMeetingFilterInput | null;
  limit?: number | null;
  meetingName: string;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListMeetingByMeetingNameQuery = {
  listMeetingByMeetingName?: {
    __typename: "ModelMeetingConnection";
    items: Array<{
      __typename: "Meeting";
      audioFallbackUrl?: string | null;
      audioHostUrl?: string | null;
      createdAt: string;
      eventIngestionUrl?: string | null;
      externalMeetingId?: string | null;
      id: string;
      mediaRegion?: string | null;
      meetingId?: string | null;
      meetingName: string;
      screenDataUrl?: string | null;
      screenSharingUrl?: string | null;
      screenViewingUrl?: string | null;
      signalingUrl?: string | null;
      turnControlUrl?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ListMeetingsQueryVariables = {
  filter?: ModelMeetingFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMeetingsQuery = {
  listMeetings?: {
    __typename: "ModelMeetingConnection";
    items: Array<{
      __typename: "Meeting";
      audioFallbackUrl?: string | null;
      audioHostUrl?: string | null;
      createdAt: string;
      eventIngestionUrl?: string | null;
      externalMeetingId?: string | null;
      id: string;
      mediaRegion?: string | null;
      meetingId?: string | null;
      meetingName: string;
      screenDataUrl?: string | null;
      screenSharingUrl?: string | null;
      screenViewingUrl?: string | null;
      signalingUrl?: string | null;
      turnControlUrl?: string | null;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type CreateAttendeeMutationVariables = {
  condition?: ModelAttendeeConditionInput | null;
  input: CreateAttendeeInput;
};

export type CreateAttendeeMutation = {
  createAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type CreateMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null;
  input: CreateMeetingInput;
};

export type CreateMeetingMutation = {
  createMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type DeleteAttendeeMutationVariables = {
  condition?: ModelAttendeeConditionInput | null;
  input: DeleteAttendeeInput;
};

export type DeleteAttendeeMutation = {
  deleteAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type DeleteMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null;
  input: DeleteMeetingInput;
};

export type DeleteMeetingMutation = {
  deleteMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type UpdateAttendeeMutationVariables = {
  condition?: ModelAttendeeConditionInput | null;
  input: UpdateAttendeeInput;
};

export type UpdateAttendeeMutation = {
  updateAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type UpdateMeetingMutationVariables = {
  condition?: ModelMeetingConditionInput | null;
  input: UpdateMeetingInput;
};

export type UpdateMeetingMutation = {
  updateMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type OnCreateAttendeeSubscriptionVariables = {
  filter?: ModelSubscriptionAttendeeFilterInput | null;
};

export type OnCreateAttendeeSubscription = {
  onCreateAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type OnCreateMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null;
};

export type OnCreateMeetingSubscription = {
  onCreateMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type OnDeleteAttendeeSubscriptionVariables = {
  filter?: ModelSubscriptionAttendeeFilterInput | null;
};

export type OnDeleteAttendeeSubscription = {
  onDeleteAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null;
};

export type OnDeleteMeetingSubscription = {
  onDeleteMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};

export type OnUpdateAttendeeSubscriptionVariables = {
  filter?: ModelSubscriptionAttendeeFilterInput | null;
};

export type OnUpdateAttendeeSubscription = {
  onUpdateAttendee?: {
    __typename: "Attendee";
    attendeeId?: string | null;
    attendeeName: string;
    createdAt: string;
    externalUserId?: string | null;
    id: string;
    joinToken?: string | null;
    meetingName: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateMeetingSubscriptionVariables = {
  filter?: ModelSubscriptionMeetingFilterInput | null;
};

export type OnUpdateMeetingSubscription = {
  onUpdateMeeting?: {
    __typename: "Meeting";
    audioFallbackUrl?: string | null;
    audioHostUrl?: string | null;
    createdAt: string;
    eventIngestionUrl?: string | null;
    externalMeetingId?: string | null;
    id: string;
    mediaRegion?: string | null;
    meetingId?: string | null;
    meetingName: string;
    screenDataUrl?: string | null;
    screenSharingUrl?: string | null;
    screenViewingUrl?: string | null;
    signalingUrl?: string | null;
    turnControlUrl?: string | null;
    updatedAt: string;
  } | null;
};
