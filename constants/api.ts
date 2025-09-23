export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const NOTIFICATION_API_BASE_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE_URL;
export const CHAT_API_BASE_URL = `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/chat`;

export const HEADERS = {
  "Content-Type": "application/json",
};

export const AUTH_API = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
};

export const CHAT_API = {
  CONVERSATIONS: "/conversations",
  MESSAGES: (id: string) => `/conversations/${id}/messages`,
  MARK_READ: (id: string) => `/conversations/${id}/read`,
};

export const POST_API = {
  CREATE_POST: "/posts",
  CATEGORIES: "/posts/categories",
  CATEGORY: (id: string) => `/posts/categories/${id}`,
  GET_POSTS: "/posts",
  FEED: "/posts/feed",
  RECOMMENDED: "/posts/recommended",
  LIKE: (id: string) => `/posts/${id}/like`,
  UNLIKE: (id: string) => `/posts/${id}/like`,
  DISLIKE: (id: string) => `/posts/${id}/dislike`,
  UNDISLIKE: (id: string) => `/posts/${id}/dislike`,
  UPDATE_POST: (id: string) => `/posts/${id}`,
  DELETE_POST: (id: string) => `/posts/${id}`,
  GET_LIKERS: (id: string) => `/posts/${id}/likers`,
  GET_DISLIKERS: (id: string) => `/posts/${id}/dislikers`,
};

export const COMMENT_API = {
  BY_POST: (postId: string) => `/posts/${postId}/comments`,
};

export const USER_API = {
  SEARCH: "/users/search",
  SUGGESTIONS: "/users/suggestions",
  FOLLOW: (id: string) => `/users/${id}/follow`,
  UNFOLLOW: (id: string) => `/users/${id}/follow`,
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
