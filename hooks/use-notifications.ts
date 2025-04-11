"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    async function fetchNotifications() {
      try {
        setLoading(true)
        const response = await fetch("/api/notifications")

        if (!response.ok) {
          throw new Error(`Error fetching notifications: ${response.statusText}`)
        }

        const data = await response.json()
        setNotifications(data.notifications || [])
      } catch (err: any) {
        console.error("Error fetching notifications:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    link?: string,
  ) => {
    if (!user) {
      throw new Error("You must be logged in to create notifications")
    }

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          message,
          type,
          link,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error creating notification: ${response.statusText}`)
      }

      const data = await response.json()

      // Update local notifications state if the notification is for the current user
      if (userId === user.id) {
        setNotifications((prev) => [data.notification, ...prev])
      }

      return data.notification
    } catch (err: any) {
      console.error("Error creating notification:", err)
      throw err
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (!user) return false

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Error marking notification as read: ${response.statusText}`)
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )

      return true
    } catch (err) {
      console.error("Error marking notification as read:", err)
      return false
    }
  }

  const getUnreadCount = () => {
    if (!notifications.length) return 0
    return notifications.filter((notif) => !notif.is_read).length
  }

  return {
    notifications,
    loading,
    error,
    createNotification,
    markAsRead,
    getUnreadCount,
  }
}
