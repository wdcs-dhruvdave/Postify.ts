// ====================== ENVIRONMENT & API CONFIG ======================
export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
  NOTIFICATION_API_BASE_URL:
    process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE_URL ||
    "http://localhost:3002",
  CHAT_SOCKET_URL:
    process.env.NEXT_PUBLIC_CHAT_SOCKET_URL || "http://localhost:3002",
} as const;

export const API = {
  BASE_URL: `${ENV.API_BASE_URL}/api`,

  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },

  // Post endpoints
  POSTS: {
    CREATE: "/posts",
    LIST: "/posts",
    FEED: "/posts/feed",
    RECOMMENDED: "/posts/recommended",
    CATEGORIES: "/posts/categories",
    CATEGORY: (id: string) => `/posts/categories/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    DISLIKE: (id: string) => `/posts/${id}/dislike`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKERS: (id: string) => `/posts/${id}/likers`,
    DISLIKERS: (id: string) => `/posts/${id}/dislikers`,
  },

  // User endpoints
  USERS: {
    SEARCH: "/users/search",
    SUGGESTIONS: "/users/suggestions",
    PROFILE: "/users/profile",
    PROFILE_PRIVACY: "/users/profile/privacy",
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/follow`,
    BY_USERNAME: (username: string) => `/users/${username}`,
    POSTS_BY_USERNAME: (username: string) => `/users/${username}/posts`,
    FOLLOWERS: (username: string) => `/users/${username}/followers`,
    FOLLOWING: (username: string) => `/users/${username}/following`,
    EXPLORE: "/users/explore/suggestions",
  },

  // Chat endpoints
  CHAT: {
    BASE_URL: `${ENV.CHAT_SOCKET_URL}/chat`,
    CONVERSATIONS: "/conversations",
    MESSAGES: (id: string) => `/conversations/${id}/messages`,
    MARK_READ: (id: string) => `/conversations/${id}/read`,
  },

  // Comment endpoints
  COMMENTS: {
    BY_POST: (postId: string) => `/posts/${postId}/comments`,
  },

  // Notification endpoints
  NOTIFICATIONS: {
    LIST: "/",
    MARK_READ: "/read",
  },
} as const;

// ====================== SERVER CONFIGURATION ======================
export const SERVER_CONFIG = {
  DEFAULT_PORT: 4000,
  NOTIFICATION_PORT: 3002,
  CHAT_PORT: 3003,
  API_PREFIX: "/api",
  CORS_ORIGINS: {
    DEVELOPMENT: "http://localhost:3000",
    PRODUCTION: "https://your-frontend-domain.com",
    ALL: "*",
  },
  WEBSOCKET_CONFIG: {
    PING_TIMEOUT: 60000,
    PING_INTERVAL: 25000,
    NAMESPACE_CHAT: "chat",
    NAMESPACE_NOTIFICATIONS: "",
  },
} as const;

// ====================== FRONTEND ROUTES ======================
export const ROUTES = {
  HOME: "/",

  // Auth routes
  LOGIN: "/login",
  SIGNUP: "/signup",

  // Main routes
  FEED: "/feedpage",
  FOR_YOU: "/foryou",
  CHAT: "/chat",
  PROFILE: "/profile",

  // Dynamic routes
  POST_DETAIL: (id: string) => `/post/${id}`,
  CATEGORY: "/category",
} as const;

// ====================== SOCKET EVENTS ======================
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  CONNECT_ERROR: "connect_error",
  DISCONNECT: "disconnect",

  // Chat events
  JOIN_USER: "join_user",
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  SWITCH_CONVERSATION: "switch_conversation",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",

  // Notifications
  NOTIFICATION: "notification",
  UNREAD_MESSAGE_NOTIFICATION: "unread_message_notification",
} as const;

