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
  Dots,
} from "amazon-chime-sdk-component-library-react";
import { Loader, Text } from "@aws-amplify/ui-react";
import { useRecording } from "../hooks/useRecording";
import ChatToggleButton from "./ChatToggleButton";
import { EditNameButton } from "./EditNameButton";

export interface MeetingControlBarProps {
  attendeeName?: string;
  onNameChange?: (newName: string) => void;
}

const MeetingControlBar = ({
  attendeeName,
  onNameChange,
}: MeetingControlBarProps) => {
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { toggleContentShare } = useContentShareControls();
  const {
    recordingLabel,
    iconType,
    clickAction,
    handleRecord,
    handleDownloadRecording,
  } = useRecording();
  const [showMore, setShowMore] = useState(false);

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
    <>
      <div className="control-bar-wrapper">
        <ControlBar showLabels={true} responsive={false} layout="bottom">
          <ControlBarButton
            icon={<LeaveMeeting />}
            onClick={() => meetingManager.leave()}
            label="Leave"
          />
          <AudioInputControl />
          <VideoInputControl />
          <ControlBarButton
            icon={<ScreenShare />}
            onClick={() => toggleContentShare()}
            label="Share"
          />
          <ChatToggleButton />
          <ControlBarButton
            icon={<Dots />}
            onClick={() => setShowMore(!showMore)}
            label="More"
          />
        </ControlBar>
      </div>
      {showMore && (
        <div className="more-controls-overlay" onClick={() => setShowMore(false)}>
          <div
            className="more-controls-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <ControlBar showLabels={true} responsive={false} layout="bottom">
              <ControlBarButton
                icon={iconMap[iconType]}
                onClick={() => {
                  clickMap[clickAction]();
                  setShowMore(false);
                }}
                label={
                  (
                    <Text textAlign={"center"}>{recordingLabel}</Text>
                  ) as unknown as string
                }
              />
              <AudioOutputControl />
              {attendeeName && onNameChange && (
                <EditNameButton
                  attendeeName={attendeeName}
                  onNameChange={onNameChange}
                />
              )}
            </ControlBar>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingControlBar;
