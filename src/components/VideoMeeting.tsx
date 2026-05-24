import {
  LocalVideo,
  RemoteVideo,
  useLocalVideo,
  useRemoteVideoTileState,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { useAttendeeNamesContext } from "../context/AttendeeNamesContext";
import { useVideoMeeting } from "../hooks/useVideoMeeting";

const VideoMeeting = () => {
  useVideoMeeting();

  const { isVideoEnabled } = useLocalVideo();
  const { tiles, tileIdToAttendeeId } = useRemoteVideoTileState();
  const { roster } = useRosterState();
  const { getAttendeeName } = useAttendeeNamesContext();

  return (
    <div className="video-grid">
      {isVideoEnabled && (
        <div className="video-tile-wrapper">
          <LocalVideo nameplate="Me" />
        </div>
      )}
      {tiles.map((tileId) => {
        const attendeeId = tileIdToAttendeeId[tileId];
        const name = attendeeId
          ? getAttendeeName(attendeeId)
          : roster[tileIdToAttendeeId[tileId]]?.name || "Unknown";
        return (
          <div key={tileId} className="video-tile-wrapper">
            <RemoteVideo tileId={tileId} name={name} />
          </div>
        );
      })}
    </div>
  );
};

export default VideoMeeting;