// ====================== MESSAGES & LABELS ======================
export const MESSAGES = {
  // Success messages
  SUCCESS: {
    REGISTRATION_SUCCESSFUL: "Registration successful! Please log in.",
    LOGIN_SUCCESSFUL: "Login successful!",
    LOGOUT_SUCCESSFUL: "Logged out successfully",
    POST_CREATED: "Post created successfully!",
    POST_UPDATED: "Post updated successfully!",
    POST_DELETED: "Post deleted successfully!",
    PROFILE_UPDATED: "Profile updated successfully!",
    FOLLOW_SUCCESS: "User followed successfully!",
    UNFOLLOW_SUCCESS: "User unfollowed successfully!",
    FOLLOWED: "Followed",
    UNFOLLOWED: "Unfollowed",
  },

  // Error messages
  ERROR: {
    GENERIC: "An unexpected error occurred.",
    UNEXPECTED_ERROR: "An unexpected error occurred.",
    FETCH_FAILED: "Failed to fetch data.",
    TRY_AGAIN: "Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NETWORK_ERROR: "Network error. Please check your connection.",
    FETCHING_LIKERS: "Error fetching post likers:",
    FETCHING_DISLIKERS: "Error fetching post dislikers:",
    COULD_NOT_FETCH_POSTS: "Could not fetch posts.",
    PLEASE_LOGIN_TO_LIKE: "Please log in to like posts.",
    PLEASE_LOGIN_TO_DISLIKE: "Please log in to dislike posts.",
    FAILED_TO_UPDATE_LIKE: "Failed to update like.",
    FAILED_TO_UPDATE_DISLIKE: "Failed to update dislike.",
    LOGIN_REQUIRED_LIKE: "Please log in to like posts.",
    LOGIN_REQUIRED_DISLIKE: "Please log in to dislike posts.",
    LIKE_UPDATE_FAILED: "Failed to update like.",
    DISLIKE_UPDATE_FAILED: "Failed to update dislike.",
    ERROR_LOADING_NOTIFICATIONS: "Error loading notifications:",
    ERROR_MARKING_NOTIFICATIONS: "Error marking notifications as read:",
    FETCH_SUGGESTIONS_FAILED: "Failed to fetch suggestions",
    SEARCH_FAILED: "Search failed",
    UNSUPPORTED_FILE_TYPE: "Unsupported file type.",
    INVALID_SERVER_RESPONSE:
      "Failed to receive a valid response from the server.",
    FETCH_CATEGORIES_FAILED: "Failed to fetch categories.",
    POST_CREATION_FAILED: "Failed to create post. Please try again later.",
    POST_CREATION_UNEXPECTED:
      "An unexpected error occurred while creating the post. Please try again.",
    CATEGORIES_FETCH_FAILED:
      "Failed to fetch categories. Please try again later.",
    CATEGORIES_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching categories. Please try again.",
    CATEGORY_FETCH_FAILED: "Failed to fetch category. Please try again later.",
    CATEGORY_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching category. Please try again.",
    POSTS_FETCH_FAILED: "Failed to fetch posts. Please try again later.",
    POSTS_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching posts. Please try again.",
    FEED_FETCH_FAILED: "Failed to fetch feed. Please try again later.",
    FEED_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching the feed. Please try again.",
    RECOMMENDED_FETCH_FAILED:
      "Failed to fetch recommended posts. Please try again later.",
    RECOMMENDED_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching recommended posts. Please try again.",
    POST_LIKE_FAILED: "Failed to like the post. Please try again later.",
    POST_LIKE_UNEXPECTED:
      "An unexpected error occurred while liking the post. Please try again.",
    POST_UNLIKE_FAILED: "Failed to unlike the post. Please try again later.",
    POST_UNLIKE_UNEXPECTED:
      "An unexpected error occurred while unliking the post. Please try again.",
    POST_DISLIKE_FAILED: "Failed to dislike the post. Please try again later.",
    POST_DISLIKE_UNEXPECTED:
      "An unexpected error occurred while disliking the post. Please try again.",
    POST_UNDISLIKE_FAILED: "Failed to remove dislike. Please try again later.",
    POST_UNDISLIKE_UNEXPECTED:
      "An unexpected error occurred while removing dislike. Please try again.",
    POST_UPDATE_FAILED: "Failed to update the post. Please try again later.",
    POST_UPDATE_UNEXPECTED:
      "An unexpected error occurred while updating the post. Please try again.",
    POST_DELETE_FAILED: "Failed to delete the post. Please try again later.",
    POST_DELETE_UNEXPECTED:
      "An unexpected error occurred while deleting the post. Please try again.",
    LIKERS_FETCH_FAILED: "Failed to fetch likers. Please try again later.",
    LIKERS_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching likers. Please try again.",
    DISLIKERS_FETCH_FAILED:
      "Failed to fetch dislikers. Please try again later.",
    DISLIKERS_FETCH_UNEXPECTED:
      "An unexpected error occurred while fetching dislikers. Please try again.",

    // User API errors
    USER_SUGGESTIONS_FAILED: "Failed to get suggestions.",
    USER_FOLLOW_FAILED: "Failed to follow user.",
    USER_UNFOLLOW_FAILED: "Failed to unfollow user.",
    USER_PROFILE_FETCH_FAILED: "Failed to fetch profile for user",
    USER_PROFILE_UPDATE_FAILED: "Failed to update your profile.",
    USER_PRIVACY_UPDATE_FAILED: "Failed to update your privacy settings.",
    USER_FOLLOWERS_FETCH_FAILED: "Failed to fetch followers for",
    USER_FOLLOWING_FETCH_FAILED: "Failed to fetch following list for",

    // Chat API errors
    CHAT_SEND_MESSAGE_FAILED_SIMPLE: "Failed to send message",

    // Notification API errors
    NOTIFICATIONS_MARK_READ_FAILED: "Failed to mark notifications as read.",

    // Comment errors
    FETCH_COMMENTS_FAILED: "Failed to fetch comments.",
    COMMENT_CREATION_FAILED: "Failed to create comment.",

    // Chat specific
    CHAT_CREATE_CONVERSATION_FAILED: "Failed to create conversation.",
    CHAT_MARK_READ_FAILED: "Failed to mark conversation as read.",
    CHAT_SEND_MESSAGE_FAILED: "Not connected, cannot send message.",
    CHAT_START_ERROR: "Failed to start chat.",
    SOCKET_NOT_CONNECTED: "⚠️ Socket not connected, cannot send.",
    SOCKET_URL_NOT_DEFINED:
      "NEXT_PUBLIC_CHAT_SOCKET_URL is not defined in .env.local",
  },

  // Loading states
  LOADING: {
    LOGGING_IN: "Logging in...",
    SIGNING_UP: "Creating account...",
    LOADING_POSTS: "Loading posts...",
    LOADING_MESSAGES: "Loading older messages...",
    SAVING: "Saving...",
    UPLOADING: "Uploading...",
  },

  // Empty states
  EMPTY: {
    NO_POSTS: "No posts available.",
    NO_MESSAGES: "No messages yet.",
    NO_NOTIFICATIONS: "No notifications.",
    NO_FOLLOWERS: "No followers yet.",
    NO_FOLLOWING: "Not following anyone yet.",
  },

  // Authentication messages
  AUTH: {
    SIGNUP_SUBTITLE: "Create an account to join the community.",
    LOGIN_SUBTITLE: "Welcome back! Please enter your details.",
    ALREADY_HAVE_ACCOUNT: "Already have an account?",
    DONT_HAVE_ACCOUNT: "Don't have an account?",
  },

  // Greeting messages
  GREETING: {
    HELLO: "Hello",
  },

  // Notifications
  NOTIFICATIONS: {
    RECEIVED_FROM: (sender: string) => `Notification Received from ${sender}`,
    DEFAULT_SENDER: "Someone",
  },

  // Confirmations
  CONFIRMATIONS: {
    DELETE_POST: "Are you sure you want to delete this post?",
  },

  // Context errors
  CONTEXT_ERRORS: {
    USE_NOTIFICATIONS_OUTSIDE_PROVIDER:
      "useNotifications must be used within a NotificationsProvider",
    USE_CHAT_OUTSIDE_PROVIDER: "useChat must be used within a ChatProvider",
  },

  // Socket connection logs
  SOCKET_LOGS: {
    INITIALIZING: "[ChatProvider] Initializing socket effect...",
    TOKEN_FOUND: "[Socket] Token found, attempting to connect...",
    CONNECTED_SUCCESSFULLY: "✅ [Socket] Connected successfully with ID:",
    DISCONNECTED: "🔌 [Socket] Disconnected:",
    CONNECTION_ERROR: "❌ [Socket] Connection Error:",
    SERVER_DISCONNECT:
      "🔄 [Socket] Server initiated disconnect, attempting to reconnect...",
    AUTH_FAILED: "🔑 [Socket] Authentication failed, token might be expired",
    RECEIVED_MESSAGE: "📩 [Socket] Received 'receive_message' event:",
    JOIN_USER_EMITTED: "🚪 [Socket] Emitted 'join_user' for room:",
    SWITCH_CONVERSATION: "🚪 [Socket] Emitted 'switch_conversation' from",
    ACTION_DISPATCHED: "[ChatReducer] Action Dispatched:",
    NO_TOKEN_WARNING: "⚠️ No token found, socket won't connect.",
    SOCKET_CLOSING: "🛑 Closing socket:",
    LEFT_ROOM: "🚪 Left room:",
    JOINED_ROOM: "🚪 Joined room:",
    RECEIVED_UNREAD: "🔔 Unread:",
    SEND_MESSAGE_EMIT: "📤 [Socket] Emitting 'send_message' with payload:",
    ADD_MESSAGE_SKIPPED:
      "[ChatReducer] ADD_MESSAGE skipped: Duplicate message ID",
    SEND_MESSAGE_LEGACY: "📤 [Socket] Emitting 'send_message' with payload:",
  },

  // Socket reasons
  SOCKET_REASONS: {
    IO_SERVER_DISCONNECT: "io server disconnect",
    AUTHENTICATION: "Authentication",
    UNAUTHORIZED: "401",
  },

  // Console log prefixes
  LOG_PREFIXES: {
    CHAT_PROVIDER: "[ChatProvider]",
    SOCKET: "[Socket]",
    CHAT_REDUCER: "[ChatReducer]",
    SEND_MESSAGE: "[send_message]",
    SOCKET_EMIT: "📤 [Socket] Emitting",
  },
} as const;

