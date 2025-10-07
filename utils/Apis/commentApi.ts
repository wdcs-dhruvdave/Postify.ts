import axios from "axios";
import { Comment } from "@/types/comment.type";
import {
  BASE_URL,
  HEADERS,
  COMMENT_API,
  TOKEN_KEY,
  AUTH_HEADER,
  errorMessages,
} from "@/constants/index";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = AUTH_HEADER(token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await apiClient.get(COMMENT_API.BY_POST(postId));
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || `${errorMessages.fetchFailed} comments.`,
      );
    } else {
      throw new Error(`${errorMessages.fetchFailed} comments.`);
    }
  }
};

export const createComment = async (
  postId: string,
  content_text: string,
  parentId?: string | null,
): Promise<Comment> => {
  try {
    const response = await apiClient.post(COMMENT_API.BY_POST(postId), {
      content_text,
      parent_id: parentId,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || errorMessages.COMMENT_CREATION_FAILED);
    } else {
      throw new Error(errorMessages.COMMENT_CREATION_FAILED);
    }
  }
};
