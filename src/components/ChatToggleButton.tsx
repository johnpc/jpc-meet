import { ControlBarButton } from "amazon-chime-sdk-component-library-react";
import { useChatContext } from "../context/ChatContext";

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ChatToggleButton = () => {
  const { unreadCount, toggleChat } = useChatContext();

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