// UI Labels
export const LABELS = {
  // Navigation
  NAV: {
    MY_PROFILE: "My Profile",
    LOGOUT: "Logout",
    NOTIFICATIONS: "Notifications",
  },

  // Buttons
  BUTTONS: {
    GET_STARTED: "Get Started",
    SIGN_UP_NOW: "Sign Up Now",
    LOGIN: "Login",
    LOGOUT: "Logout",
    SIGN_UP: "Sign Up",
    SIGNUP: "Sign Up",
    REGISTER: "Register",
    FOLLOW: "Follow",
    FOLLOWING: "Following",
    EDIT: "Edit",
    DELETE: "Delete",
    SAVE: "Save",
    CANCEL: "Cancel",
    SEND: "Send",
    LOAD_MORE: "Load More",
    CREATE_ACCOUNT: "Create Account",
    CREATING_ACCOUNT: "Creating Account...",
    LOGGING_IN: "Logging in...",
  },

  // Navigation
  NAVIGATION: {
    MY_PROFILE: "My Profile",
  },

  // Modals
  MODALS: {
    LIKED_BY: "Liked by",
    DISLIKED_BY: "Disliked by",
  },

  // Dates
  DATES: {
    UNKNOWN_DATE: "Unknown date",
  },

  // Form labels
  FORMS: {
    USERNAME: "Username",
    EMAIL: "Email",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
    NAME: "Name",
    BIO: "Bio",
  },
} as const;

