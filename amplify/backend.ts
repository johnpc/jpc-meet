import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { getMeetingMetadata } from "./function/resource";
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  getMeetingMetadata,
});

const chimePolicyStatement = new PolicyStatement({
  actions: [
    "chime:CreateMeeting",
    "chime:DeleteMeeting",
    "chime:GetMeeting",
    "chime:ListMeetings",
    "chime:CreateAttendee",
    "chime:BatchCreateAttendee",
    "chime:DeleteAttendee",
    "chime:GetAttendee",
    "chime:ListAttendees",
  ],
  resources: ["*"],
});

backend.getMeetingMetadata.resources.lambda.addToRolePolicy(
  chimePolicyStatement,
);
backend.getMeetingMetadata.resources.lambda.role?.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonChimeSDK"),
);
