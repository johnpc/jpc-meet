import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseVideoMeeting = vi.fn();

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  LocalVideo: ({ nameplate }: { nameplate: string }) => (
    <div data-testid="local-video">{nameplate}</div>
  ),
  RemoteVideo: ({ tileId, name }: { tileId: number; name: string }) => (
    <div data-testid={`remote-video-${tileId}`}>{name}</div>
  ),
  useLocalVideo: () => ({ isVideoEnabled: true }),
  useRemoteVideoTileState: () => ({
    tiles: [1, 2],
    tileIdToAttendeeId: { 1: "attendee-a", 2: "attendee-b" },
  }),
  useRosterState: () => ({
    roster: { "attendee-a": { name: "Alice" }, "attendee-b": { name: "Bob" } },
  }),
}));

vi.mock("../context/AttendeeNamesContext", () => ({
  useAttendeeNamesContext: () => ({
    getAttendeeName: (id: string) => `Name-${id}`,
  }),
}));

vi.mock("../hooks/useVideoMeeting", () => ({
  useVideoMeeting: () => mockUseVideoMeeting(),
}));

import VideoMeeting from "./VideoMeeting";

describe("VideoMeeting", () => {
  it("renders local video when enabled", () => {
    render(<VideoMeeting />);
    expect(screen.getByTestId("local-video")).toBeInTheDocument();
  });

  it("renders remote video tiles", () => {
    render(<VideoMeeting />);
    expect(screen.getByTestId("remote-video-1")).toBeInTheDocument();
    expect(screen.getByTestId("remote-video-2")).toBeInTheDocument();
  });

  it("displays attendee names on remote tiles", () => {
    render(<VideoMeeting />);
    expect(screen.getByText("Name-attendee-a")).toBeInTheDocument();
    expect(screen.getByText("Name-attendee-b")).toBeInTheDocument();
  });

  it("calls useVideoMeeting hook", () => {
    render(<VideoMeeting />);
    expect(mockUseVideoMeeting).toHaveBeenCalled();
  });
});