// Placeholders
export const PLACEHOLDERS = {
  USERNAME: "Choose a username",
  EMAIL: "you@example.com",
  PASSWORD: "••••••••",
  SEARCH: "Search users...",
  MESSAGE_INPUT: "Type a message...",
  CHAT_MESSAGE: "Type a message...",
  POST_CONTENT: "What's on your mind?",
  COMMENT: "Write a comment...",
  BIO: "Tell us about yourself...",
} as const;

// ====================== APP CONTENT ======================
export const CONTENT = {
  // Homepage sections
  HOMEPAGE: {
    HERO: {
      TITLE: "Welcome to Postify 🚀",
      SUBTITLE:
        "Your modern social platform to post updates, connect with others, and build your community.",
    },

    FEATURES: {
      CREATE_POSTS: {
        TITLE: "📝 Create Posts",
        DESCRIPTION: "Easily share your ideas and updates with the world.",
      },
      FOLLOW_USERS: {
        TITLE: "👥 Follow Users",
        DESCRIPTION: "Connect and follow others to build your network.",
      },
      MEDIA_UPLOADS: {
        TITLE: "📸 Media Uploads",
        DESCRIPTION: "Attach images or videos to enrich your content.",
      },
      COMMENTS_LIKES: {
        TITLE: "💬 Comments & Likes",
        DESCRIPTION: "Engage with posts using likes and comments.",
      },
      EXPLORE_FEED: {
        TITLE: "🔍 Explore Feed",
        DESCRIPTION: "Discover trending content and new creators.",
      },
      USER_PROFILES: {
        TITLE: "🧑‍💼 User Profiles",
        DESCRIPTION:
          "Showcase your posts, followers, and info on your profile.",
      },
    },

    HOW_IT_WORKS: {
      TITLE: "How Postify Works",
      STEPS: {
        CREATE_ACCOUNT: {
          TITLE: "1. Create an Account",
          DESCRIPTION:
            "Sign up with your email and set up your profile in seconds.",
        },
        START_POSTING: {
          TITLE: "2. Start Posting",
          DESCRIPTION:
            "Share text, media, and engage with the community instantly.",
        },
        GROW_NETWORK: {
          TITLE: "3. Grow Your Network",
          DESCRIPTION: "Follow users, get followers, and expand your reach.",
        },
      },
    },

    TESTIMONIALS: {
      TITLE: "What Our Users Say",
      USER1: {
        QUOTE:
          '"Postify is the easiest way I\'ve ever shared updates and connected with my audience."',
        AUTHOR: "– Aditi Sharma",
      },
      USER2: {
        QUOTE:
          '"It\'s like a mini social platform just for my niche community. I love it!"',
        AUTHOR: "– Karan Patel",
      },
    },

    CTA: {
      TITLE: "Ready to Join?",
    },
  },

  // Chat UI
  CHAT: {
    TITLE: "Chats",
    SELECT_CONVERSATION: "Select a conversation to start chatting.",
    STARTING_CHAT: "Start a new chat",
  },

  // Greetings
  GREETINGS: {
    USER_HELLO: (username: string) => `Hello, ${username}`,
  },
} as const;

