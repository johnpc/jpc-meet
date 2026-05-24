import {
  MicrophoneActivity,
  RosterCell,
  useAttendeeStatus,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { useAttendeeNamesContext } from "../context/AttendeeNamesContext";

function AttendeeRow({ attendeeId }: { attendeeId: string }) {
  const { getAttendeeName } = useAttendeeNamesContext();
  const { muted, videoEnabled, sharingContent } =
    useAttendeeStatus(attendeeId);

  return (
    <RosterCell
      name={getAttendeeName(attendeeId)}
      muted={muted}
      videoEnabled={videoEnabled}
      sharingContent={sharingContent}
      microphone={<MicrophoneActivity attendeeId={attendeeId} />}
    />
  );
}

export const AttendeeList = () => {
  const { roster } = useRosterState();
  const attendeeIds = Object.keys(roster);

  return (
    <>
      {attendeeIds.map((id) => (
        <AttendeeRow key={id} attendeeId={id} />
      ))}
    </>
  );
};
