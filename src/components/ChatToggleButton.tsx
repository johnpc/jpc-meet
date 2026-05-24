import { useContext } from "react";
import {
  Chat,
  ControlBarButton,
} from "amazon-chime-sdk-component-library-react";
import { ChatContext } from "../context/ChatContext";

const ChatToggleButton = () => {
  const context = useContext(ChatContext);

  if (!context) {
    return null;
  }

  const { unreadCount, toggleChat } = context;
  const label = unreadCount > 0 ? `Chat (${unreadCount})` : "Chat";

  return (
    <ControlBarButton icon={<Chat />} onClick={toggleChat} label={label} />
  );
};

export default ChatToggleButton;