// ====================== CONFIGURATION ======================
export const CONFIG = {
  // Animation timings (in seconds)
  ANIMATION: {
    DURATION_FAST: 0.2,
    DURATION_MEDIUM: 0.4,
    DURATION_NORMAL: 0.4,
    DURATION_SLOW: 0.6,
    DELAY_SHORT: 0.2,
    DELAY_MEDIUM: 0.4,
    DELAY_LONG: 0.6,
  },

  // Sizes (in pixels)
  SIZES: {
    AVATAR_SMALL: 36,
    AVATAR_MEDIUM: 40,
    AVATAR_LARGE: 48,
    ICON_SMALL: 16,
    ICON_MEDIUM: 20,
    ICON_LARGE: 24,
  },

  // Timeouts and delays (in milliseconds)
  TIMEOUTS: {
    TOAST_DURATION: 3000,
    MENU_CLOSE_DELAY: 150,
    DEBOUNCE_SEARCH: 300,
    AUTO_SAVE: 2000,
  },

  // Socket configuration
  SOCKET: {
    RECONNECTION_ATTEMPTS: 10,
    RECONNECTION_DELAY: 1000,
    RECONNECTION_DELAY_MAX: 5000,
    TIMEOUT: 20000,
    DEFAULT_PAGE_NUM: 1,
    DEFAULT_MESSAGE_LIMIT: 10,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    MESSAGE_LIMIT: 10,
    POST_LIMIT: 15,
    USER_LIMIT: 20,
    NOTIFICATION_LIMIT: 25,
  },

  // File limits
  FILES: {
    MAX_IMAGE_SIZE_MB: 5,
    MAX_VIDEO_SIZE_MB: 50,
    SUPPORTED_IMAGE_TYPES: ["jpg", "jpeg", "png", "gif", "webp"],
    SUPPORTED_VIDEO_TYPES: ["mp4", "mov", "avi", "webm"],
  },

  // Time formats
  TIME_FORMAT: {
    HOUR: "2-digit",
    MINUTE: "2-digit",
  },

  // WebSocket transports
  WEBSOCKET: {
    TRANSPORTS: ["websocket", "polling"],
    RECONNECTION_DELAY: 1000,
    RECONNECTION_DELAY_MAX: 5000,
    TIMEOUT: 20000,
    FORCE_NEW: true,
  },
} as const;

// ====================== STORAGE KEYS ======================
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_DATA: "user_data",
  USER: "user",
  THEME: "theme_preference",
  LANGUAGE: "language_preference",
  CHAT_SETTINGS: "chat_settings",
} as const;

