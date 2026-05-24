import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Text, Flex, Button } from "@aws-amplify/ui-react";

interface ChatMessageProps {
  id: string;
  senderName: string;
  text: string;
  timestamp: number;
  reactions: Record<string, string[]>;
  onReaction: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = [
  "\u{1F44D}",
  "\u{2764}\u{FE0F}",
  "\u{1F602}",
  "\u{1F62E}",
  "\u{1F622}",
  "\u{1F525}",
  "\u{1F44F}",
  "\u{1F4AF}",
];

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({
  id,
  senderName,
  text,
  timestamp,
  reactions,
  onReaction,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ marginBottom: "12px", padding: "4px 0" }}>
      <Flex direction="row" alignItems="baseline" gap="8px">
        <Text fontWeight="bold" fontSize="0.85rem">
          {senderName}
        </Text>
        <Text fontSize="0.7rem" color="gray">
          {formatTime(timestamp)}
        </Text>
      </Flex>
      <div
        style={{ fontSize: "0.9rem", lineHeight: "1.4", marginTop: "2px" }}
        className="chat-message-content"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["img"]}
          components={{
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
      <Flex direction="row" gap="4px" alignItems="center" wrap="wrap">
        {Object.entries(reactions).map(([emoji, names]) => (
          <Button
            key={emoji}
            size="small"
            variation="link"
            onClick={() => onReaction(id, emoji)}
            title={names.join(", ")}
            style={{
              padding: "2px 6px",
              fontSize: "0.8rem",
              border: "1px solid #ddd",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            {emoji} {names.length}
          </Button>
        ))}
        <Button
          size="small"
          variation="link"
          onClick={() => setShowPicker((prev) => !prev)}
          style={{ padding: "2px 6px", fontSize: "0.85rem", cursor: "pointer" }}
        >
          +
        </Button>
      </Flex>
      {showPicker && (
        <Flex direction="row" gap="2px" wrap="wrap" style={{ marginTop: "4px" }}>
          {REACTION_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              size="small"
              variation="link"
              onClick={() => {
                onReaction(id, emoji);
                setShowPicker(false);
              }}
              style={{ padding: "2px 4px", fontSize: "1rem", cursor: "pointer" }}
            >
              {emoji}
            </Button>
          ))}
        </Flex>
      )}
    </div>
  );
};
