import { env } from "$amplify/env/getRecordingDownloadKey";
import { Schema } from "../data/resource";

import { S3, ListObjectsCommand } from "@aws-sdk/client-s3";

async function getRecordingVideo(
  mediaPipelineId: string,
): Promise<string | undefined> {
  const s3Client = new S3();
  const files = await s3Client.send(
    new ListObjectsCommand({
      Bucket: env.MEETING_RECORDINGS_BUCKET_NAME,
      Prefix: `public/${mediaPipelineId}/composited-video`,
    }),
  );
  const file = files.Contents?.find((t) => t);
  return file?.Key;
}
export const handler: Schema["stopRecording"]["functionHandler"] = async (
  input,
) => {
  const key = await getRecordingVideo(input.arguments.recordingId);
  return {
    value: key ?? "",
  };
};