// ====================== CHAT REDUCER ACTION TYPES ======================
export const CHAT_ACTION_TYPES = {
  SET_LOADING_CONVERSATIONS: "SET_LOADING_CONVERSATIONS",
  SET_CONVERSATIONS: "SET_CONVERSATIONS",
  SET_LOADING_MESSAGES: "SET_LOADING_MESSAGES",
  SET_MESSAGES: "SET_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  UPDATE_CONVERSATION_NOTIFICATION: "UPDATE_CONVERSATION_NOTIFICATION",
  SET_ACTIVE_CONVERSATION: "SET_ACTIVE_CONVERSATION",
  MARK_CONVERSATION_READ: "MARK_CONVERSATION_READ",
  PREPEND_MESSAGES: "PREPEND_MESSAGES",
  REPLACE_MESSAGE: "REPLACE_MESSAGE",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
} as const;

// Create a type for the action types
export type ChatActionType =
  (typeof CHAT_ACTION_TYPES)[keyof typeof CHAT_ACTION_TYPES];

// ====================== DEFAULT VALUES ======================
export const DEFAULTS = {
  AVATAR_URL:
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
  AVATAR_PATH: "/default-avatar.png",
  USERNAME: "Anonymous",
  ANONYMOUS_NAME: "Anonymous",
  ANONYMOUS_USERNAME: "anonymous",

  // Theme
  THEME: "light",
  LANGUAGE: "en",

  // User settings
  NOTIFICATIONS_ENABLED: true,
  EMAIL_NOTIFICATIONS: false,

  // Chat settings
  CHAT_SOUNDS: true,
  CHAT_NOTIFICATIONS: true,
} as const;

// ====================== HTTP HEADERS ======================
export const HEADERS = {
  "Content-Type": "application/json",
} as const;

export const AUTH_HEADER = (token: string) => `Bearer ${token}`;

// ====================== VALIDATION RULES ======================
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    MESSAGES: {
      MIN_LENGTH: "Username must be at least 3 characters",
      MAX_LENGTH: "Username must be at most 20 characters",
      PATTERN: "Only letters, numbers, and underscores allowed",
    },
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGES: {
      INVALID: "Invalid email address",
    },
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
    MESSAGES: {
      MIN_LENGTH: "Password must be at least 6 characters",
      MAX_LENGTH: "Password must be at most 20 characters",
      REQUIRED: "Password is required",
    },
  },
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    MESSAGES: {
      MIN_LENGTH: "Name must be at least 3 characters",
      MAX_LENGTH: "Name must be at most 30 characters",
    },
  },
  POST: {
    MAX_LENGTH: 2000,
    MIN_LENGTH: 1,
  },
  COMMENT: {
    MAX_LENGTH: 500,
    MIN_LENGTH: 1,
  },
  BIO: {
    MAX_LENGTH: 300,
  },
} as const;

// ====================== NOTIFICATION TYPES ======================
export const NOTIFICATION_TYPES = {
  LIKE: "like",
  DISLIKE: "dislike",
  COMMENT: "comment",
  FOLLOW: "follow",
} as const;

// ====================== USER ROLES ======================
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

// ====================== POST MODES ======================
export const POST_MODES = {
  FEED: "feed",
  RECOMMENDED: "recommended",
  PUBLIC: "public",
} as const;

// ====================== HTTP STATUS CODES ======================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ====================== DATABASE CONSTANTS ======================
export const DB_FIELDS = {
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  USER_ID: "user_id",
  ID: "id",
  EMAIL: "email",
  USERNAME: "username",
  PASSWORD: "password",
  AVATAR_URL: "avatar_url",
  NAME: "name",
  CONVERSATION_ID: "conversation_id",
  SENDER_ID: "sender_id",
  CONTENT: "content",
  CONTENT_TEXT: "contentText",
  MEDIA_URL: "media_url",
  MEDIA_TYPE: "media_type",
  LAST_READ_AT: "last_read_at",
  RECIPIENT: "recipient",
  TYPE: "type",
  READ: "read",
} as const;

export const TABLE_NAMES = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
  LIKES: "likes",
  DISLIKES: "dislikes",
  FOLLOWS: "follows",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  PARTICIPANTS: "participants",
  NOTIFICATIONS: "notifications",
  CATEGORIES: "categories",
  USER_ACTIVITY_LOGS: "user_activity_logs",
} as const;

