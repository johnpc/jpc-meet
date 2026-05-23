import { useState } from "react";
import {
  useAudioVideo,
  useMeetingManager,
  ControlBar,
  ControlBarButton,
  LeaveMeeting,
  AudioInputControl,
  VideoInputControl,
  AudioOutputControl,
  useContentShareControls,
  ScreenShare,
  Record,
  Pause,
  Play,
} from "amazon-chime-sdk-component-library-react";
import { Loader, Text } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
const client = generateClient<Schema>();

const MeetingControlBar = () => {
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const [isRecordStopping, setIsRecordStopping] = useState(false);
  const [recordingId, setRecordingId] = useState("");
  const [downloadKey, setDownloadKey] = useState("");
  const { toggleContentShare } = useContentShareControls();

  const handleLeave = async () => {
    await meetingManager.leave();
  };

  const handleToggleScreenshare = async () => {
    toggleContentShare();
  };

  const handleDownloadRecording = async () => {
    if (!downloadKey) return;
    const url = await getUrl({ path: downloadKey });
    window.open(url.url);
  };

  const handleRecord = async () => {
    if (!recordingId) {
      const response = await client.queries.startRecording({
        meetingId: meetingManager.meetingId!,
      });
      if (!response.data?.value) {
        console.log({ response });
        alert("Failed to start recording");
        return;
      }
      setRecordingId(response.data.value);
    } else {
      setIsRecordStopping(true);
      console.log({ recordingId, meetingId: meetingManager.meetingId });
      await client.queries.stopRecording({
        recordingId,
      });
      const sleep = (durationMs: number) =>
        new Promise((resolve) => setTimeout(resolve, durationMs));
      let key: string | undefined = undefined;
      do {
        await sleep(1000);
        const response = await client.queries.getRecordingDownloadKey({
          recordingId: meetingManager.meetingId!,
        });
        key = response.data?.value;
      } while (!key);

      setDownloadKey(key);
      setRecordingId("");
      setIsRecordStopping(false);
    }
  };

  let recordControlBarButton = (
    <ControlBarButton
      icon={<Record />}
      onClick={() => handleRecord()}
      label={
        (<Text textAlign={"center"}>{"Record"}</Text>) as unknown as string
      }
    />
  );

  if (recordingId) {
    recordControlBarButton = (
      <ControlBarButton
        icon={<Pause />}
        onClick={() => handleRecord()}
        label={
          (
            <Text textAlign={"center"}>{"Stop Recording"}</Text>
          ) as unknown as string
        }
      />
    );
  }

  if (isRecordStopping) {
    recordControlBarButton = (
      <ControlBarButton
        icon={<Loader />}
        onClick={() => console.log("wait for it...")}
        label={"Preparing..." as unknown as string}
      />
    );
  }

  if (downloadKey) {
    recordControlBarButton = (
      <ControlBarButton
        icon={<Play />}
        onClick={() => handleDownloadRecording()}
        label={
          (
            <Text textAlign={"center"}>Download Recording</Text>
          ) as unknown as string
        }
      />
    );
  }

  if (!audioVideo) {
    return null;
  }

  return (
    <ControlBar showLabels={true} responsive={true} layout="bottom">
      <ControlBarButton
        icon={<LeaveMeeting />}
        onClick={() => handleLeave()}
        label="Leave"
      />
      <ControlBarButton
        icon={<ScreenShare />}
        onClick={() => handleToggleScreenshare()}
        label="Share"
      />

      {recordControlBarButton}
      <AudioInputControl />
      <AudioOutputControl />
      <VideoInputControl />
    </ControlBar>
  );
};

export default MeetingControlBar;
