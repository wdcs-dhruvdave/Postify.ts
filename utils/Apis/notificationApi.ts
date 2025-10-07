import axios from "axios";
import toast from "react-hot-toast";
import {
  NOTIFICATION_API_BASE_URL,
  HEADERS,
  NOTIFICATION_API,
  TOKEN_KEY,
  AUTH_HEADER,
  errorMessages,
  MESSAGES,
} from "@/constants/index";

const apiClient = axios.create({
  baseURL: NOTIFICATION_API_BASE_URL,
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

export const fetchNotifications = async () => {
  try {
    const response = await apiClient.get(
      `/notifications${NOTIFICATION_API.LIST}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast(error.message || `${errorMessages.fetchFailed} notifications.`);
    }
    return [];
  }
};

export const markNotificationsAsRead = async () => {
  try {
    const response = await apiClient.post(
      `/notifications${NOTIFICATION_API.MARK_READ}`,
    );
    console.log("Notifications marked as read successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast(error.message || MESSAGES.ERROR.NOTIFICATIONS_MARK_READ_FAILED);
    }
  }
};
