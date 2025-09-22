import axios from "axios";
import { PostFormData } from "@/types/post.types";
import { BASE_URL, HEADERS, POST_API } from "@/constants/api";
import { TOKEN_KEY, AUTH_HEADER } from "@/constants/auth";

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

export const createPost = async (data: PostFormData) => {
  try {
    const response = await apiClient.post(POST_API.CREATE_POST, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while creating the post. Please try again.",
    );
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get(POST_API.CATEGORIES);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch categories. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching categories. Please try again.",
    );
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await apiClient.get(POST_API.CATEGORY(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch category. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching category. Please try again.",
    );
  }
};

export const getPosts = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(POST_API.GET_POSTS, {
      params: { page, limit, _: new Date().getTime() },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch posts. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching posts. Please try again.",
    );
  }
};

export const getFeed = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(POST_API.FEED, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch feed. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching the feed. Please try again.",
    );
  }
};

export const likePost = async (id: string) => {
  try {
    const response = await apiClient.post(POST_API.LIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to like the post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while liking the post. Please try again.",
    );
  }
};

export const unlikePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.UNLIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to unlike the post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while unliking the post. Please try again.",
    );
  }
};

export const dislikePost = async (id: string) => {
  try {
    const response = await apiClient.post(POST_API.DISLIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to dislike the post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while disliking the post. Please try again.",
    );
  }
};

export const undislikePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.UNDISLIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to remove dislike. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while removing dislike. Please try again.",
    );
  }
};

export const updatePost = async (id: string, data: Partial<PostFormData>) => {
  try {
    const response = await apiClient.put(POST_API.UPDATE_POST(id), data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update the post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while updating the post. Please try again.",
    );
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.DELETE_POST(id));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete the post. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while deleting the post. Please try again.",
    );
  }
};

export const getPostLikers = async (id: string) => {
  try {
    const res = await apiClient.get(POST_API.GET_LIKERS(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch likers. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching likers. Please try again.",
    );
  }
};

export const getPostDislikes = async (id: string) => {
  try {
    const res = await apiClient.get(POST_API.GET_DISLIKERS(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch dislikers. Please try again later.",
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching dislikers. Please try again.",
    );
  }
};
