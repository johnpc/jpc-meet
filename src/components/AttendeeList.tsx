import { useRosterState } from "amazon-chime-sdk-component-library-react";
import { useAttendeeNamesContext } from "../context/AttendeeNamesContext";

export const AttendeeList = () => {
  const { roster } = useRosterState();
  const { getAttendeeName } = useAttendeeNamesContext();
  const attendeeIds = Object.keys(roster);

  return (
    <div className="attendee-list">
      {attendeeIds.map((id) => (
        <span key={id} className="attendee-chip">
          {getAttendeeName(id)}
        </span>
      ))}
    </div>
  );
};