// ====================== PATTERNS & FILE TYPES ======================
export const PATTERNS = {
  BEARER_REGEX: /^Bearer\s+/,
  UUID_REGEX:
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  SUPPORTED_IMAGE_FORMATS: ["jpg", "jpeg", "png", "gif", "webp"],
  SUPPORTED_VIDEO_FORMATS: ["mp4", "mov", "avi", "webm"],
} as const;

// ====================== BACKWARD COMPATIBILITY ======================
// Export individual sections for easy migration and backward compatibility

// Legacy exports from existing constants files
export const TOKEN_KEY = STORAGE_KEYS.TOKEN;
export const BASE_URL = API.BASE_URL;
export const SOCKET_URL = ENV.SOCKET_URL;
export const NOTIFICATION_API_BASE_URL = ENV.NOTIFICATION_API_BASE_URL;
export const CHAT_API_BASE_URL = API.CHAT.BASE_URL;

// Legacy API exports
export const AUTH_API = API.AUTH;
export const POST_API = API.POSTS;
export const USER_API = API.USERS;
export const CHAT_API = API.CHAT;
export const COMMENT_API = API.COMMENTS;
export const NOTIFICATION_API = API.NOTIFICATIONS;

// Legacy socket events
export const socketEvents = SOCKET_EVENTS;
export const chatEndpoints = {
  conversations: API.CHAT.CONVERSATIONS,
  messages: API.CHAT.MESSAGES,
  markRead: API.CHAT.MARK_READ,
};

// Legacy UI strings
export const CHAT_UI_STRINGS = {
  MESSAGE_INPUT_PLACEHOLDER: PLACEHOLDERS.MESSAGE_INPUT,
  NO_MESSAGES_YET: MESSAGES.EMPTY.NO_MESSAGES,
  SELECT_CONVERSATION_PROMPT: CONTENT.CHAT.SELECT_CONVERSATION,
  LOADING_OLDER_MESSAGES: MESSAGES.LOADING.LOADING_MESSAGES,
  CHAT_TITLE: CONTENT.CHAT.TITLE,
  DEFAULT_AVATAR_URL: DEFAULTS.AVATAR_PATH,
  STARTING_CHAT_MESSAGE: CONTENT.CHAT.STARTING_CHAT,
};

export const CHAT_MAGIC_NUMBERS = CONFIG.SOCKET;

// Legacy error messages
export const errorMessages = {
  generic: MESSAGES.ERROR.GENERIC,
  fetchFailed: MESSAGES.ERROR.FETCH_FAILED,
  tryAgain: MESSAGES.ERROR.TRY_AGAIN,
  CHAT_FAILED_TO_CREATE_CONVERSATION:
    MESSAGES.ERROR.CHAT_CREATE_CONVERSATION_FAILED,
  CHAT_FAILED_TO_MARK_READ: MESSAGES.ERROR.CHAT_MARK_READ_FAILED,
  CHAT_NOT_CONNECTED_SEND_MESSAGE: MESSAGES.ERROR.CHAT_SEND_MESSAGE_FAILED,
  CHAT_ERROR_STARTING_CHAT: MESSAGES.ERROR.CHAT_START_ERROR,
  COMMENT_CREATION_FAILED: "Failed to create comment.",
};

// Legacy endpoints
export const authEndpoints = API.AUTH;
export const postEndpoints = {
  list: API.POSTS.LIST,
  categories: API.POSTS.CATEGORIES,
  feed: API.POSTS.FEED,
  recomended: API.POSTS.RECOMMENDED,
  like: "/posts/:postId/like",
  dislike: "/posts/:postId/dislike",
  userPosts: "/posts/user/:username",
  likers: "/posts/:id/likers",
  dislikers: "/posts/:id/dislikers",
};
export const userEndpoints = {
  search: API.USERS.SEARCH,
  suggestions: API.USERS.SUGGESTIONS,
  follow: "/users/:userId/follow",
  profile: API.USERS.PROFILE,
  profilePrivacy: API.USERS.PROFILE_PRIVACY,
  username: "/users/:username",
  usernamePosts: "/users/:username/posts",
  followers: "/users/:username/followers",
  following: "/users/:username/following",
  explore: API.USERS.EXPLORE,
};
export const notificationEndpoints = {
  list: "/notifications",
  markRead: "/notifications/read",
};
