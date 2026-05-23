import { VideoTileGrid } from "amazon-chime-sdk-component-library-react";
import { useVideoMeeting } from "../hooks/useVideoMeeting";

const VideoMeeting = () => {
  useVideoMeeting();

  return (
    <div style={{ height: "60vh", width: "80vw" }}>
      <VideoTileGrid />
    </div>
  );
};

export default VideoMeeting;
