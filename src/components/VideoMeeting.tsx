import { useEffect } from "react";
import {
  useLocalVideo,
  VideoTileGrid,
  useMeetingStatus,
  MeetingStatus,
} from "amazon-chime-sdk-component-library-react";

const VideoMeeting = () => {
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  useEffect(() => {
    async function tog() {
      if (meetingStatus === MeetingStatus.Succeeded) {
        await toggleVideo();
      }
      if (meetingStatus === MeetingStatus.Ended) {
        console.log("Meeting Ended");
      }
    }
    tog();
  }, [meetingStatus]);

  return (
    <div style={{ height: "60vh", width: "80vw" }}>
      <VideoTileGrid />
    </div>
  );
};

export default VideoMeeting;
