"use client";

import { useState } from "react";
import { useFCM } from "@/utils/hooks/useFCM";
import { sendTestNotification, getFCMTokens } from "@/utils/Apis/fcm.api";
import toast from "react-hot-toast";

export const FCMSettings: React.FC = () => {
  const {
    token,
    isSupported,
    loading,
    permissionStatus,
    requestPermissionAndInitialize,
  } = useFCM();
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [tokenCount, setTokenCount] = useState<number>(0);

  const handleEnableNotifications = async () => {
    try {
      await requestPermissionAndInitialize();
      // Toast messages are handled in the hook
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications");
    }
  };

  const handleSendTest = async () => {
    try {
      setIsSendingTest(true);
      const success = await sendTestNotification();
      if (success) {
        toast.success("Test notification sent!");
      } else {
        toast.error("Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleGetTokenCount = async () => {
    try {
      const tokens = await getFCMTokens();
      setTokenCount(tokens.length);
      toast.success(`You have ${tokens.length} registered device(s)`);
    } catch (error) {
      console.error("Error getting token count:", error);
      toast.error("Failed to get token count");
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Notifications Not Supported
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Your browser doesn&apos;t support push notifications or
              you&apos;re browsing in incognito mode.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            Initializing notifications...
          </span>
        </div>
      </div>
    );
  }

  const hasNotificationPermission = permissionStatus === "granted";
  const hasToken = !!token;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Push Notifications
        </h3>

        <div className="space-y-4">
          {/* Permission Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Notification Permission
              </p>
              <p className="text-xs text-gray-500">
                Allow Postify to send you push notifications
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hasNotificationPermission
                    ? "bg-green-100 text-green-800"
                    : permissionStatus === "denied"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {hasNotificationPermission
                  ? "Enabled"
                  : permissionStatus === "denied"
                    ? "Denied"
                    : "Not Asked"}
              </span>
              {!hasNotificationPermission && (
                <button
                  onClick={handleEnableNotifications}
                  disabled={loading}
                  className="ml-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                      Enabling...
                    </>
                  ) : (
                    "Enable Notifications"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* FCM Token Status */}
          {hasNotificationPermission && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Device Registration
                </p>
                <p className="text-xs text-gray-500">
                  Your device is registered to receive notifications
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    hasToken
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {hasToken ? "Registered" : "Registering..."}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          {hasToken && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Test Notification"
                )}
              </button>

              <button
                onClick={handleGetTokenCount}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Check Devices ({tokenCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === "development" && hasToken && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h4>
          <div className="text-xs text-gray-600 break-all">
            <p>
              <strong>FCM Token:</strong> {token}
            </p>
            <p>
              <strong>Permission:</strong> {permissionStatus}
            </p>
            <p>
              <strong>Supported:</strong> {isSupported ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
