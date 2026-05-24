import { useEffect } from "react";
import {
  RosterAttendee,
  RosterAttendeeType,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";

export interface AttendeeListProps {
  resolveAttendeeName?: (
    chimeAttendeeId: string,
    externalUserId?: string,
  ) => string;
}

export const AttendeeList = ({ resolveAttendeeName }: AttendeeListProps) => {
  const { roster } = useRosterState();
  const meetingManager = useMeetingManager();
  const attendees = Object.values(roster);

  useEffect(() => {
    meetingManager.getAttendee = async (
      chimeAttendeeId: string,
      externalUserId?: string,
    ) => {
      const name = resolveAttendeeName
        ? resolveAttendeeName(chimeAttendeeId, externalUserId)
        : externalUserId?.split("#")[0] || "Unknown";
      return { name };
    };
  }, [meetingManager, resolveAttendeeName]);

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
