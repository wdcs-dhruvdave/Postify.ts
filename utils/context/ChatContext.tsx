"use client";
import { TOKEN_KEY } from "@/constants/auth";
import { SOCKET_URL } from "@/constants/api";
import { socketEvents, CHAT_MAGIC_NUMBERS } from "@/constants/chat";
import { errorMessages } from "@/constants/ui";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { Conversation, Message, UnReadnotification } from "@/types/chat.types";

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  loadingConversations: boolean;
  loadingMessages: boolean;
}

type ChatAction =
  | { type: "SET_LOADING_CONVERSATIONS"; payload: boolean }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_LOADING_MESSAGES"; payload: boolean }
  | {
      type: "SET_MESSAGES";
      payload: { conversationId: string; messages: Message[] };
    }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_CONVERSATION_NOTIFICATION"; payload: UnReadnotification }
  | { type: "SET_ACTIVE_CONVERSATION"; payload: string | null }
  | { type: "MARK_CONVERSATION_READ"; payload: string }
  | {
      type: "PREPEND_MESSAGES";
      payload: { conversationId: string; messages: Message[] };
    }
  | {
      type: "REPLACE_MESSAGE";
      payload: { tempId: string; finalMessage: Message };
    }
  | { type: "CLEAR_MESSAGES"; payload: string };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  console.log(`[ChatReducer] Action Dispatched: ${action.type}`, {
    payload: action.payload,
    currentState: state,
  });

  switch (action.type) {
    case "SET_LOADING_CONVERSATIONS":
      return { ...state, loadingConversations: action.payload };

    case "SET_CONVERSATIONS":
      return {
        ...state,
        conversations: action.payload,
        loadingConversations: false,
      };

    case "SET_LOADING_MESSAGES":
      return { ...state, loadingMessages: action.payload };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: [...action.payload.messages].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        },
        loadingMessages: false,
      };

    case "ADD_MESSAGE": {
      const msg = action.payload;
      const existing = state.messages[msg.conversationId] || [];

      if (existing.some((m) => m.id === msg.id)) {
        console.log(
          `[ChatReducer] ADD_MESSAGE skipped: Duplicate message ID ${msg.id}`,
        );
        return state;
      }

      const updatedMessages = [...existing, msg];

      return {
        ...state,
        messages: {
          ...state.messages,
          [msg.conversationId]: updatedMessages,
        },
        conversations: state.conversations
          .map((c) =>
            c.id === msg.conversationId
              ? { ...c, lastMessage: msg, updatedAt: msg.createdAt }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      };
    }

    case "UPDATE_CONVERSATION_NOTIFICATION": {
      const notif = action.payload;
      const isActive = state.activeConversationId === notif.conversationId;

      return {
        ...state,
        conversations: state.conversations
          .map((c) =>
            c.id === notif.conversationId
              ? {
                  ...c,
                  lastMessage: notif.lastMessage,
                  unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
                  updatedAt: notif.lastMessage?.createdAt || c.updatedAt,
                }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      };
    }

    case "SET_ACTIVE_CONVERSATION":
      return { ...state, activeConversationId: action.payload };

    case "MARK_CONVERSATION_READ":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload ? { ...c, unreadCount: 0 } : c,
        ),
      };

    case "PREPEND_MESSAGES": {
      const { conversationId, messages } = action.payload;
      const current = state.messages[conversationId] || [];
      const ids = new Set(current.map((m) => m.id));
      const unique = messages.filter((m) => !ids.has(m.id));
      const updated = [...unique, ...current].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      return {
        ...state,
        messages: { ...state.messages, [conversationId]: updated },
      };
    }

    case "REPLACE_MESSAGE": {
      const { tempId, finalMessage } = action.payload;
      const cid = finalMessage.conversationId;
      return {
        ...state,
        messages: {
          ...state.messages,
          [cid]: (state.messages[cid] || []).map((m) =>
            m.tempId === tempId || m.id === tempId ? finalMessage : m,
          ),
        },
      };
    }

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: { ...state.messages, [action.payload]: [] },
      };

    default:
      return state;
  }
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (payload: {
    conversationId: string;
    senderId: string;
    content: string;
    tempId: string;
  }) => void;
} | null>(null);

const socketref: { current: Socket | null } = { current: null };

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    conversations: [],
    messages: {},
    activeConversationId: null,
    loadingConversations: true,
    loadingMessages: false,
  });

  const [isConnected, setIsConnected] = useState(false);
  const previousConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("[ChatProvider] Initializing socket effect...");
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && !socketref.current) {
      console.log("[Socket] Token found, attempting to connect...");
      socketref.current = io(SOCKET_URL || "", {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: CHAT_MAGIC_NUMBERS.SOCKET_RECONNECTION_ATTEMPTS,
      });

      socketref.current.on(socketEvents.CONNECT, () => {
        console.log(
          "✅ [Socket] Connected successfully with ID:",
          socketref.current?.id,
        );
        setIsConnected(true);
      });
      socketref.current.on(socketEvents.DISCONNECT, (reason) => {
        console.log("🔌 [Socket] Disconnected:", reason);
        setIsConnected(false);
      });
      socketref.current.on(socketEvents.CONNECT_ERROR, (err) => {
        console.error("❌ [Socket] Connection Error:", err.message);
        setIsConnected(false);
      });

      socketref.current.on(socketEvents.RECEIVE_MESSAGE, (message: Message) => {
        console.log("📩 [Socket] Received 'receive_message' event:", message);
        dispatch({ type: "ADD_MESSAGE", payload: message });
      });

      socketref.current.on(
        socketEvents.UNREAD_NOTIFICATION,
        (notif: UnReadnotification) => {
          console.log(
            "🔔 [Socket] Received 'unread_message_notification' event:",
            notif,
          );
          dispatch({
            type: "UPDATE_CONVERSATION_NOTIFICATION",
            payload: notif,
          });
        },
      );
    }

    return () => {
      if (socketref.current) {
        console.log("[Socket] Cleaning up and disconnecting socket...");
        socketref.current.disconnect();
        socketref.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected && socketref.current) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) {
        socketref.current.emit(socketEvents.JOIN_USER, user.id);
        console.log(`🚪 [Socket] Emitted 'join_user' for room: ${user.id}`);
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && socketref.current) {
      const previousConversationId = previousConversationIdRef.current;
      const activeConversationId = state.activeConversationId;

      if (
        previousConversationId &&
        previousConversationId !== activeConversationId
      ) {
        socketref.current.emit(
          socketEvents.LEAVE_CONVERSATION,
          previousConversationId,
        );
        console.log(
          `🚪 [Socket] Emitted 'leave_conversation' for room: ${previousConversationId}`,
        );
      }

      if (activeConversationId) {
        socketref.current.emit(
          socketEvents.JOIN_CONVERSATION,
          activeConversationId,
        );
        console.log(
          `🚪 [Socket] Emitted 'join_conversation' for room: ${activeConversationId}`,
        );
      }

      previousConversationIdRef.current = activeConversationId;
    }
  }, [isConnected, state.activeConversationId]);

  const sendMessage = useCallback(
    (payload: {
      conversationId: string;
      senderId: string;
      content: string;
      tempId: string;
    }) => {
      if (socketref.current && isConnected) {
        console.log(
          "📤 [Socket] Emitting 'send_message' with payload:",
          payload,
        );
        socketref.current.emit(socketEvents.SEND_MESSAGE, payload);
      } else {
        console.error(errorMessages.CHAT_NOT_CONNECTED_SEND_MESSAGE);
      }
    },
    [isConnected],
  );

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      sendMessage,
    }),
    [state, sendMessage],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
