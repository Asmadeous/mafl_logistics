"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string | null
  isRead: boolean
  createdAt: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to MAFL Logistics",
    message: "Thank you for joining our platform. We're excited to have you on board!",
    type: "success",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    title: "Complete your profile",
    message: "Add more information to your profile to help us serve you better.",
    type: "info",
    link: "/profile",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: "3",
    title: "New feature available",
    message: "Check out our new messaging system to communicate with our team.",
    type: "info",
    link: "/messages",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
]

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    // Simulate loading notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.isRead).length)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [user])

  const markAsRead = async (notificationId: string) => {
    if (!user) return false

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )

    setUnreadCount((prev) => Math.max(0, prev - 1))
    return true
  }

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return false

    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))

    setUnreadCount(0)
    return true
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  }
}
