"use client"

import { useState, useEffect, useCallback } from "react"
import { getConsumer } from "@/lib/actioncable"
import api from "@/lib/api"

// Define the notification type
export type Notification = {
  id: string
  message: string
  title: string
  type: "info" | "success" | "warning" | "error"
  category: "blog" | "message" | "appointment" | "career" | "general"
  created_at: string
  read: boolean
  link?: string
}

export function useNotificationChannel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [currentSound, setCurrentSound] = useState<"blog" | "message" | "appointment" | "career" | "general" | null>(
    null,
  )

  // Load notifications
  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        // Use the API module to fetch notifications
        const response = await api.notifications.getAll()

        if (response.error) {
          throw new Error(response.error)
        }

        setNotifications(response.data?.notifications || [])
        setUnreadCount(response.data?.notifications?.filter((n: Notification) => !n.read).length || 0)
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Subscribe to the notification channel
  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const userId = localStorage.getItem("userId")
    const guestToken = localStorage.getItem("guestToken")

    if (!userType && !guestToken) return

    const consumer = getConsumer()

    const channelParams = guestToken
      ? { channel: "NotificationsChannel", guest_token: guestToken }
      : { channel: "NotificationsChannel" }

    const newSubscription = consumer.subscriptions.create(channelParams, {
      connected() {
        console.log("Connected to notifications channel")
      },
      disconnected() {
        console.log("Disconnected from notifications channel")
      },
      received(data: any) {
        console.log("Received notification:", data)
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Play notification sound based on category
          const category = data.notification.category || "general"
          setCurrentSound(category)
        }
      },
    })

    setSubscription(newSubscription)

    // Cleanup subscription on unmount
    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe()
      }
    }
  }, [])

  // Handle sound ended
  const handleSoundEnded = useCallback(() => {
    setCurrentSound(null)
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Use the API module to mark notification as read
      const response = await api.notifications.markAsRead(id)

      if (response.error) {
        throw new Error(response.error)
      }

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Use the API module to mark all notifications as read
      const response = await api.notifications.markAllAsRead()

      if (response.error) {
        throw new Error(response.error)
      }

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }, [])

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    unreadCount,
    currentSound,
    handleSoundEnded,
  }
}
