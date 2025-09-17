"use client";
import { CHAT_UI_STRINGS } from "@/constants/chat";
import { useChat } from "@/utils/context/ChatContext";
import { getChatObjectMetadata } from "@/utils/helpers";
import { PublicUser } from "@/types/user.type";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ChatHeader = ({ user: authUser }: { user: PublicUser }) => {
  const { state } = useChat();
  const { activeConversationId, conversations } = state;
  const router = useRouter();

  const activeConversation = conversations.find(
    (convo) => convo.id === activeConversationId,
  );

  if (!activeConversation) {
    return (
      <div className="flex items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chat
        </h2>
      </div>
    );
  }

  const chatMetadata = getChatObjectMetadata(activeConversation, authUser);

  return (
    <div className="flex items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <Image
        src={
          chatMetadata.avatar ??
          authUser.avatar_url ??
          CHAT_UI_STRINGS.DEFAULT_AVATAR_URL
        }
        alt={chatMetadata.title}
        width={40}
        height={40}
        className="rounded-full object-cover mr-3"
      />
      <div onClick={() => router.push(`/profile/${chatMetadata.title}`)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline">
          {chatMetadata.title || authUser.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {chatMetadata.description}
        </p>
      </div>
    </div>
  );
};
