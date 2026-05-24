import { useEffect } from "react";
import {
  RosterAttendee,
  RosterAttendeeType,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";

export const AttendeeList = () => {
  const { roster } = useRosterState();
  const meetingManager = useMeetingManager();
  const attendees = Object.values(roster);

  useEffect(() => {
    meetingManager.getAttendee = async (
      _chimeAttendeeId: string,
      externalUserId?: string,
    ) => {
      const name = externalUserId?.split("#")[0] || "Unknown";
      return { name };
    };
  }, [meetingManager]);

  return (
    <>
      {attendees.map((attendee: RosterAttendeeType) => (
        <RosterAttendee
          key={attendee.chimeAttendeeId}
          attendeeId={attendee.chimeAttendeeId}
        />
      ))}
    </>
  );
};
