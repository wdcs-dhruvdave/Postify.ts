import { PublicUser } from "@/types/user.type";
import axios from "axios";
import {
  BASE_URL,
  HEADERS,
  USER_API,
  TOKEN_KEY,
  AUTH_HEADER,
  errorMessages,
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
    throw handleError(err, MESSAGES.ERROR.USER_SUGGESTIONS_FAILED);
  }
};

export const followUser = async (userId: string) => {
  try {
    const response = await apiClient.post(USER_API.FOLLOW(userId));
    return response.data;
  } catch (err) {
    throw handleError(err, MESSAGES.ERROR.USER_FOLLOW_FAILED);
  }
};

export const unfollowUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(USER_API.UNFOLLOW(userId));
    return response.data;
  } catch (err) {
    throw handleError(err, MESSAGES.ERROR.USER_UNFOLLOW_FAILED);
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await apiClient.get(USER_API.BY_USERNAME(username));
    return response.data;
  } catch (err) {
    throw handleError(
      err,
      `${MESSAGES.ERROR.USER_PROFILE_FETCH_FAILED} "${username}". ${errorMessages.tryAgain}`,
    );
  }
};

export const getUserPosts = async (username: string) => {
  try {
    const response = await apiClient.get(USER_API.POSTS_BY_USERNAME(username));
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
      `${MESSAGES.ERROR.USER_PROFILE_UPDATE_FAILED} ${errorMessages.tryAgain}`,
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
      `${MESSAGES.ERROR.USER_PRIVACY_UPDATE_FAILED} ${errorMessages.tryAgain}`,
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
      `${MESSAGES.ERROR.USER_FOLLOWERS_FETCH_FAILED} "${username}". ${errorMessages.tryAgain}`,
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
      `${MESSAGES.ERROR.USER_FOLLOWING_FETCH_FAILED} "${username}". ${errorMessages.tryAgain}`,
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
