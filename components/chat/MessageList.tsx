"use client";
import { CHAT_UI_STRINGS } from "@/constants/chat";
import { Message } from "@/types/chat.types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {CHAT_UI_STRINGS.NO_MESSAGES_YET}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Be the first to say something!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} showAvatar={true} />
      ))}
    </>
  );
};
