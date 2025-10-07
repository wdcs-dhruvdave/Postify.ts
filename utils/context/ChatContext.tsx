"use client";
import {
  TOKEN_KEY,
  CHAT_API_BASE_URL,
  socketEvents,
  CHAT_MAGIC_NUMBERS,
  MESSAGES,
  CONFIG,
  STORAGE_KEYS,
  CHAT_ACTION_TYPES,
} from "../../constants";
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

// Chat action type using centralized constants
type ChatAction =
  | {
      type: typeof CHAT_ACTION_TYPES.SET_LOADING_CONVERSATIONS;
      payload: boolean;
    }
  | {
      type: typeof CHAT_ACTION_TYPES.SET_CONVERSATIONS;
      payload: Conversation[];
    }
  | { type: typeof CHAT_ACTION_TYPES.SET_LOADING_MESSAGES; payload: boolean }
  | {
      type: typeof CHAT_ACTION_TYPES.SET_MESSAGES;
      payload: { conversationId: string; messages: Message[] };
    }
  | { type: typeof CHAT_ACTION_TYPES.ADD_MESSAGE; payload: Message }
  | {
      type: typeof CHAT_ACTION_TYPES.UPDATE_CONVERSATION_NOTIFICATION;
      payload: UnReadnotification;
    }
  | {
      type: typeof CHAT_ACTION_TYPES.SET_ACTIVE_CONVERSATION;
      payload: string | null;
    }
  | { type: typeof CHAT_ACTION_TYPES.MARK_CONVERSATION_READ; payload: string }
  | {
      type: typeof CHAT_ACTION_TYPES.PREPEND_MESSAGES;
      payload: { conversationId: string; messages: Message[] };
    }
  | {
      type: typeof CHAT_ACTION_TYPES.REPLACE_MESSAGE;
      payload: { tempId: string; finalMessage: Message };
    }
  | { type: typeof CHAT_ACTION_TYPES.CLEAR_MESSAGES; payload: string };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  console.log(MESSAGES.SOCKET_LOGS.ACTION_DISPATCHED, action.type, {
    payload: action.payload,
    currentState: state,
  });

  switch (action.type) {
    case CHAT_ACTION_TYPES.SET_LOADING_CONVERSATIONS:
      return { ...state, loadingConversations: action.payload };

    case CHAT_ACTION_TYPES.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
        loadingConversations: false,
      };

    case CHAT_ACTION_TYPES.SET_LOADING_MESSAGES:
      return { ...state, loadingMessages: action.payload };

    case CHAT_ACTION_TYPES.SET_MESSAGES:
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

    case CHAT_ACTION_TYPES.ADD_MESSAGE: {
      const msg = action.payload;
      const existing = state.messages[msg.conversationId] || [];

      if (existing.some((m) => m.id === msg.id)) {
        console.log(`${MESSAGES.SOCKET_LOGS.ADD_MESSAGE_SKIPPED} ${msg.id}`);
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

    case CHAT_ACTION_TYPES.UPDATE_CONVERSATION_NOTIFICATION: {
      const notif = action.payload;
      const isActive = state.activeConversationId === notif.conversationId;
      const conversationId = notif.conversationId;
      const lastMessage = notif.lastMessage;

      if (!lastMessage) {
        return state;
      }

      const existingMessages = state.messages[conversationId] || [];
      const messageExists = existingMessages.some(
        (m) => m.id === lastMessage.id,
      );

      const updatedMessages = messageExists
        ? existingMessages
        : [...existingMessages, lastMessage].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
        conversations: state.conversations
          .map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: lastMessage,
                  unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
                  updatedAt: lastMessage.createdAt,
                }
              : c,
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
      };
    }

    case CHAT_ACTION_TYPES.SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversationId: action.payload };

    case CHAT_ACTION_TYPES.MARK_CONVERSATION_READ:
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload ? { ...c, unreadCount: 0 } : c,
        ),
      };

    case CHAT_ACTION_TYPES.PREPEND_MESSAGES: {
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

    case CHAT_ACTION_TYPES.REPLACE_MESSAGE: {
      const { tempId, finalMessage } = action.payload;
      const cid = finalMessage.conversationId;
      const messages = state.messages[cid] || [];
      const messageIndex = messages.findIndex(
        (m) => m.tempId === tempId || m.id === tempId,
      );

      if (messageIndex !== -1) {
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = finalMessage;
        return {
          ...state,
          messages: {
            ...state.messages,
            [cid]: updatedMessages,
          },
        };
      } else {
        return {
          ...state,
          messages: {
            ...state.messages,
            [cid]: [...messages, finalMessage],
          },
        };
      }
    }

    case CHAT_ACTION_TYPES.CLEAR_MESSAGES:
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

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const socketref = useRef<Socket | null>(null);
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
    console.log(MESSAGES.SOCKET_LOGS.INITIALIZING);
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && !socketref.current) {
      console.log(MESSAGES.SOCKET_LOGS.TOKEN_FOUND);
      socketref.current = io(CHAT_API_BASE_URL || "", {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: CHAT_MAGIC_NUMBERS.RECONNECTION_ATTEMPTS,
        reconnectionDelay: CONFIG.WEBSOCKET.RECONNECTION_DELAY,
        reconnectionDelayMax: CONFIG.WEBSOCKET.RECONNECTION_DELAY_MAX,
        timeout: CONFIG.WEBSOCKET.TIMEOUT,
        forceNew: CONFIG.WEBSOCKET.FORCE_NEW,
        transports: [...CONFIG.WEBSOCKET.TRANSPORTS],
      });

      socketref.current.on(socketEvents.CONNECT, () => {
        console.log(
          MESSAGES.SOCKET_LOGS.CONNECTED_SUCCESSFULLY,
          socketref.current?.id,
        );
        setIsConnected(true);
      });

      socketref.current.on(socketEvents.DISCONNECT, (reason) => {
        console.log(MESSAGES.SOCKET_LOGS.DISCONNECTED, reason);
        setIsConnected(false);

        if (reason === MESSAGES.SOCKET_REASONS.IO_SERVER_DISCONNECT) {
          console.log(MESSAGES.SOCKET_LOGS.SERVER_DISCONNECT);
          setTimeout(() => {
            if (socketref.current) {
              socketref.current.connect();
            }
          }, CONFIG.WEBSOCKET.RECONNECTION_DELAY);
        }
      });

      socketref.current.on(socketEvents.CONNECT_ERROR, (err) => {
        console.error(MESSAGES.SOCKET_LOGS.CONNECTION_ERROR, err.message);
        setIsConnected(false);

        if (
          err.message.includes(MESSAGES.SOCKET_REASONS.AUTHENTICATION) ||
          err.message.includes(MESSAGES.SOCKET_REASONS.UNAUTHORIZED)
        ) {
          console.log(MESSAGES.SOCKET_LOGS.AUTH_FAILED);
        }
      });

      socketref.current.on(
        socketEvents.RECEIVE_MESSAGE,
        (message: Message & { tempId?: string }) => {
          console.log(MESSAGES.SOCKET_LOGS.RECEIVED_MESSAGE, message);
          if (message.tempId) {
            dispatch({
              type: CHAT_ACTION_TYPES.REPLACE_MESSAGE,
              payload: { tempId: message.tempId, finalMessage: message },
            });
          } else {
            dispatch({ type: CHAT_ACTION_TYPES.ADD_MESSAGE, payload: message });
          }
        },
      );

      socketref.current.on(
        socketEvents.UNREAD_MESSAGE_NOTIFICATION,
        (notif: UnReadnotification) => {
          console.log(MESSAGES.SOCKET_LOGS.RECEIVED_UNREAD, notif);
          dispatch({
            type: CHAT_ACTION_TYPES.UPDATE_CONVERSATION_NOTIFICATION,
            payload: notif,
          });
        },
      );
    }

    return () => {
      if (socketref.current) {
        console.log(MESSAGES.SOCKET_LOGS.SOCKET_CLOSING);
        socketref.current.disconnect();
        socketref.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected && socketref.current) {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");
      if (user.id) {
        socketref.current.emit(socketEvents.JOIN_USER, user.id);
        console.log(`${MESSAGES.SOCKET_LOGS.JOIN_USER_EMITTED} ${user.id}`);
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && socketref.current) {
      const previousConversationId = previousConversationIdRef.current;
      const activeConversationId = state.activeConversationId;

      if (previousConversationId !== activeConversationId) {
        socketref.current.emit(socketEvents.SWITCH_CONVERSATION, {
          oldConversationId: previousConversationId,
          newConversationId: activeConversationId,
        });
        console.log(
          `${MESSAGES.SOCKET_LOGS.SWITCH_CONVERSATION} ${previousConversationId} to ${activeConversationId}`,
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
        console.log(MESSAGES.SOCKET_LOGS.SEND_MESSAGE_EMIT, payload);
        socketref.current.emit(socketEvents.SEND_MESSAGE, payload);
      } else {
        console.error(MESSAGES.ERROR.SOCKET_NOT_CONNECTED);
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
    throw new Error(MESSAGES.CONTEXT_ERRORS.USE_CHAT_OUTSIDE_PROVIDER);
  }
  return context;
};
