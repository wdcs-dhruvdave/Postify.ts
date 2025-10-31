"use client";

import React, { useEffect } from "react";
import { useFCM } from "@/utils/hooks/useFCM";
import { motion, AnimatePresence } from "framer-motion";

interface FCMProviderProps {
  children: React.ReactNode;
}

export const FCMProvider: React.FC<FCMProviderProps> = ({ children }) => {
  const { token } = useFCM();

  useEffect(() => {
    if (token) {
      console.log("FCM initialized with token:", token);
    }
  }, [token]);

  return (
    <>
      {children}
      <FCMPermissionRequest />
    </>
  );
};

const FCMPermissionRequest: React.FC = () => {
  const { isSupported, permissionStatus, requestPermissionAndInitialize } =
    useFCM();
  const [showRequest, setShowRequest] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  useEffect(() => {
    // Check if we should show the permission request
    const checkPermission = () => {
      if (!isSupported || dismissed) return;

      const hasRequestedBefore = localStorage.getItem(
        "fcm-permission-requested",
      );

      if (permissionStatus === "default" && !hasRequestedBefore) {
        setTimeout(() => setShowRequest(true), 3000); // Show after 3 seconds to avoid immediate popup
      }
    };

    checkPermission();
  }, [isSupported, permissionStatus, dismissed]);

  const handleAllow = async () => {
    await requestPermissionAndInitialize();
    localStorage.setItem("fcm-permission-requested", "true");
    setShowRequest(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("fcm-permission-requested", "true");
    setShowRequest(false);
    setDismissed(true);
  };

  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {showRequest && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Enable Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get notified about new posts, comments, and interactions on
                  Postify.
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleAllow}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Allow
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
