import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockToggleChat = vi.fn();

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  Chat: () => <span>chat-icon</span>,
  ControlBarButton: ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid="chat-toggle">
      {label}
    </button>
  ),
}));

vi.mock("../context/ChatContext", () => ({
  ChatContext: React.createContext(null),
}));

import { ChatContext } from "../context/ChatContext";
import ChatToggleButton from "./ChatToggleButton";

describe("ChatToggleButton", () => {
  it("renders nothing when no context", () => {
    const { container } = render(<ChatToggleButton />);
    expect(container.innerHTML).toBe("");
  });

  it("renders Chat label when no unread", () => {
    render(
      <ChatContext.Provider
        value={{
          messages: [],
          sendMessage: vi.fn().mockReturnValue({}),
          sendReaction: vi.fn(),
          unreadCount: 0,
          isChatOpen: false,
          toggleChat: mockToggleChat,
          resetUnread: vi.fn(),
        }}
      >
        <ChatToggleButton />
      </ChatContext.Provider>,
    );
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("renders unread count in label", () => {
    render(
      <ChatContext.Provider
        value={{
          messages: [],
          sendMessage: vi.fn().mockReturnValue({}),
          sendReaction: vi.fn(),
          unreadCount: 3,
          isChatOpen: false,
          toggleChat: mockToggleChat,
          resetUnread: vi.fn(),
        }}
      >
        <ChatToggleButton />
      </ChatContext.Provider>,
    );
    expect(screen.getByText("Chat (3)")).toBeInTheDocument();
  });

  it("calls toggleChat on click", () => {
    render(
      <ChatContext.Provider
        value={{
          messages: [],
          sendMessage: vi.fn().mockReturnValue({}),
          sendReaction: vi.fn(),
          unreadCount: 0,
          isChatOpen: false,
          toggleChat: mockToggleChat,
          resetUnread: vi.fn(),
        }}
      >
        <ChatToggleButton />
      </ChatContext.Provider>,
    );
    fireEvent.click(screen.getByTestId("chat-toggle"));
    expect(mockToggleChat).toHaveBeenCalled();
  });
});
