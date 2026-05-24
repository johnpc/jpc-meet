import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("aws-amplify", () => ({
  Amplify: { configure: vi.fn() },
}));

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  MeetingProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="meeting-provider">{children}</div>
  ),
  FeaturedVideoTileProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@aws-amplify/ui-react", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    tokens: { space: { medium: "1rem" } },
  }),
}));

vi.mock("./components/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock("./components/LandingPage", () => ({
  LandingPage: () => <div data-testid="landing-page">LandingPage</div>,
}));

vi.mock("./components/MeetingControlBar", () => ({
  default: () => <div data-testid="control-bar">ControlBar</div>,
}));

vi.mock("./components/VideoMeeting", () => ({
  default: () => <div data-testid="video-meeting">VideoMeeting</div>,
}));

vi.mock("./components/CopyLink", () => ({
  CopyLink: () => <div data-testid="copy-link">CopyLink</div>,
}));

vi.mock("./components/AttendeeList", () => ({
  AttendeeList: () => <div data-testid="attendee-list">AttendeeList</div>,
}));

vi.mock("./components/ChatPanel", () => ({
  ChatPanel: () => <div data-testid="chat-panel">ChatPanel</div>,
}));

vi.mock("./context/AttendeeNamesContext", () => ({
  AttendeeNamesProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAttendeeNamesContext: () => ({
    broadcastNameChange: vi.fn(),
  }),
}));

vi.mock("./context/ChatContext", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

let mockUseMeeting = {
  joinedMeetingId: null as string | null,
  loadingAction: null,
  error: null,
  handleJoinMeeting: vi.fn(),
  handleStartMeeting: vi.fn(),
  attendeeName: "Test User",
  setAttendeeName: vi.fn(),
};

vi.mock("./hooks/useMeeting", () => ({
  useMeeting: () => mockUseMeeting,
}));

import App from "./App";

describe("App", () => {
  it("renders MeetingProvider wrapper", () => {
    render(<App />);
    expect(screen.getByTestId("meeting-provider")).toBeInTheDocument();
  });

  it("shows LandingPage when not in a meeting", () => {
    mockUseMeeting = { ...mockUseMeeting, joinedMeetingId: null };
    render(<App />);
    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    expect(screen.queryByTestId("video-meeting")).not.toBeInTheDocument();
  });

  it("shows meeting UI when joined", () => {
    mockUseMeeting = { ...mockUseMeeting, joinedMeetingId: "meeting-123" };
    render(<App />);
    expect(screen.getByTestId("video-meeting")).toBeInTheDocument();
    expect(screen.getByTestId("attendee-list")).toBeInTheDocument();
    expect(screen.getByTestId("copy-link")).toBeInTheDocument();
    expect(screen.getByTestId("chat-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
  });

  it("always renders Header", () => {
    render(<App />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
});
