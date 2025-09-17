import { PublicUser } from "@/types/user.type";
import axios from "axios";
import { BASE_URL, HEADERS, USER_API } from "@/constants/api";
import { TOKEN_KEY, AUTH_HEADER } from "@/constants/auth";
import { errorMessages } from "@/constants/ui";

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

const handleError = (err: unknown, defaultMessage: string): Error => {
  if (axios.isAxiosError(err)) {
    return new Error(err.response?.data?.message || defaultMessage);
  }
  return new Error(errorMessages.generic);
};

export const searchUsers = async (query: string) => {
  try {
    const response = await apiClient.get(USER_API.SEARCH, {
      params: { q: query },
    });
    return response.data;
  } catch (err) {
    throw handleError(err, "Search failed.");
  }
};

export const getFollowSuggestions = async () => {
  try {
    const response = await apiClient.get(USER_API.SUGGESTIONS);
    return response.data;
  } catch (err) {
    throw handleError(err, "Failed to get suggestions.");
  }
};

export const followUser = async (userId: string) => {
  try {
    const response = await apiClient.post(USER_API.FOLLOW(userId));
    return response.data;
  } catch (err) {
    throw handleError(err, "Failed to follow user.");
  }
};

export const unfollowUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(USER_API.UNFOLLOW(userId));
    return response.data;
  } catch (err) {
    throw handleError(err, "Failed to unfollow user.");
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await apiClient.get(USER_API.GET_BY_USERNAME(username));
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `Failed to fetch profile for user "${username}". ${errorMessages.tryAgain}`,
    );
  }
};

export const getUserPosts = async (username: string) => {
  try {
    const response = await apiClient.get(
      USER_API.GET_POSTS_BY_USERNAME(username),
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message ||
          `Unable to load posts for user "${username}". ${errorMessages.tryAgain}`,
      );
    }
    throw new Error(
      `${errorMessages.generic} while fetching user posts. ${errorMessages.tryAgain}`,
    );
  }
};

export const updateUserProfile = async (data: Partial<PublicUser>) => {
  try {
    const response = await apiClient.put(USER_API.PROFILE, data);
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `Failed to update your profile. ${errorMessages.tryAgain}`,
    );
  }
};

export const updateUserPrivacy = async (isPrivate: boolean) => {
  try {
    const response = await apiClient.put(USER_API.PROFILE_PRIVACY, {
      is_private: isPrivate,
    });
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `Failed to update your privacy settings. ${errorMessages.tryAgain}`,
    );
  }
};

export const getFollowers = async (username: string) => {
  try {
    const response = await apiClient.get(USER_API.FOLLOWERS(username));
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `Failed to fetch followers for "${username}". ${errorMessages.tryAgain}`,
    );
  }
};

export const getFollowing = async (username: string) => {
  try {
    const response = await apiClient.get(USER_API.FOLLOWING(username));
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `Failed to fetch following list for "${username}". ${errorMessages.tryAgain}`,
    );
  }
};

export const getRandomUsers = async () => {
  try {
    const response = await apiClient.get(USER_API.EXPLORE);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        error.message ||
          `${errorMessages.fetchFailed} suggested users. ${errorMessages.tryAgain}`,
      );
    }
    throw new Error(`${errorMessages.generic} while fetching suggested users.`);
  }
};
