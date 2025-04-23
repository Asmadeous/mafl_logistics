"use client";

import { useState, useEffect } from "react";
import getConsumer from "../lib/action-cable";
import { useAuth } from "./use-auth";

export interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  notifiableType: "Message" | "BlogPost" | "Other" | null;
  notifiableId?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Fetch JWT token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("jwt_token");
      console.log("useNotifications: JWT token:", storedToken ? "present" : "missing");
      setToken(storedToken);
    }
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!token || !user) {
      console.log("useNotifications: Skipping fetch, token or user missing", { token: !!token, user: !!user });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      
      const data = await response.json();
      const mappedNotifications: Notification[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || "Notification",
        message: item.message || "",
        link: item.link || null,
        read: !!item.read,
        createdAt: item.created_at || new Date().toISOString(),
        notifiableType: item.notifiable_type || null,
        notifiableId: item.notifiable_id || undefined,
      }));
      
      setNotifications(mappedNotifications);
      setUnreadCount(mappedNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (token && user) {
      console.log("useNotifications: Fetching notifications for user:", user);
      fetchNotifications();
    }
  }, [token, user]);

  // Action Cable subscription
  useEffect(() => {
    if (!token || !user || !user.id) {
      console.log("useNotifications: Skipping Action Cable, missing data", { token: !!token, user: !!user?.id });
      return;
    }
    
    // Ensure we have the correct user type formatting
    const userType = user.type ? user.type.toLowerCase() : (user.role ? user.role.toLowerCase() : "user");
    
    console.log("useNotifications: Setting up Action Cable for user:", { id: user.id, type: userType });
    const consumer = getConsumer(token);
    
    const subscription = consumer.subscriptions.create(
      {
        channel: "NotificationsChannel",
        user_id: user.id,
        user_type: userType,
      },
      {
        connected: () => console.log("NotificationsChannel connected"),
        disconnected: () => console.log("NotificationsChannel disconnected"),
        received: (data: any) => {
          console.log("NotificationsChannel received:", data);
          if (data.type === "notification" && data.notification) {
            const newNotification: Notification = {
              id: data.notification.id,
              title: data.notification.title || "Notification",
              message: data.notification.message || "",
              link: data.notification.link || null,
              read: !!data.notification.read,
              createdAt: data.notification.created_at || new Date().toISOString(),
              notifiableType: data.notification.notifiable_type || null,
              notifiableId: data.notification.notifiable_id || undefined,
            };
            
            setNotifications((prev) => {
              // Avoid duplicates by checking if the notification already exists
              if (prev.some((n) => n.id === newNotification.id)) {
                return prev;
              }
              // Add the new notification at the beginning for chronological order
              return [newNotification, ...prev];
            });
            
            if (!newNotification.read) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        },
        rejected: () => console.error("NotificationsChannel subscription rejected"),
      },
    );
    
    return () => {
      console.log("useNotifications: Cleaning up Action Cable subscription");
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [token, user]);

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/notifications/mark_all_read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.status}`);
      }
      
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Function to refresh notifications
  const refreshNotifications = () => {
    if (token && user) {
      fetchNotifications();
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, loading, refreshNotifications };
}