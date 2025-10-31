import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: Messaging | null = null;

const initializeMessaging = async (): Promise<Messaging | null> => {
  try {
    const supported = await isSupported();
    if (supported && typeof window !== "undefined") {
      messaging = getMessaging(app);
      return messaging;
    }
    return null;
  } catch (error) {
    console.error("Failed to initialize Firebase Messaging:", error);
    return null;
  }
};

// Get FCM token
export const getFCMToken = async (
  forceRefresh: boolean = false,
): Promise<string | null> => {
  try {
    if (!messaging) {
      await initializeMessaging();
    }

    if (!messaging) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("VAPID key not found in environment variables");
      return null;
    }

    // Force refresh token if requested
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: forceRefresh
        ? undefined
        : await navigator.serviceWorker.getRegistration(),
    });

    return token;
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
};

// Refresh FCM token
export const refreshFCMToken = async (): Promise<string | null> => {
  console.log("Refreshing FCM token...");
  return getFCMToken(true);
};

// Listen for foreground messages
export const onMessageListener = (): Promise<unknown> => {
  return new Promise((resolve) => {
    if (!messaging) {
      initializeMessaging().then(() => {
        if (messaging) {
          onMessage(messaging, (payload) => {
            resolve(payload);
          });
        }
      });
    } else {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
};

// Listen for token refresh
export const onTokenRefreshListener = (
  callback: (token: string) => void,
): (() => void) | null => {
  if (!messaging) {
    console.warn("Messaging not initialized for token refresh listener");
    return null;
  }

  return onTokenRefresh(messaging, async () => {
    try {
      const newToken = await getFCMToken();
      if (newToken) {
        console.log("FCM token refreshed:", newToken);
        callback(newToken);
      }
    } catch (error) {
      console.error("Error refreshing FCM token:", error);
    }
  });
};

export { app, messaging };
function onTokenRefresh(
  messaging: Messaging,
  handler: () => Promise<void>,
): (() => void) | null {
  if (
    !messaging ||
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    console.warn(
      "onTokenRefresh: environment does not support token refresh polling",
    );
    return null;
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn(
      "onTokenRefresh: VAPID key not found in environment variables",
    );
    return null;
  }

  let currentToken: string | null = null;
  let intervalId: number | null = null;
  const checkIntervalMs = 60_000; // check every minute

  const getRegistration = async () => {
    try {
      return await navigator.serviceWorker.getRegistration();
    } catch {
      return undefined;
    }
  };

  const init = async () => {
    try {
      const reg = await getRegistration();
      currentToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: reg,
      });
    } catch (err) {
      // ignore initial errors, we'll retry on interval
      currentToken = null;
    }

    const check = async () => {
      try {
        const reg = await getRegistration();
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: reg,
        });
        if (token && token !== currentToken) {
          currentToken = token;
          await handler();
        }
      } catch (err) {
        // non-fatal; just log and continue polling
        // console.warn('onTokenRefresh: token check failed', err);
      }
    };

    // start periodic checks
    intervalId = window.setInterval(
      check,
      checkIntervalMs,
    ) as unknown as number;
  };

  // fire-and-forget initialization
  void init();

  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
