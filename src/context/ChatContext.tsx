import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatMessage, useChat } from "../hooks/useChat";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => { error?: string };
  sendReaction: (messageId: string, emoji: string) => void;
  unreadCount: number;
  isChatOpen: boolean;
  toggleChat: () => void;
  resetUnread: () => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { messages, sendMessage, sendReaction } = useChat();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    const newCount = messages.length - prevMessageCountRef.current;
    if (newCount > 0 && !isChatOpen) {
      setUnreadCount((prev) => prev + newCount);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isChatOpen]);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) {
        setUnreadCount(0);
      }
      return !prev;
    });
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        sendReaction,
        unreadCount,
        isChatOpen,
        toggleChat,
        resetUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
