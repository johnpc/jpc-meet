import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { View, Text, Button, Flex } from "@aws-amplify/ui-react";
import { ChatMessageItem } from "./ChatMessage";
import { useChatContext } from "../context/ChatContext";

export const ChatPanel: React.FC = () => {
  const { messages, sendMessage, sendReaction, isChatOpen, toggleChat } =
    useChatContext();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isChatOpen) return null;

  return (
    <View
      style={{
        width: "320px",
        height: "100%",
        borderLeft: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
      }}
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Text fontWeight="bold" fontSize="1rem">
          Chat
        </Text>
        <Button size="small" variation="link" onClick={toggleChat}>
          &times;
        </Button>
      </Flex>

      <View
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
        }}
      >
        {messages.length === 0 ? (
          <Text
            color="gray"
            fontSize="0.85rem"
            textAlign="center"
            style={{ marginTop: "20px" }}
          >
            No messages yet. Start the conversation!
          </Text>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              id={msg.id}
              senderName={msg.senderName}
              text={msg.text}
              timestamp={msg.timestamp}
              reactions={msg.reactions}
              onReaction={sendReaction}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </View>

      <View
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Flex direction="row" gap="8px" alignItems="flex-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
            style={{
              flex: 1,
              resize: "none",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
              fontSize: "0.85rem",
            }}
          />
          <Button size="small" variation="primary" onClick={handleSend}>
            Send
          </Button>
        </Flex>
      </View>
    </View>
  );
};
