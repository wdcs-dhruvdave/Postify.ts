"use client";

import { FCMSettings } from "@/components/FCMSettings";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Notification Settings
          </h1>

          <div className="space-y-6">
            <FCMSettings />

            {/* Additional notification settings can go here */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Other Notification Preferences
              </h2>
              <p className="text-gray-600">
                More notification settings coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
