export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const NOTIFICATION_API_BASE_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE_URL;

export const HEADERS = {
  "Content-Type": "application/json",
};

export const AUTH_API = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
};

export const CHAT_API = {
  CONVERSATIONS: "/conversations",
  CREATE_CONVERSATION: "/conversations",
  MESSAGES: (conversationId: string) =>
    `/conversations/${conversationId}/messages`,
  MARK_READ: (conversationId: string) =>
    `/conversations/${conversationId}/read`,
};

export const POST_API = {
  CREATE_POST: "/posts",
  CATEGORIES: "/posts/categories",
  GET_POSTS: "/posts",
  GET_POSTS_BY_USERNAME: (username: string) => `/users/${username}/posts`,
  FEED: "/posts/feed",
  LIKE: (postId: string) => `/posts/${postId}/like`,
  UNLIKE: (postId: string) => `/posts/${postId}/like`,
  DISLIKE: (postId: string) => `/posts/${postId}/dislike`,
  UNDISLIKE: (postId: string) => `/posts/${postId}/dislike`,
  UPDATE_POST: (postId: string) => `/posts/${postId}`,
  DELETE_POST: (postId: string) => `/posts/${postId}`,
  GET_LIKERS: (id: string) => `/posts/${id}/likers`,
  GET_DISLIKERS: (id: string) => `/posts/${id}/dislikers`,
};

export const COMMENT_API = {
  BY_POST: (postId: string) => `/posts/${postId}/comments`,
};

export const USER_API = {
  SEARCH: "/users/search",
  SUGGESTIONS: "/users/suggestions",
  FOLLOW: (userId: string) => `/users/${userId}/follow`,
  UNFOLLOW: (userId: string) => `/users/${userId}/follow`,
  PROFILE: "/users/profile",
  PROFILE_PRIVACY: "/users/profile/privacy",
  GET_BY_USERNAME: (username: string) => `/users/${username}`,
  GET_POSTS_BY_USERNAME: (username: string) => `/users/${username}/posts`,
  FOLLOWERS: (username: string) => `/users/${username}/followers`,
  FOLLOWING: (username: string) => `/users/${username}/following`,
  EXPLORE: "/users/explore/suggestions",
};

export const NOTIFICATION_API = {
  LIST: "/",
  MARK_READ: "/read",
};
