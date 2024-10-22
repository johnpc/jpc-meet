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
  meetingManager.getAttendee = async () => {
    const adjectives = [
      "Playful",
      "Curious",
      "Sneaky",
      "Graceful",
      "Majestic",
      "Fierce",
      "Wise",
      "Gentle",
      "Daring",
      "Loyal",
    ];
    const animals = [
      "Cat",
      "Dog",
      "Lion",
      "Tiger",
      "Bear",
      "Elephant",
      "Giraffe",
      "Panda",
      "Dolphin",
      "Penguin",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    return {
      name: `${randomAdjective} ${randomAnimal}`,
    };
  };
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
