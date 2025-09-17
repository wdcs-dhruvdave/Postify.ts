# Chat Module Analysis Report

This report details repeated values and potential constants within the chat module of the Postify frontend.

## 1. UI Strings

- **`"Type a message..."`**:
  - `components/chat/MessageInput.tsx:65`
- **`"No messages yet."`**:
  - `components/chat/MessageList.tsx:15`
- **`"Select a conversation to start chatting."`**:
  - `components/chat/ChatWindow.tsx:112`
- **`"Loading older messages..."`**:
  - `components/chat/ChatWindow.tsx:138`
- **`"Chats"`** (as a label/title):
  - `components/chat/ConversationList.tsx:34`
- **`"user"`** (localStorage key):
  - `utils/context/ChatContext.tsx:209`
  - `components/layout/Navbar.tsx:32`
  - `components/layout/Sidebar.tsx:14`
- **`"default-avatar.png"`**:
  - `components/chat/MessageBubble.tsx:22`
  - `components/chat/ChatHeader.tsx:27`

## 2. Socket Event Names

- **`"connect"`**:
  - `utils/context/ChatContext.tsx:170`
- **`"disconnect"`**:
  - `utils/context/ChatContext.tsx:175`
- **`"connect_error"`**:
  - `utils/context/ChatContext.tsx:179`
- **`"receive_message"`**:
  - `utils/context/ChatContext.tsx:184`
- **`"unread_message_notification"`**:
  - `utils/context/ChatContext.tsx:189`
- **`"join_user"`**:
  - `utils/context/ChatContext.tsx:212`
- **`"leave_conversation"`**:
  - `utils/context/ChatContext.tsx:229`
- **`"join_conversation"`**:
  - `utils/context/ChatContext.tsx:235`
- **`"send_message"`**:
  - `utils/context/ChatContext.tsx:256`

## 3. Chat-Specific Error Messages

- **`"Failed to fetch conversations."`**:
  - `utils/Apis/chatApi.ts:31`
- **`"An unexpected error occurred while fetching conversations."`**:
  - `utils/Apis/chatApi.ts:35`
- **`"Failed to create conversation."`**:
  - `utils/Apis/chatApi.ts:51`
- **`"Failed to fetch messages."`**:
  - `utils/Apis/chatApi.ts:73`
- **`"An unexpected error occurred while fetching messages."`**:
  - `utils/Apis/chatApi.ts:77`
- **`"Failed to mark conversation as read."`**:
  - `utils/Apis/chatApi.ts:95`
- **`"An unexpected error occurred while marking conversation as read."`**:
  - `utils/Apis/chatApi.ts:99`
- **`"Not connected, cannot send message."`**:
  - `utils/context/ChatContext.tsx:258`

## 4. Magic Numbers

- **`5`** (reconnectionAttempts):
  - `utils/context/ChatContext.tsx:167`
- **`1`** (pageNum default):
  - `utils/Apis/chatApi.ts:62`
- **`10`** (limit default):
  - `utils/Apis/chatApi.ts:62`

## Values That Should NOT Be Constants

- Dynamic values like `conversationId`, `message.id`, `user.id`, `receiverId`, `pageNum`, `limit`.
- Console log messages that are for debugging purposes.
