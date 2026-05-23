import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyLink } from "./CopyLink";

vi.mock("@aws-amplify/ui-react", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  useTheme: () => ({ tokens: { space: { medium: "0.5rem" } } }),
}));

vi.mock("react-copy-to-clipboard", () => ({
  CopyToClipboard: ({
    children,
    onCopy,
  }: {
    children: React.ReactNode;
    text: string;
    onCopy?: () => void;
  }) => <div onClick={onCopy}>{children}</div>,
}));

describe("CopyLink", () => {
  it("renders copy button text", () => {
    render(<CopyLink link="https://meet.jpc.io/abc123" />);
    expect(screen.getByText("Copy link to Clipboard")).toBeInTheDocument();
  });

  it("shows checkmark after copy", () => {
    vi.useFakeTimers();
    render(<CopyLink link="https://meet.jpc.io/abc123" />);
    fireEvent.click(screen.getByText("Copy link to Clipboard"));
    expect(screen.getByText("✅")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Copy link to Clipboard")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
