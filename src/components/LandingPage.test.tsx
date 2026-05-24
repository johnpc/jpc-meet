import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

// Mock @aws-amplify/ui-react with minimal implementations
vi.mock("@aws-amplify/ui-react", () => ({
  Alert: ({ children }: { children: React.ReactNode }) => (
    <div role="alert">{children}</div>
  ),
  Button: ({
    children,
    onClick,
    isDisabled,
    isLoading,
    loadingText,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
  }) => (
    <button onClick={onClick} disabled={isDisabled}>
      {isLoading ? loadingText : children}
    </button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Divider: () => <hr />,
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({
    children,
  }: {
    children: React.ReactNode;
    level?: number;
    textAlign?: string;
  }) => <h2>{children}</h2>,
  Loader: () => <div>Loading...</div>,
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  TextField: ({
    placeholder,
    value,
    onChange,
    onKeyDown,
    isDisabled,
    label,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    label?: string;
    labelHidden?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    isDisabled?: boolean;
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={isDisabled}
      aria-label={label}
    />
  ),
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    tokens: {
      space: { large: "1rem", medium: "0.5rem", small: "0.25rem" },
      fontSizes: { large: "1.25rem", small: "0.875rem" },
      colors: { font: { secondary: "#666" } },
    },
  }),
}));

describe("LandingPage", () => {
  const defaultProps = {
    onJoinMeeting: vi.fn().mockResolvedValue(undefined),
    onStartMeeting: vi.fn().mockResolvedValue(undefined),
    loadingAction: null as "start" | "join" | "auto" | null,
    error: "",
    attendeeName: "Playful Cat",
    onAttendeeNameChange: vi.fn(),
  };

  it("renders start meeting button", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Start Meeting")).toBeInTheDocument();
  });

  it("renders join meeting button", () => {
    render(<LandingPage {...defaultProps} />);
    expect(screen.getByText("Join Meeting")).toBeInTheDocument();
  });

  it("calls onStartMeeting when start button clicked", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByText("Start Meeting"));
    expect(defaultProps.onStartMeeting).toHaveBeenCalled();
  });

  it("shows error when trying to join with empty pin", () => {
    render(<LandingPage {...defaultProps} />);
    fireEvent.click(screen.getByText("Join Meeting"));
    expect(defaultProps.onJoinMeeting).not.toHaveBeenCalled();
  });

  it("calls onJoinMeeting with pin value", () => {
    render(<LandingPage {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter meeting PIN");
    fireEvent.change(input, { target: { value: "test-pin" } });
    fireEvent.click(screen.getByText("Join Meeting"));
    expect(defaultProps.onJoinMeeting).toHaveBeenCalledWith("test-pin", "join");
  });

  it("displays error prop", () => {
    render(<LandingPage {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows loading state for start button", () => {
    render(<LandingPage {...defaultProps} loadingAction="start" />);
    expect(screen.getByText("Starting...")).toBeInTheDocument();
  });

  it("shows loading state for join button", () => {
    render(<LandingPage {...defaultProps} loadingAction="join" />);
    expect(screen.getByText("Joining...")).toBeInTheDocument();
  });

  it("shows auto-join loader", () => {
    render(<LandingPage {...defaultProps} loadingAction="auto" />);
    expect(screen.getByText("Connecting to meeting...")).toBeInTheDocument();
  });

  it("joins on Enter key press", () => {
    render(<LandingPage {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter meeting PIN");
    fireEvent.change(input, { target: { value: "enter-pin" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(defaultProps.onJoinMeeting).toHaveBeenCalledWith(
      "enter-pin",
      "join",
    );
  });

  it("renders name input with default attendee name", () => {
    render(<LandingPage {...defaultProps} />);
    const nameInput = screen.getByDisplayValue("Playful Cat");
    expect(nameInput).toBeInTheDocument();
  });

  it("calls onAttendeeNameChange when name is edited", () => {
    render(<LandingPage {...defaultProps} />);
    const nameInput = screen.getByDisplayValue("Playful Cat");
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(defaultProps.onAttendeeNameChange).toHaveBeenCalledWith("New Name");
  });

  it("shows error when trying to start with empty name", () => {
    const onStartMeeting = vi.fn().mockResolvedValue(undefined);
    render(
      <LandingPage {...defaultProps} attendeeName="" onStartMeeting={onStartMeeting} />,
    );
    fireEvent.click(screen.getByText("Start Meeting"));
    expect(onStartMeeting).not.toHaveBeenCalled();
  });

  it("shows error when trying to join with empty name", () => {
    const onJoinMeeting = vi.fn().mockResolvedValue(undefined);
    render(
      <LandingPage {...defaultProps} attendeeName="" onJoinMeeting={onJoinMeeting} />,
    );
    const input = screen.getByPlaceholderText("Enter meeting PIN");
    fireEvent.change(input, { target: { value: "test-pin" } });
    fireEvent.click(screen.getByText("Join Meeting"));
    expect(onJoinMeeting).not.toHaveBeenCalled();
  });
});
