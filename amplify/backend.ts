import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import {
  getMeetingMetadata,
  startRecording,
  stopRecording,
  getRecordingDownloadKey,
} from "./function/resource";
import {
  CfnServiceLinkedRole,
  Effect,
  ManagedPolicy,
  PolicyStatement,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  storage,
  getMeetingMetadata,
  startRecording,
  stopRecording,
  getRecordingDownloadKey,
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
    "chime:CreateMediaCapturePipeline",
    "chime:DeleteMediaCapturePipeline",
  ],
  resources: ["*"],
});

const s3PolicyStatement = new PolicyStatement({
  actions: ["s3:*"],
  resources: ["*"],
});

backend.getMeetingMetadata.resources.lambda.addToRolePolicy(
  chimePolicyStatement,
);
backend.getMeetingMetadata.resources.lambda.role?.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonChimeSDK"),
);
backend.startRecording.resources.lambda.addToRolePolicy(chimePolicyStatement);
backend.startRecording.resources.lambda.addToRolePolicy(s3PolicyStatement);
backend.startRecording.resources.lambda.role?.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonChimeSDK"),
);
backend.stopRecording.resources.lambda.addToRolePolicy(chimePolicyStatement);
backend.stopRecording.resources.lambda.addToRolePolicy(s3PolicyStatement);
backend.stopRecording.resources.lambda.role?.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonChimeSDK"),
);

backend.getRecordingDownloadKey.resources.lambda.addToRolePolicy(
  s3PolicyStatement,
);

backend.storage.resources.bucket.addToResourcePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:ListBucket",
    ],
    resources: [
      backend.storage.resources.bucket.bucketArn,
      `${backend.storage.resources.bucket.bucketArn}/*`,
    ],
    principals: [new ServicePrincipal("chime.amazonaws.com")],
  }),
);

backend.storage.resources.bucket.addToResourcePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:ListBucket",
    ],
    resources: [
      backend.storage.resources.bucket.bucketArn,
      `${backend.storage.resources.bucket.bucketArn}/*`,
    ],
    principals: [new ServicePrincipal("mediapipelines.chime.amazonaws.com")],
  }),
);

if (!backend.stack.stackName.includes("sandbox")) {
  new CfnServiceLinkedRole(
    backend.stack,
    "ChimeSDKCreatePipelineServiceLinkedRole",
    {
      awsServiceName: "mediapipelines.chime.amazonaws.com",
      description:
        "Service-linked role for Amazon Chime SDK Create Pipeline. See https://docs.aws.amazon.com/chime-sdk/latest/dg/create-pipeline-role.html",
    },
  );
}
