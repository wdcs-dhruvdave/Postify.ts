import axios from "axios";

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

export const searchUsers = async (query: string) => {
  try {
    const response = await apiClient.get("/users/search", {
      params: { q: query },
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Search failed.");
    }
    throw new Error("An unexpected error occurred during search.");
  }
};

export const getFollowSuggestions = async () => {
  try {
    const response = await apiClient.get("/users/suggestions");
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to get suggestions.",
      );
    }
    throw new Error("An unexpected error occurred while fetching suggestions.");
  }
};

export const followUser = async (userId: string) => {
  try {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to follow user.");
    }
    throw new Error("An unexpected error occurred while following the user.");
  }
};

export const unfollowUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/users/${userId}/follow`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to unfollow user.",
      );
    }
    throw new Error("An unexpected error occurred while unfollowing the user.");
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/${username}`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch user profile.",
      );
    }
    throw new Error("An unexpected error occurred while fetching profile.");
  }
};

export const getUserPosts = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/${username}/posts`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch user posts.",
      );
    }
    throw new Error("An unexpected error occurred while fetching posts.");
  }
};

type ProfileFormData = {
  name?: string;
  bio?: string;
  avatar_url?: string;
};
export const updateUserProfile = async (data: ProfileFormData) => {
  try {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update profile.");
    }
  }
};

export const updateUserPrivacy = async (isPrivate: boolean) => {
  try {
    const response = await apiClient.put("/users/profile/privacy", {
      is_private: isPrivate,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to update privacy settings.");
    }
  }
};

export const getFollowers = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/${username}/followers`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch followers.");
    }
  }
};

export const getFollowing = async (username: string) => {
  try {
    const response = await apiClient.get(`/users/${username}/following`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch following list.");
    }
  }
};
export const getRandomUsers = async () => {
  try {
    const response = await apiClient.get("/users/explore/suggestions");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch users.");
    }
  }
};
