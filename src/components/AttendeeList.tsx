import { useRef, useEffect } from "react";
import {
  RosterAttendee,
  RosterAttendeeType,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { generateAttendeeName } from "../utils/attendee";

export const AttendeeList = () => {
  const { roster } = useRosterState();
  const meetingManager = useMeetingManager();
  const attendees = Object.values(roster);
  const nameCacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    meetingManager.getAttendee = async (
      chimeAttendeeId: string,
      _externalUserId?: string,
    ) => {
      if (!nameCacheRef.current[chimeAttendeeId]) {
        nameCacheRef.current[chimeAttendeeId] = generateAttendeeName();
      }
      return { name: nameCacheRef.current[chimeAttendeeId] };
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
