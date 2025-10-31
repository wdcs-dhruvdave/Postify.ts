"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getFCMToken,
  onMessageListener,
  onTokenRefreshListener,
} from "@/lib/firebase";
import { saveFCMToken } from "@/utils/Apis/fcm.api";
import toast from "react-hot-toast";

interface FCMNotification {
  title?: string;
  body?: string;
  image?: string;
  data?: Record<string, string>;
}

export const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<FCMNotification | null>(
    null,
  );
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>("default");

  // Initialize FCM when permission already exists
  const initializeExistingPermission = useCallback(async () => {
    try {
      setLoading(true);

      // Register service worker
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registered successfully");
      }

      // Get FCM token
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        setToken(fcmToken);
        console.log("FCM Token:", fcmToken);

        // Save token to backend
        await saveFCMToken(fcmToken);
      }
    } catch (error) {
      console.error("Error initializing FCM:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Request notification permission and initialize FCM (must be called from user gesture)
  const requestPermissionAndInitialize = useCallback(async () => {
    try {
      if (typeof window === "undefined") return false;

      setLoading(true);

      // Request permission
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        // Register service worker
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registered successfully");
        }

        // Get FCM token
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          setToken(fcmToken);
          console.log("FCM Token:", fcmToken);

          // Save token to backend
          await saveFCMToken(fcmToken);

          toast.success("Push notifications enabled!");
        }

        return true;
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check FCM support and existing permission status
  const checkSupport = useCallback(() => {
    try {
      // Check if notifications are supported
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.log("Notifications not supported");
        setIsSupported(false);
        return;
      }

      setIsSupported(true);
      setPermissionStatus(Notification.permission);

      // If already granted, initialize FCM without requesting permission again
      if (Notification.permission === "granted") {
        initializeExistingPermission();
      }
    } catch (error) {
      console.error("Error checking FCM support:", error);
      setIsSupported(false);
    }
  }, [initializeExistingPermission]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || permissionStatus !== "granted") return;

    let unsubscribeFunction: (() => void) | undefined;

    onMessageListener()
      .then((payload: unknown) => {
        console.log("Received foreground message:", payload);

        const payloadData = payload as {
          notification?: {
            title?: string;
            body?: string;
            image?: string;
          };
          data?: Record<string, string>;
        };

        const notificationData: FCMNotification = {
          title: payloadData.notification?.title,
          body: payloadData.notification?.body,
          image: payloadData.notification?.image,
          data: payloadData.data,
        };

        setNotification(notificationData);

        // Show simple toast notification
        toast.success(
          `${notificationData.title || "New Notification"}: ${notificationData.body || ""}`,
          {
            duration: 5000,
            position: "top-right",
          },
        );
      })
      .catch((error) => {
        console.error("Error listening for messages:", error);
      });

    return () => {
      if (unsubscribeFunction) {
        unsubscribeFunction();
      }
    };
  }, [isSupported, permissionStatus]);

  // Initialize support check on mount
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  return {
    token,
    notification,
    isSupported,
    loading,
    permissionStatus,
    requestPermissionAndInitialize,
    checkSupport,
  };
};
