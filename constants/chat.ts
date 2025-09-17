export const chatEndpoints = {
  conversations: "/chat/conversations",
  messages: "/chat/conversations/:conversationId/messages",
  markRead: "/chat/conversations/:conversationId/read",
};

export const socketEvents = {
  CONNECT: "connect",
  CONNECT_ERROR: "connect_error",
  DISCONNECT: "disconnect",
  RECEIVE_MESSAGE: "receive_message",
  UNREAD_NOTIFICATION: "unread_notification",
  LEAVE_CONVERSATION: "leave_conversation",
  JOIN_CONVERSATION: "join_conversation",
  SEND_MESSAGE: "send_message",
  NOTIFICATION: "notification",
  JOIN_USER: "join_user", // Added from analysis
};

export const CHAT_UI_STRINGS = {
  MESSAGE_INPUT_PLACEHOLDER: "Type a message...",
  NO_MESSAGES_YET: "No messages yet.",
  SELECT_CONVERSATION_PROMPT: "Select a conversation to start chatting.",
  LOADING_OLDER_MESSAGES: "Loading older messages...",
  CHAT_TITLE: "Chats",
  DEFAULT_AVATAR_URL: "/default-avatar.png",
  STARTING_CHAT_MESSAGE: "Start a new chat",
};

export const CHAT_MAGIC_NUMBERS = {
  SOCKET_RECONNECTION_ATTEMPTS: 5,
  DEFAULT_PAGE_NUM: 1,
  DEFAULT_MESSAGE_LIMIT: 10,
};
