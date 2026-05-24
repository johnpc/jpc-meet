import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockLeave = vi.fn();
const mockToggleContentShare = vi.fn();
const mockHandleRecord = vi.fn();
const mockHandleDownloadRecording = vi.fn();

let mockAudioVideo: object | null = {};

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  useAudioVideo: () => mockAudioVideo,
  useMeetingManager: () => ({ leave: mockLeave }),
  ControlBar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="control-bar">{children}</div>
  ),
  ControlBarButton: ({
    label,
    onClick,
  }: {
    label: React.ReactNode;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid={`btn-${typeof label === "string" ? label : "custom"}`}>
      {typeof label === "string" ? label : "custom"}
    </button>
  ),
  LeaveMeeting: () => <span>leave-icon</span>,
  AudioInputControl: () => <div data-testid="audio-input" />,
  VideoInputControl: () => <div data-testid="video-input" />,
  AudioOutputControl: () => <div data-testid="audio-output" />,
  useContentShareControls: () => ({
    toggleContentShare: mockToggleContentShare,
  }),
  ScreenShare: () => <span>screen-icon</span>,
  Record: () => <span>record-icon</span>,
  Pause: () => <span>pause-icon</span>,
  Play: () => <span>play-icon</span>,
  Dots: () => <span>dots-icon</span>,
}));

vi.mock("@aws-amplify/ui-react", () => ({
  Loader: () => <span>loader-icon</span>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("../hooks/useRecording", () => ({
  useRecording: () => ({
    recordingLabel: "Record",
    iconType: "record",
    clickAction: "toggle",
    handleRecord: mockHandleRecord,
    handleDownloadRecording: mockHandleDownloadRecording,
  }),
}));

vi.mock("./ChatToggleButton", () => ({
  default: () => <div data-testid="chat-toggle">Chat</div>,
}));

vi.mock("./EditNameButton", () => ({
  EditNameButton: ({ attendeeName }: { attendeeName: string }) => (
    <div data-testid="edit-name">{attendeeName}</div>
  ),
}));

import MeetingControlBar from "./MeetingControlBar";

describe("MeetingControlBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioVideo = {};
  });

  it("renders nothing when audioVideo is null", () => {
    mockAudioVideo = null;
    const { container } = render(<MeetingControlBar />);
    expect(container.innerHTML).toBe("");
  });

  it("renders control bar when audioVideo is available", () => {
    render(<MeetingControlBar />);
    expect(screen.getByTestId("control-bar")).toBeInTheDocument();
  });

  it("calls leave on Leave button click", () => {
    render(<MeetingControlBar />);
    fireEvent.click(screen.getByTestId("btn-Leave"));
    expect(mockLeave).toHaveBeenCalled();
  });

  it("calls toggleContentShare on Share button click", () => {
    render(<MeetingControlBar />);
    fireEvent.click(screen.getByTestId("btn-Share"));
    expect(mockToggleContentShare).toHaveBeenCalled();
  });

  it("renders ChatToggleButton", () => {
    render(<MeetingControlBar />);
    expect(screen.getByTestId("chat-toggle")).toBeInTheDocument();
  });

  it("shows more controls panel on More button click", () => {
    render(<MeetingControlBar attendeeName="Alice" onNameChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId("btn-More"));
    expect(screen.getByTestId("audio-output")).toBeInTheDocument();
    expect(screen.getByTestId("edit-name")).toBeInTheDocument();
  });

  it("calls handleRecord from more panel", () => {
    render(<MeetingControlBar />);
    fireEvent.click(screen.getByTestId("btn-More"));
    fireEvent.click(screen.getByTestId("btn-custom"));
    expect(mockHandleRecord).toHaveBeenCalled();
  });

  it("renders audio and video controls", () => {
    render(<MeetingControlBar />);
    expect(screen.getByTestId("audio-input")).toBeInTheDocument();
    expect(screen.getByTestId("video-input")).toBeInTheDocument();
  });
});
