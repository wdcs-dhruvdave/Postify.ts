# Chat Module Evaluation Plan: Module-Wise Constants

This document outlines the plan for refactoring the chat module to use module-wise constants for repeated values.

## 1. Proposed Constants Structure

- `src/constants/chat.ts` (for chat-specific UI strings, socket events, and magic numbers)
- `src/constants/ui.ts` (for general UI strings and error messages, some already exist)

## 2. Module Plans

### 2.1. Chat (`constants/chat.ts`)

- **UI Strings:**
  - `MESSAGE_INPUT_PLACEHOLDER`: `"Type a message..."`
  - `NO_MESSAGES_YET`: `"No messages yet."`
  - `SELECT_CONVERSATION_PROMPT`: `"Select a conversation to start chatting."`
  - `LOADING_OLDER_MESSAGES`: `"Loading older messages..."`
  - `CHAT_TITLE`: `"Chats"`
  - `DEFAULT_AVATAR_URL`: `"/default-avatar.png"`
- **Socket Events:** (These are already in `constants/chat.ts` from the previous refactor, but will be used consistently)
  - `socketEvents.CONNECT`
  - `socketEvents.CONNECT_ERROR`
  - `socketEvents.DISCONNECT`
  - `socketEvents.RECEIVE_MESSAGE`
  - `socketEvents.UNREAD_NOTIFICATION`
  - `socketEvents.JOIN_USER`
  - `socketEvents.LEAVE_CONVERSATION`
  - `socketEvents.JOIN_CONVERSATION`
  - `socketEvents.SEND_MESSAGE`
- **Magic Numbers:**
  - `SOCKET_RECONNECTION_ATTEMPTS`: `5`
  - `DEFAULT_PAGE_NUM`: `1`
  - `DEFAULT_MESSAGE_LIMIT`: `10`

*Naming*: `UPPER_CASE` for fixed UI strings and magic numbers. `camelCase` for grouped objects.

### 2.2. UI (`constants/ui.ts`)

- **Error Messages:** (These are already in `constants/ui.ts` from the previous refactor, but will be used consistently and new chat-specific ones added)
  - `errorMessages.generic`
  - `errorMessages.fetchFailed`
  - `errorMessages.tryAgain`
  - `CHAT_FAILED_TO_CREATE_CONVERSATION`: `"Failed to create conversation."`
  - `CHAT_FAILED_TO_MARK_READ`: `"Failed to mark conversation as read."`
  - `CHAT_NOT_CONNECTED_SEND_MESSAGE`: `"Not connected, cannot send message."`

*Naming*: `camelCase` for the object, `UPPER_CASE` for specific error message keys.

## 3. Files to Update:

- `components/chat/MessageInput.tsx`: `MESSAGE_INPUT_PLACEHOLDER`
- `components/chat/MessageList.tsx`: `NO_MESSAGES_YET`
- `components/chat/ChatWindow.tsx`: `SELECT_CONVERSATION_PROMPT`, `LOADING_OLDER_MESSAGES`, `SOCKET_RECONNECTION_ATTEMPTS`, `DEFAULT_PAGE_NUM`, `DEFAULT_MESSAGE_LIMIT`
- `components/chat/ConversationList.tsx`: `CHAT_TITLE`
- `components/chat/MessageBubble.tsx`: `DEFAULT_AVATAR_URL`
- `components/chat/ChatHeader.tsx`: `DEFAULT_AVATAR_URL`
- `utils/Apis/chatApi.ts`: `DEFAULT_PAGE_NUM`, `DEFAULT_MESSAGE_LIMIT`, `errorMessages.fetchFailed`, `errorMessages.generic`, `CHAT_FAILED_TO_CREATE_CONVERSATION`, `CHAT_FAILED_TO_MARK_READ`
- `utils/context/ChatContext.tsx`: `SOCKET_RECONNECTION_ATTEMPTS`, `socketEvents.*`, `CHAT_NOT_CONNECTED_SEND_MESSAGE`
- `utils/hooks/useChatSocket.ts`: `socketEvents.*` (if any hardcoded strings exist)
- `utils/hooks/useNotificationSocket.ts`: `socketEvents.UNREAD_NOTIFICATION` (already done, but double check)
- `components/layout/Navbar.tsx`: `TOKEN_KEY` (already done, but double check)
- `components/layout/Sidebar.tsx`: `TOKEN_KEY` (already done, but double check)
- `app/(auth)/login/page.tsx`: `TOKEN_KEY`, `errorMessages.generic` (already done, but double check)

## 4. Naming Conventions:

- `UPPER_CASE`: fixed single values (`MESSAGE_INPUT_PLACEHOLDER`, `SOCKET_RECONNECTION_ATTEMPTS`).
- `camelCase`: grouped constants in objects (`chatEndpoints`, `socketEvents`, `errorMessages`).
- `PascalCase`: only if enum-like (not applicable here for new constants).

## 5. Safety Checklist:

- Replace using named imports only.
- Ensure no env values are hardcoded — rely on `process.env.*`.
- Run `npm run lint`, `npm run build`, `npm test`. (Manual execution due to tool limitations)
- Use AST-aware refactor (avoid regex).
- Update TS types if needed (constants can be typed).
