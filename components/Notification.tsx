"use client";

import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationsAsRead,
} from "@/utils/notificationApi";
import { PublicUser } from "@/types/user.type";

interface NotificationSender {
  username: string;
}

interface Notification {
  _id: string;
  recipient: string;
  sender: NotificationSender;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationListProps {
  currentuser: PublicUser | null;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  currentuser,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    onUnreadCountChange?.(count);
  }, [notifications, onUnreadCountChange]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadNotifications();
  }, [currentuser]);

  const handleMarkAllAsRead = async () => {
    await markNotificationsAsRead();
    loadNotifications();
  };

  const renderMessage = (notification: Notification) => {
    switch (notification.type) {
      case "follow":
        return `${notification.sender.username} started following you At`;
      case "like":
        return `${notification.sender.username} liked your post At`;
      case "dislike":
        return `${notification.sender.username} disliked your post At`;
      case "comment":
        return `${notification.sender.username} commented on your post At`;
      default:
        return "You have a new notification";
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow w-80">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <ul className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-2 border-b last:border-b-0 ${!n.read ? "bg-blue-50" : ""}`}
            >
              <p className={!n.read ? "font-semibold" : ""}>
                {renderMessage(n)}
              </p>
              {mounted && (
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
