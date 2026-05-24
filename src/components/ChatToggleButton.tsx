import { useContext } from "react";
import { ControlBarButton } from "amazon-chime-sdk-component-library-react";
import { ChatContext } from "../context/ChatContext";

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ChatToggleButton = () => {
  const context = useContext(ChatContext);

  if (!context) {
    return null;
  }

  const { unreadCount, toggleChat } = context;
  const label = unreadCount > 0 ? `Chat (${unreadCount})` : "Chat";

  return (
    <ControlBarButton
      icon={<ChatIcon />}
      onClick={toggleChat}
      label={label}
    />
  );
};

export default ChatToggleButton;
