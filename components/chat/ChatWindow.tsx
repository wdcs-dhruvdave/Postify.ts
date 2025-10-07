"use client";
import { CHAT_UI_STRINGS, CHAT_MAGIC_NUMBERS } from "@/constants/index";
import { useChat } from "@/utils/context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { getMessages, markConversationAsRead } from "@/utils/Apis/chatApi";
import { useEffect, useState, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PublicUser } from "@/types/user.type";
import { ChatHeader } from "./ChatHeader";
import { MessageSkeleton } from "./skeletons/MessageSkeleton";
import { Message } from "@/types/chat.types";

export const ChatWindow = ({ user }: { user: PublicUser }) => {
  const { state, dispatch } = useChat();
  const { activeConversationId, messages, loadingMessages } = state;

  const [pageNum, setPageNum] = useState<number>(
    CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM,
  );
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (activeConversationId) {
      setActiveMessages(messages[activeConversationId] || []);
    }
  }, [messages, activeConversationId]);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousConversationIdRef = useRef<string | null>(null);
  const isUserNearBottomRef = useRef(true);

  const checkScrollPosition = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      isUserNearBottomRef.current =
        scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      return () => {
        chatContainer.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [checkScrollPosition]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    if (activeConversationId !== previousConversationIdRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      previousConversationIdRef.current = activeConversationId;
      return;
    }

    if (isUserNearBottomRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages, activeConversationId]);

  const fetchMessages = useCallback(
    async (pageToFetch: number) => {
      if (!activeConversationId || loadingMessages || !hasMoreMessages) return;

      dispatch({ type: "SET_LOADING_MESSAGES", payload: true });

      try {
        if (pageToFetch === CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM) {
          await markConversationAsRead(activeConversationId);
        }

        const chatContainer = chatContainerRef.current;
        const prevScrollHeight = chatContainer?.scrollHeight || 0;
        const prevScrollTop = chatContainer?.scrollTop || 0;

        const newMessages = await getMessages(
          activeConversationId,
          pageToFetch,
          CHAT_MAGIC_NUMBERS.DEFAULT_MESSAGE_LIMIT,
        );

        if (newMessages.length > 0) {
          dispatch({
            type: "PREPEND_MESSAGES",
            payload: {
              conversationId: activeConversationId,
              messages: newMessages,
            },
          });
          setPageNum((prev) => prev + 1);

          requestAnimationFrame(() => {
            if (chatContainer) {
              const newScrollHeight = chatContainer.scrollHeight;
              chatContainer.scrollTop =
                newScrollHeight - prevScrollHeight + prevScrollTop;
            }
          });
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error("[fetchMessages] Error:", error);
      } finally {
        dispatch({
          type: "MARK_CONVERSATION_READ",
          payload: activeConversationId,
        });
        dispatch({ type: "SET_LOADING_MESSAGES", payload: false });
      }
    },
    [activeConversationId, dispatch, loadingMessages, hasMoreMessages],
  );

  useEffect(() => {
    const initConversation = async () => {
      if (!activeConversationId) return;
      dispatch({ type: "CLEAR_MESSAGES", payload: activeConversationId });
      setPageNum(CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM);
      setHasMoreMessages(true);
      isUserNearBottomRef.current = true;
      await fetchMessages(CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM);
    };
    initConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, dispatch]);

  useEffect(() => {
    if (
      inView &&
      hasMoreMessages &&
      !loadingMessages &&
      pageNum > CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM
    ) {
      fetchMessages(pageNum);
    }
  }, [inView, hasMoreMessages, loadingMessages, pageNum, fetchMessages]);

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          {CHAT_UI_STRINGS.SELECT_CONVERSATION_PROMPT}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ChatHeader user={user} />

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col"
      >
        {hasMoreMessages && <div ref={inViewRef} className="h-1" />}

        {loadingMessages && activeMessages.length > 0 && (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            {CHAT_UI_STRINGS.LOADING_OLDER_MESSAGES}
          </div>
        )}

        {loadingMessages && activeMessages.length === 0 ? (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton sent />
            <MessageSkeleton />
            <MessageSkeleton sent />
            <MessageSkeleton sent />
          </div>
        ) : (
          <MessageList messages={activeMessages} />
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex-shrink-0">
        <MessageInput conversationId={activeConversationId!} />
      </div>
    </div>
  );
};
