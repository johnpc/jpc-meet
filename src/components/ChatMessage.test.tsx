import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

vi.mock("remark-gfm", () => ({
  default: () => null,
}));

vi.mock("@aws-amplify/ui-react", () => ({
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Flex: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Button: ({
    children,
    onClick,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
  }) => (
    <button onClick={onClick} title={title}>
      {children}
    </button>
  ),
}));

import { ChatMessageItem } from "./ChatMessage";

describe("ChatMessageItem", () => {
  const defaultProps = {
    id: "msg-1",
    senderName: "Alice",
    text: "Hello world",
    timestamp: new Date("2025-01-15T10:30:00").getTime(),
    reactions: {} as Record<string, string[]>,
    onReaction: vi.fn(),
  };

  it("renders sender name and message text", () => {
    render(<ChatMessageItem {...defaultProps} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders existing reactions with counts", () => {
    const props = {
      ...defaultProps,
      reactions: { "\u{1F44D}": ["Bob", "Charlie"] },
    };
    render(<ChatMessageItem {...props} />);
    expect(screen.getByTitle("Bob, Charlie")).toBeInTheDocument();
  });

  it("calls onReaction when clicking an existing reaction", () => {
    const onReaction = vi.fn();
    const props = {
      ...defaultProps,
      reactions: { "\u{1F44D}": ["Bob"] },
      onReaction,
    };
    render(<ChatMessageItem {...props} />);
    fireEvent.click(screen.getByTitle("Bob"));
    expect(onReaction).toHaveBeenCalledWith("msg-1", "\u{1F44D}");
  });

  it("shows emoji picker on + button click", () => {
    render(<ChatMessageItem {...defaultProps} />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("\u{1F44D}")).toBeInTheDocument();
    expect(screen.getByText("\u{2764}\u{FE0F}")).toBeInTheDocument();
  });

  it("calls onReaction and hides picker when selecting emoji", () => {
    const onReaction = vi.fn();
    render(<ChatMessageItem {...defaultProps} onReaction={onReaction} />);
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("\u{1F525}"));
    expect(onReaction).toHaveBeenCalledWith("msg-1", "\u{1F525}");
  });
});
