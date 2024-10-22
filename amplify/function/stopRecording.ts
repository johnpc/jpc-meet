import { Schema } from "../data/resource";

import {
  ChimeSDKMediaPipelinesClient,
  DeleteMediaCapturePipelineCommand,
} from "@aws-sdk/client-chime-sdk-media-pipelines";

const client = new ChimeSDKMediaPipelinesClient();

async function stopRecording(mediaPipelineId: string) {
  const input = { MediaPipelineId: mediaPipelineId };
  const command = new DeleteMediaCapturePipelineCommand(input);
  const response = await client.send(command);
  console.log("Recording stopped:", response);
  return response;
}

export const handler: Schema["stopRecording"]["functionHandler"] = async (
  input,
) => {
  await stopRecording(input.arguments.recordingId);
  return {
    value: "success",
  };
};
