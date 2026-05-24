import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioVideo } from "amazon-chime-sdk-component-library-react";
import { DataMessage } from "amazon-chime-sdk-js";
import { generateAttendeeName } from "../utils/attendee";

export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  timestamp: number;
  reactions: Record<string, string[]>;
}

interface ChatMessagePayload {
  senderName: string;
  message: string;
  messageId: string;
  timestamp: number;
}

interface ChatReactionPayload {
  messageId: string;
  emoji: string;
  senderName: string;
}

const CHAT_MESSAGE_TOPIC = "chat-message";
const CHAT_REACTION_TOPIC = "chat-reaction";
const MESSAGE_LIFETIME_MS = 300000;

export function useChat() {
  const audioVideo = useAudioVideo();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const senderNameRef = useRef<string>(generateAttendeeName());

  const handleChatMessage = useCallback((dataMessage: DataMessage) => {
    const text = new TextDecoder().decode(dataMessage.data);
    const payload: ChatMessagePayload = JSON.parse(text);

    setMessages((prev) => {
      if (prev.some((m) => m.id === payload.messageId)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: payload.messageId,
          senderName: payload.senderName,
          text: payload.message,
          timestamp: payload.timestamp,
          reactions: {},
        },
      ];
    });
  }, []);

  const handleChatReaction = useCallback((dataMessage: DataMessage) => {
    const text = new TextDecoder().decode(dataMessage.data);
    const payload: ChatReactionPayload = JSON.parse(text);

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== payload.messageId) return msg;
        const reactions = { ...msg.reactions };
        const names = reactions[payload.emoji]
          ? [...reactions[payload.emoji]]
          : [];
        const idx = names.indexOf(payload.senderName);
        if (idx >= 0) {
          names.splice(idx, 1);
        } else {
          names.push(payload.senderName);
        }
        if (names.length === 0) {
          delete reactions[payload.emoji];
        } else {
          reactions[payload.emoji] = names;
        }
        return { ...msg, reactions };
      }),
    );
  }, []);

  useEffect(() => {
    if (!audioVideo) return;

    audioVideo.realtimeSubscribeToReceiveDataMessage(
      CHAT_MESSAGE_TOPIC,
      handleChatMessage,
    );
    audioVideo.realtimeSubscribeToReceiveDataMessage(
      CHAT_REACTION_TOPIC,
      handleChatReaction,
    );

    return () => {
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage(CHAT_MESSAGE_TOPIC);
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage(CHAT_REACTION_TOPIC);
    };
  }, [audioVideo, handleChatMessage, handleChatReaction]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!audioVideo || !text.trim()) return;

      const messageId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const payload: ChatMessagePayload = {
        senderName: senderNameRef.current,
        message: text.trim(),
        messageId,
        timestamp: Date.now(),
      };

      audioVideo.realtimeSendDataMessage(
        CHAT_MESSAGE_TOPIC,
        JSON.stringify(payload),
        MESSAGE_LIFETIME_MS,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          senderName: payload.senderName,
          text: payload.message,
          timestamp: payload.timestamp,
          reactions: {},
        },
      ]);
    },
    [audioVideo],
  );

  const sendReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!audioVideo) return;

      const payload: ChatReactionPayload = {
        messageId,
        emoji,
        senderName: senderNameRef.current,
      };

      audioVideo.realtimeSendDataMessage(
        CHAT_REACTION_TOPIC,
        JSON.stringify(payload),
        MESSAGE_LIFETIME_MS,
      );

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = { ...msg.reactions };
          const names = reactions[emoji] ? [...reactions[emoji]] : [];
          const idx = names.indexOf(senderNameRef.current);
          if (idx >= 0) {
            names.splice(idx, 1);
          } else {
            names.push(senderNameRef.current);
          }
          if (names.length === 0) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = names;
          }
          return { ...msg, reactions };
        }),
      );
    },
    [audioVideo],
  );

  return {
    messages,
    sendMessage,
    sendReaction,
    senderName: senderNameRef.current,
  };
}
