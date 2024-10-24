import { ChangeEvent, useEffect, useState } from "react";
import {
  useAudioVideo,
  useMeetingManager,
  ControlBar,
  ControlBarButton,
  LeaveMeeting,
  AudioInputControl,
  Input,
  DeviceLabels,
  VideoInputControl,
  AudioOutputControl,
  Camera,
  useContentShareControls,
  ScreenShare,
  Record,
  Pause,
  Play,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { v4 as uuidv4 } from "uuid";
import { Loader, Text, useTheme } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
const client = generateClient<Schema>();

const MeetingControlBar = (props: {
  setJoinedMeetingId: (meetingId: string) => void;
}) => {
  const { tokens } = useTheme();
  const [requestId, setRequestId] = useState("");
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const [isLoading, setLoading] = useState(false);
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

  const isValidMeetingName = (meetingName: string) => {
    return /^[a-zA-Z0-9_-]+$/.test(meetingName);
  };

  const handleJoin = async (meetingNameOverride?: string) => {
    const meetingName = meetingNameOverride ?? requestId;
    if (!isValidMeetingName(meetingName)) {
      alert(
        "Invalid meeting PIN. Only alphanumeric characters, underscores, and dashes are allowed.",
      );
      return;
    }

    setLoading(true);
    const meetingFieldsResponse = await client.queries.getMeetingMetadata({
      meetingName: meetingNameOverride ?? requestId,
      attendeeName: uuidv4(),
    });

    const meetingFields = meetingFieldsResponse.data!;
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      {
        ...meetingFields,
        mediaPlacement: {
          ...meetingFields,
          audioFallbackUrl: meetingFields.audioFallbackUrl,
          audioHostUrl: meetingFields.audioHostUrl,
          signalingUrl: meetingFields.signalingUrl,
          turnControlUrl: meetingFields.turnControlUrl,
        },
      },
      { ...meetingFields },
    );

    const options = {
      deviceLabels: DeviceLabels.AudioAndVideo,
    };

    await meetingManager.join(meetingSessionConfiguration, options);
    await meetingManager.start();
    meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
    props.setJoinedMeetingId(meetingNameOverride ?? requestId);
    setLoading(false);
  };

  useEffect(() => {
    let path = window.location.pathname;
    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (path.length) {
      handleJoin(path);
    }
  }, []);

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

  return (
    <ControlBar showLabels={true} responsive={true} layout="bottom">
      {!audioVideo && (
        <Input
          disabled={isLoading}
          showClear={true}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRequestId(e.target.value)
          }
          sizing={"md"}
          value={requestId}
          placeholder="Meeting PIN"
          type="text"
        />
      )}
      {isLoading && <Loader margin={tokens.space.small} />}
      {!audioVideo && (
        <ControlBarButton
          icon={<Camera />}
          onClick={() => handleJoin()}
          label={
            (
              <Text textAlign={"center"}>Create or Join</Text>
            ) as unknown as string
          }
        />
      )}
      {audioVideo && (
        <>
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
        </>
      )}
    </ControlBar>
  );
};

export default MeetingControlBar;
