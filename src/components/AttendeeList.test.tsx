import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  MicrophoneActivity: ({ attendeeId }: { attendeeId: string }) => (
    <div data-testid={`mic-${attendeeId}`} />
  ),
  RosterCell: ({ name, microphone }: { name: string; microphone: React.ReactNode }) => (
    <div data-testid="roster-cell">{name}{microphone}</div>
  ),
  useAttendeeStatus: () => ({
    muted: false,
    videoEnabled: true,
    sharingContent: false,
  }),
  useRosterState: () => ({
    roster: {
      "attendee-1": { name: "Alice" },
      "attendee-2": { name: "Bob" },
    },
  }),
}));

vi.mock("../context/AttendeeNamesContext", () => ({
  useAttendeeNamesContext: () => ({
    getAttendeeName: (id: string) => `Display-${id}`,
  }),
}));

import { AttendeeList } from "./AttendeeList";

describe("AttendeeList", () => {
  it("renders a row for each attendee", () => {
    render(<AttendeeList />);
    const cells = screen.getAllByTestId("roster-cell");
    expect(cells).toHaveLength(2);
  });

  it("displays attendee names from context", () => {
    render(<AttendeeList />);
    expect(screen.getByText("Display-attendee-1")).toBeInTheDocument();
    expect(screen.getByText("Display-attendee-2")).toBeInTheDocument();
  });

  it("renders microphone activity for each attendee", () => {
    render(<AttendeeList />);
    expect(screen.getByTestId("mic-attendee-1")).toBeInTheDocument();
    expect(screen.getByTestId("mic-attendee-2")).toBeInTheDocument();
  });
});
