import { ChangeEvent, useState } from "react";
import {
  useAudioVideo,
  useMeetingManager,
  ControlBar,
  ControlBarButton,
  Meeting,
  LeaveMeeting,
  AudioInputControl,
  Input,
  DeviceLabels,
  Remove,
  VideoInputControl,
  AudioOutputControl,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { v4 as uuidv4 } from "uuid";
import { Loader, useTheme } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
const client = generateClient<Schema>();

const MeetingControlBar = () => {
  const { tokens } = useTheme();
  const [meetingId, setMeetingId] = useState("");
  const [requestId, setRequestId] = useState("");
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const [isLoading, setLoading] = useState(false);

  const handleLeave = async () => {
    await meetingManager.leave();
  };

  const handleEnd = async () => {
    await client.queries.endMeeting({
      meetingName: meetingId,
    });
    await meetingManager.leave();
  };

  const handleJoin = async () => {
    setLoading(true);
    const meetingFields = (
      await client.queries.getMeetingMetadata({
        meetingName: requestId,
        attendeeName: uuidv4(),
      })
    ).data!;
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
    setMeetingId(meetingFields.meetingId!);
    setLoading(false);
  };

  return (
    <ControlBar showLabels={true} responsive={true} layout="bottom">
      {!audioVideo && (
        <Input
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
          icon={<Meeting />}
          onClick={() => handleJoin()}
          label="Join"
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
            icon={<Remove />}
            onClick={() => handleEnd()}
            label="End"
          />
          <AudioInputControl />
          <AudioOutputControl />
          <VideoInputControl />
        </>
      )}
    </ControlBar>
  );
};

export default MeetingControlBar;
