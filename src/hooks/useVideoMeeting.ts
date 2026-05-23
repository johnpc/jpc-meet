import { useEffect } from "react";
import {
  useLocalVideo,
  useMeetingStatus,
  MeetingStatus,
} from "amazon-chime-sdk-component-library-react";

export function useVideoMeeting() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingStatus]);
}
