# Analysis Report: Repeated Values in Postify.ts Frontend

This report outlines the repeated/duplicated values found in the Postify.ts frontend codebase.

## 1. API Configuration

### 1.1. Base URLs

- **`process.env.NEXT_PUBLIC_API_BASE_URL`**:
  - `utils/Apis/authApi.ts:5`
  - `utils/Apis/commentApi.ts:4`
  - `utils/Apis/postApi.ts:4`
  - `utils/Apis/userApi.ts:4`
- **`process.env.NEXT_PUBLIC_CHAT_SOCKET_URL`**:
  - `utils/Apis/chatApi.ts:4`
- **`process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE_URL`**:
  - `utils/Apis/notificationApi.ts:4`

### 1.2. Headers

- **`"Content-Type": "application/json"`**:
  - `utils/Apis/authApi.ts:7`
  - `utils/Apis/chatApi.ts:6`
  - `utils/Apis/commentApi.ts:6`
  - `utils/Apis/notificationApi.ts:6`
  - `utils/Apis/postApi.ts:6`
  - `utils/Apis/userApi.ts:6`

## 2. Authentication

### 2.1. `localStorage` Key for Token

- **`"token"`**:
  - `utils/auth.ts:6`
  - `utils/hooks/useNotificationSocket.ts:14`
  - `utils/context/ChatContext.tsx:217`
  - `utils/Apis/userApi.ts:13`
  - `utils/Apis/postApi.ts:13`
  - `utils/Apis/notificationApi.ts:13`
  - `utils/Apis/commentApi.ts:13`
  - `utils/Apis/chatApi.ts:14`
  - `components/layout/Sidebar.tsx:20`
  - `components/layout/Navbar.tsx:31, L47`
  - `app/(auth)/login/page.tsx:30`

### 2.2. Authorization Header Format

- **`Bearer ${token}`**:
  - `utils/Apis/userApi.ts:15`
  - `utils/Apis/postApi.ts:15`
  - `utils/Apis/notificationApi.ts:15`
  - `utils/Apis/commentApi.ts:15`
  - `utils/Apis/chatApi.ts:16`

## 3. API Endpoints (URL Paths)

The following API endpoints are hardcoded as strings.

### 3.1. Auth API (`utils/Apis/authApi.ts`)

- `/auth/register`
- `/auth/login`

### 3.2. Chat API (`utils/Apis/chatApi.ts`)

- `/chat/conversations`
- `/chat/conversations/:conversationId/messages`
- `/chat/conversations/:conversationId/read`

### 3.3. Comment API (`utils/Apis/commentApi.ts`)

- `/posts/:postId/comments`

### 3.4. Notification API (`utils/Apis/notificationApi.ts`)

- `/notifications`
- `/notifications/read`

### 3.5. Post API (`utils/Apis/postApi.ts`)

- `/posts`
- `/posts/categories`
- `/posts/feed`
- `/posts/:postId/like`
- `/posts/:postId/dislike`
- `/posts/user/:username`
- `/posts/:id/likers`
- `/posts/:id/dislikers`

### 3.6. User API (`utils/Apis/userApi.ts`)

- `/users/search`
- `/users/suggestions`
- `/users/:userId/follow`
- `/users/:username`
- `/users/:username/posts`
- `/users/profile`
- `/users/profile/privacy`
- `/users/:username/followers`
- `/users/:username/following`
- `/users/explore/suggestions`

## 4. Socket.IO Events

- **`"connect"`**: `utils/hooks/useNotificationSocket.ts:29`
- **`"connect_error"`**: `utils/hooks/useNotificationSocket.ts:33`
- **`"disconnect"`**: `utils/hooks/useChatSocket.ts:37` (commented out)
- **`"receive_message"`**: `utils/hooks/useChatSocket.ts:47` (commented out)
- **`"unread_notification"`**: `utils/hooks/useChatSocket.ts:59` (commented out)
- **`"leave_conversation"`**: `utils/hooks/useChatSocket.ts:82` (commented out)
- **`"join_conversation"`**: `utils/hooks/useChatSocket.ts:87` (commented out)
- **`"send_message"`**: `utils/hooks/useChatSocket.ts:103` (commented out)
- **`"notification"`**: `utils/context/NotificationsContext.tsx:77`

## 5. Error Messages

Numerous generic error messages are repeated, for example:

- `"Failed to fetch..."`
- `"An unexpected error occurred..."`
- `"Please try again later."`

## 6. UI Strings

A full search for repeated UI strings (e.g., button labels, titles, placeholders) was not performed, but it is highly likely that such repetitions exist throughout the `components` and `app` directories.

## Values That Should NOT Be Constants

- **Dynamic URL parameters**: Values like `postId`, `username`, `conversationId`, etc., which are passed to functions and embedded in URLs, are runtime values and should not be constants.
- **Runtime variables**: The `token` variable itself is a runtime value.
- **Context-specific error messages**: Error messages that include dynamic data (e.g., `"Failed to fetch posts for user \"${username}\""`) should not be made into constants, although the template string itself could be a function.
