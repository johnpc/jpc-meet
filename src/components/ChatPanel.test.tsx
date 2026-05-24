import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockSendMessage = vi.fn().mockReturnValue({});
const mockSendReaction = vi.fn();
const mockToggleChat = vi.fn();

let mockChatContext = {
  messages: [] as { id: string; senderName: string; text: string; timestamp: number; reactions: Record<string, string[]> }[],
  sendMessage: mockSendMessage,
  sendReaction: mockSendReaction,
  isChatOpen: true,
  toggleChat: mockToggleChat,
  unreadCount: 0,
  resetUnread: vi.fn(),
};

vi.mock("../context/ChatContext", () => ({
  useChatContext: () => mockChatContext,
}));

vi.mock("./ChatMessage", () => ({
  ChatMessageItem: ({ senderName, text }: { senderName: string; text: string }) => (
    <div data-testid="chat-message">{senderName}: {text}</div>
  ),
}));

vi.mock("@aws-amplify/ui-react", () => ({
  View: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { ChatPanel } from "./ChatPanel";

describe("ChatPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChatContext = {
      messages: [],
      sendMessage: mockSendMessage,
      sendReaction: mockSendReaction,
      isChatOpen: true,
      toggleChat: mockToggleChat,
      unreadCount: 0,
      resetUnread: vi.fn(),
    };
  });

  it("renders nothing when chat is closed", () => {
    mockChatContext.isChatOpen = false;
    const { container } = render(<ChatPanel />);
    expect(container.innerHTML).toBe("");
  });

  it("shows empty state when no messages", () => {
    render(<ChatPanel />);
    expect(screen.getByText(/No messages yet/)).toBeInTheDocument();
  });

  it("renders messages", () => {
    mockChatContext.messages = [
      { id: "1", senderName: "Bob", text: "Hi!", timestamp: Date.now(), reactions: {} },
    ];
    render(<ChatPanel />);
    expect(screen.getByTestId("chat-message")).toBeInTheDocument();
    expect(screen.getByText("Bob: Hi!")).toBeInTheDocument();
  });

  it("sends a message on button click", () => {
    mockSendMessage.mockReturnValue({});
    render(<ChatPanel />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByText("Send"));
    expect(mockSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("sends message on Enter key", () => {
    mockSendMessage.mockReturnValue({});
    render(<ChatPanel />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(mockSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("does not send on Shift+Enter", () => {
    render(<ChatPanel />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("does not send empty messages", () => {
    render(<ChatPanel />);
    fireEvent.click(screen.getByText("Send"));
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("shows error from sendMessage", () => {
    mockSendMessage.mockReturnValue({ error: "Message too long" });
    render(<ChatPanel />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByText("Send"));
    expect(screen.getByText("Message too long")).toBeInTheDocument();
  });

  it("calls toggleChat on close button", () => {
    render(<ChatPanel />);
    fireEvent.click(screen.getByText("×"));
    expect(mockToggleChat).toHaveBeenCalled();
  });
});
