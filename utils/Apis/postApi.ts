import axios from "axios";
import { PostFormData } from "@/types/post.types";
import {
  BASE_URL,
  HEADERS,
  POST_API,
  TOKEN_KEY,
  AUTH_HEADER,
  MESSAGES,
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

export const createPost = async (data: PostFormData) => {
  try {
    const response = await apiClient.post(POST_API.CREATE, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_CREATION_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_CREATION_UNEXPECTED);
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get(POST_API.CATEGORIES);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.CATEGORIES_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.CATEGORIES_FETCH_UNEXPECTED);
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await apiClient.get(POST_API.CATEGORY(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.CATEGORY_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.CATEGORY_FETCH_UNEXPECTED);
  }
};

export const getPosts = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiClient.get(POST_API.LIST, {
      params: { page, limit, _: new Date().getTime() },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POSTS_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POSTS_FETCH_UNEXPECTED);
  }
};

export const getFeed = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(POST_API.FEED, {
      params: { page, limit },
    });
    const postsWithCategories = await Promise.all(
      response.data.posts.map(async (post) => {
        const category = await getCategory(post.category_id);
        return { ...post, category };
      }),
    );
    response.data.posts = postsWithCategories || [];
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.FEED_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.FEED_FETCH_UNEXPECTED);
  }
};

export const getRecommendedPosts = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(POST_API.RECOMMENDED, {
      params: { page, limit },
    });

    const postsWithCategories = await Promise.all(
      response.data.posts.map(async (post) => {
        const category = await getCategory(post.category_id);
        return { ...post, category };
      }),
    );

    return {
      posts: postsWithCategories || [],
      pagination: response.data.pagination || { hasNextPage: false },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          MESSAGES.ERROR.RECOMMENDED_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.RECOMMENDED_FETCH_UNEXPECTED);
  }
};

export const likePost = async (id: string) => {
  try {
    const response = await apiClient.post(POST_API.LIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_LIKE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_LIKE_UNEXPECTED);
  }
};

export const unlikePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.LIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_UNLIKE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_UNLIKE_UNEXPECTED);
  }
};

export const dislikePost = async (id: string) => {
  try {
    const response = await apiClient.post(POST_API.DISLIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_DISLIKE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_DISLIKE_UNEXPECTED);
  }
};

export const undislikePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.DISLIKE(id));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_UNDISLIKE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_UNDISLIKE_UNEXPECTED);
  }
};

export const updatePost = async (id: string, data: Partial<PostFormData>) => {
  try {
    const response = await apiClient.put(POST_API.UPDATE(id), data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_UPDATE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_UPDATE_UNEXPECTED);
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await apiClient.delete(POST_API.DELETE(id));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.POST_DELETE_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.POST_DELETE_UNEXPECTED);
  }
};

export const getPostLikers = async (id: string) => {
  try {
    const res = await apiClient.get(POST_API.LIKERS(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.LIKERS_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.LIKERS_FETCH_UNEXPECTED);
  }
};

export const getPostDislikes = async (id: string) => {
  try {
    const res = await apiClient.get(POST_API.DISLIKERS(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || MESSAGES.ERROR.DISLIKERS_FETCH_FAILED,
      );
    }
    throw new Error(MESSAGES.ERROR.DISLIKERS_FETCH_UNEXPECTED);
  }
};
