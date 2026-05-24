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
import { useRecording } from "../hooks/useRecording";
import ChatToggleButton from "./ChatToggleButton";

const MeetingControlBar = () => {
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { toggleContentShare } = useContentShareControls();
  const { recordingLabel, iconType, clickAction, handleRecord, handleDownloadRecording } =
    useRecording();

  const iconMap = {
    record: <Record />,
    pause: <Pause />,
    loader: <Loader />,
    play: <Play />,
  };

  const clickMap = {
    noop: () => console.log("wait for it..."),
    download: () => handleDownloadRecording(),
    toggle: () => handleRecord(),
  };

  if (!audioVideo) {
    return null;
  }

  return (
    <ControlBar showLabels={true} responsive={true} layout="bottom">
      <ControlBarButton
        icon={<LeaveMeeting />}
        onClick={() => meetingManager.leave()}
        label="Leave"
      />
      <ControlBarButton
        icon={<ScreenShare />}
        onClick={() => toggleContentShare()}
        label="Share"
      />
      <ChatToggleButton />
      <ControlBarButton
        icon={iconMap[iconType]}
        onClick={clickMap[clickAction]}
        label={
          (
            <Text textAlign={"center"}>{recordingLabel}</Text>
          ) as unknown as string
        }
      />
      <AudioInputControl />
      <AudioOutputControl />
      <VideoInputControl />
    </ControlBar>
  );
};

export default MeetingControlBar;
