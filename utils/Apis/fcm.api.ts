import { API } from "@/constants/index";

const API_BASE_URL = API.BASE_URL;

/**
 * Save FCM token to backend
 */
export const saveFCMToken = async (token: string): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/fcm-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (response.ok) {
      console.log("FCM token saved successfully");
      return true;
    } else {
      console.error("Failed to save FCM token:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return false;
  }
};

/**
 * Remove FCM token from backend
 */
export const removeFCMToken = async (token: string): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/fcm-token`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (response.ok) {
      console.log("FCM token removed successfully");
      return true;
    } else {
      console.error("Failed to remove FCM token:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error removing FCM token:", error);
    return false;
  }
};

/**
 * Send test notification
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/test-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      console.log("Test notification sent successfully");
      return true;
    } else {
      console.error("Failed to send test notification:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error sending test notification:", error);
    return false;
  }
};

/**
 * Get user's FCM tokens
 */
export const getFCMTokens = async (): Promise<string[]> => {
  try {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/users/fcm-tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.tokens || [];
    } else {
      console.error("Failed to get FCM tokens:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error getting FCM tokens:", error);
    return [];
  }
};
