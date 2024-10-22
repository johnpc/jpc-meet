import { Schema } from "../data/resource";
import {
  ArtifactsConcatenationState,
  AudioArtifactsConcatenationState,
  ChimeSDKMediaPipelinesClient,
  ConcatenationSinkType,
  ConcatenationSourceType,
  ContentShareLayoutOption,
  CreateMediaCapturePipelineCommand,
  CreateMediaConcatenationPipelineCommand,
  LayoutOption,
  ResolutionOption,
} from "@aws-sdk/client-chime-sdk-media-pipelines";
import { env } from "$amplify/env/startRecording";
import { STS, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
const stsClient = new STS();
const client = new ChimeSDKMediaPipelinesClient();
async function startRecording(meetingId: string) {
  const callerIdentity = await stsClient.send(new GetCallerIdentityCommand({}));
  const bucketArn = `arn:aws:s3:::${env.MEETING_RECORDINGS_BUCKET_NAME}`;
  const sourceArn = `arn:aws:chime::${callerIdentity.Account!}:meeting:${meetingId}`;
  console.log({ bucketArn });
  const command = new CreateMediaCapturePipelineCommand({
    ClientRequestToken: meetingId,
    SourceType: "ChimeSdkMeeting",
    SourceArn: sourceArn,
    SinkType: "S3Bucket",
    SinkArn: bucketArn,
    ChimeSdkMeetingConfiguration: {
      ArtifactsConfiguration: {
        Audio: { MuxType: "AudioWithCompositedVideo" },
        Video: { State: "Disabled", MuxType: "VideoOnly" },
        Content: { State: "Disabled", MuxType: "ContentOnly" },
        CompositedVideo: {
          Layout: LayoutOption.GridView,
          Resolution: ResolutionOption.HD,
          GridViewConfiguration: {
            ContentShareLayout: ContentShareLayoutOption.Horizontal,
            // PresenterOnlyConfiguration: { PresenterPosition: PresenterPosition.BottomRight },
            // ActiveSpeakerOnlyConfiguration: { ActiveSpeakerPosition: ActiveSpeakerPosition.BottomRight },
            // HorizontalLayoutConfiguration: {
            //   TileOrder: TileOrder.SpeakerSequence,
            //   TilePosition: HorizontalTilePosition.Top,
            //   TileCount: 10,
            //   TileAspectRatio: undefined,
            // },
            // VerticalLayoutConfiguration: {
            //   TileOrder: TileOrder.SpeakerSequence,
            //   TilePosition: VerticalTilePosition.Left,
            //   TileCount: 10,
            //   TileAspectRatio: undefined,
            // },
            VideoAttribute: {
              CornerRadius: undefined,
              BorderColor: undefined,
              HighlightColor: undefined,
              BorderThickness: undefined,
            },
            // CanvasOrientation: CanvasOrientation.Landscape,
          },
        },
      },
    },
  });
  const response = await client.send(command);

  const createMediaConcatenationPipelineCommand =
    new CreateMediaConcatenationPipelineCommand({
      ClientRequestToken: meetingId,
      Sources: [
        {
          Type: ConcatenationSourceType.MediaCapturePipeline,
          MediaCapturePipelineSourceConfiguration: {
            MediaPipelineArn: response.MediaCapturePipeline!.MediaPipelineArn!,
            ChimeSdkMeetingConfiguration: {
              ArtifactsConfiguration: {
                Audio: {
                  State: AudioArtifactsConcatenationState.Enabled,
                },
                Video: { State: ArtifactsConcatenationState.Disabled },
                Content: { State: ArtifactsConcatenationState.Disabled },
                DataChannel: { State: ArtifactsConcatenationState.Disabled },
                TranscriptionMessages: {
                  State: ArtifactsConcatenationState.Disabled,
                },
                MeetingEvents: { State: ArtifactsConcatenationState.Disabled },
                CompositedVideo: { State: ArtifactsConcatenationState.Enabled },
              },
            },
          },
        },
      ],
      Sinks: [
        {
          Type: ConcatenationSinkType.S3Bucket,
          S3BucketSinkConfiguration: {
            Destination: `${bucketArn}/public/${meetingId}`,
          },
        },
      ],
    });
  const concatResponse = await client.send(
    createMediaConcatenationPipelineCommand,
  );
  console.log("Recording started:", { response, concatResponse });
  return response.MediaCapturePipeline?.MediaPipelineId;
}
export const handler: Schema["startRecording"]["functionHandler"] = async (
  input,
) => {
  console.log({ msg: "STARTING RECORDING", input });
  try {
    const mediaPipelineId = await startRecording(input.arguments.meetingId);
    return {
      value: mediaPipelineId ?? "No recording id created",
    };
  } catch (error) {
    console.error({ error });
    return {
      value: `Error: ${(error as Error).message}`,
    };
  }
};
