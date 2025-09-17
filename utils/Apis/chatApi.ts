import axios from "axios";
import { Conversation, Message } from "@/types/chat.types";
import { CHAT_API_BASE_URL, HEADERS, CHAT_API } from "@/constants/api";
import { TOKEN_KEY, AUTH_HEADER } from "@/constants/auth";
import { CHAT_MAGIC_NUMBERS } from "@/constants/chat";
import { errorMessages } from "@/constants/ui";

const chatApiClient = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: HEADERS,
});

chatApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = AUTH_HEADER(token);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await chatApiClient.get(CHAT_API.CONVERSATIONS);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message ||
          `${errorMessages.fetchFailed} conversations.`,
      );
    }
    throw new Error(`${errorMessages.generic} while fetching conversations.`);
  }
};

export const createConversation = async (
  receiverId: string,
): Promise<{ conversationId: string } | undefined> => {
  try {
    const response = await chatApiClient.post(CHAT_API.CONVERSATIONS, {
      receiverId,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message ||
          errorMessages.CHAT_FAILED_TO_CREATE_CONVERSATION,
      );
    }
    return undefined;
  }
};

export const getMessages = async (
  conversationId: string,
  pageNum: number = CHAT_MAGIC_NUMBERS.DEFAULT_PAGE_NUM,
  limit: number = CHAT_MAGIC_NUMBERS.DEFAULT_MESSAGE_LIMIT,
): Promise<Message[]> => {
  try {
    const response = await chatApiClient.get(
      CHAT_API.MESSAGES(conversationId) + `?page=${pageNum}&limit=${limit}`,
    );
    console.log("🚀 ~ getMessages ~ response:", response);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || `${errorMessages.fetchFailed} messages.`,
      );
    }
    throw new Error(`${errorMessages.generic} while fetching messages.`);
  }
};

export const markConversationAsRead = async (
  conversationId: string,
): Promise<void> => {
  try {
    await chatApiClient.post(CHAT_API.MARK_READ(conversationId));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || errorMessages.CHAT_FAILED_TO_MARK_READ,
      );
    }
    throw new Error(
      `${errorMessages.generic} while marking conversation as read.`,
    );
  }
};

export const sendMessage = async (conversationId: string, content: string) => {
  try {
    const response = await fetch(
      `/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return await response.json();
  } catch (error) {
    console.error("[sendMessage] Error:", error);
    throw error;
  }
};
