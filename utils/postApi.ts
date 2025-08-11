import axios from "axios";
import { PostFormData } from "@/types/post.types";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const createPost = async (data: PostFormData) => {
  try {
    const response = await apiClient.post("/posts", data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast(error.message || "Failed to getfeed.");
    }
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get("/posts/categories");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch categories.");
    }
  }
};

export const getPosts = async () => {
  try {
    const response = await apiClient.get("/posts", {
      params: {
        _: new Date().getTime(),
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch post.");
    }
  }
};

export const getFeed = async () => {
  try {
    const response = await apiClient.get("/posts/feed");
    console.log("🚀 ~ getFeed ~ response:", response);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch feed.");
    }
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch likes.");
    }
  }
};

export const unlikePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to Unlike.");
    }
  }
};

export const dislikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/posts/${postId}/dislike`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to dislike.");
    }
  }
};

export const undislikePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}/dislike`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to undislike.");
    }
  }
};

export const getComments = async (postId: string) => {
  try {
    const response = await apiClient.get(`/comments/${postId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch comments.");
    }
  }
};

export const createComment = async (postId: string, content_text: string) => {
  try {
    const response = await apiClient.post(`/comments/${postId}`, {
      content_text,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to create comment.");
    }
  }
};

export const updatePost = async (
  postId: string,
  data: Partial<PostFormData>,
) => {
  try {
    const response = await apiClient.put(`/posts/${postId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update post.");
    }
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to delete post.");
    }
  }
};
