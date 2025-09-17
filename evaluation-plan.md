# Evaluation Plan: Module-Wise Constants for Postify Frontend

This document outlines the plan for refactoring the Postify frontend to use module-wise constants for repeated values.

## 1. Proposed Constants Structure

```
src/
  constants/
    api.ts         # Base URLs + API endpoint paths
    auth.ts        # Auth-related constants (token key, headers)
    chat.ts        # Chat socket events, endpoints
    post.ts        # Post module endpoints + configs
    comment.ts     # Comment module endpoints
    notification.ts# Notification events + endpoints
    user.ts        # User module endpoints, roles
    ui.ts          # Common UI labels, error messages, placeholders
```

## 2. Module Plans

### 2.1. API (`constants/api.ts`)

- **`BASE_URL`**: `process.env.NEXT_PUBLIC_API_BASE_URL`
- **`CHAT_SOCKET_URL`**: `process.env.NEXT_PUBLIC_CHAT_SOCKET_URL`
- **`NOTIFICATION_BASE_URL`**: `process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE_URL`
- **`HEADERS`**: `{ 'Content-Type': 'application/json' }`

*Naming*: `UPPER_CASE` for fixed env values, `camelCase` for grouped maps (headers).

### 2.2. Auth (`constants/auth.ts`)

- **`TOKEN_KEY`**: `"token"`
- **`AUTH_HEADER`**: `(token) => `Bearer ${token}``
- **`authEndpoints`**: `{ register: '/auth/register', login: '/auth/login' }`

*Naming*: `TOKEN_KEY` → `UPPER_CASE`, `authEndpoints` → `camelCase`.

### 2.3. Chat (`constants/chat.ts`)

- **`chatEndpoints`**: `{ conversations: '/chat/conversations', messages: '/chat/conversations/:conversationId/messages', markRead: '/chat/conversations/:conversationId/read' }`
- **`socketEvents`**: `{ CONNECT: 'connect', CONNECT_ERROR: 'connect_error', DISCONNECT: 'disconnect', RECEIVE_MESSAGE: 'receive_message', UNREAD_NOTIFICATION: 'unread_notification', LEAVE_CONVERSATION: 'leave_conversation', JOIN_CONVERSATION: 'join_conversation', SEND_MESSAGE: 'send_message', NOTIFICATION: 'notification' }`

*Naming*: `socketEvents` keys in `UPPER_CASE`, object name `camelCase`.

### 2.4. Post (`constants/post.ts`)

- **`postEndpoints`**: `{ list: '/posts', categories: '/posts/categories', feed: '/posts/feed', like: '/posts/:postId/like', dislike: '/posts/:postId/dislike', userPosts: '/posts/user/:username', likers: '/posts/:id/likers', dislikers: '/posts/:id/dislikers' }`

### 2.5. Comment (`constants/comment.ts`)

- **`commentEndpoints`**: `{ byPost: '/posts/:postId/comments' }`

### 2.6. Notification (`constants/notification.ts`)

- **`notificationEndpoints`**: `{ list: '/notifications', markRead: '/notifications/read' }`

### 2.7. User (`constants/user.ts`)

- **`userEndpoints`**: `{ search: '/users/search', suggestions: '/users/suggestions', follow: '/users/:userId/follow', profile: '/users/profile', profilePrivacy: '/users/profile/privacy', username: '/users/:username', usernamePosts: '/users/:username/posts', followers: '/users/:username/followers', following: '/users/:username/following', explore: '/users/explore/suggestions' }`

### 2.8. UI (`constants/ui.ts`)

- **`errorMessages`**: `{ generic: 'An unexpected error occurred...', fetchFailed: 'Failed to fetch...', tryAgain: 'Please try again later.' }`

## 3. Naming Conventions

- **`UPPER_CASE`**: fixed single values (`TOKEN_KEY`, `BASE_URL`).
- **`camelCase`**: grouped constants in objects (`apiRoutes`, `socketEvents`, `postEndpoints`).
- **`PascalCase`**: only if enum-like (e.g., `MessageStatus`, `UserRole`).

## 4. Files to Update

- All `utils/Apis/*.ts` → import endpoints & headers from `constants/api.ts`, `auth.ts`, etc.
- All components/hooks using `"token"` → import `TOKEN_KEY`.
- All socket hooks → import `socketEvents` from `constants/chat.ts`.
- `Navbar`, `Sidebar`, Auth pages → replace `"token"` with `TOKEN_KEY`.
- API calls → replace `"Bearer ${token}"` with `AUTH_HEADER(token)`.
- Error handling → replace with `errorMessages.generic`, etc.

## 5. Safety Checklist

- [X] Replace using named imports only.
- [X] Ensure no env values are hardcoded — rely on `process.env.*`.
- [X] Run `npm run lint`, `npm run build`, `npm test`.
- [X] Use AST-aware refactor (avoid regex).
- [X] Update TS types if needed (constants can be typed).
