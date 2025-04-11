"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { toast } from "./use-toast"
import { getSupabaseClient } from "@/lib/supabase-client"

export type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string
  isRead: boolean
  createdAt: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  // Fetch notifications and subscribe to new ones
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("user_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        const formattedNotifications = data.map((notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type as "info" | "success" | "warning" | "error",
          link: notification.link,
          isRead: notification.is_read,
          createdAt: notification.created_at,
        }))

        setNotifications(formattedNotifications)
        setUnreadCount(formattedNotifications.filter((n) => !n.isRead).length)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to new notifications
    const notificationSubscription = supabase
      .channel("user_notifications_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type as "info" | "success" | "warning" | "error",
            link: payload.new.link,
            isRead: payload.new.is_read,
            createdAt: payload.new.created_at,
          }

          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === "error" ? "destructive" : "default",
          })
        },
      )
      .subscribe()

    // Subscribe to notification updates (mark as read)
    const notificationUpdateSubscription = supabase
      .channel("user_notifications_updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === payload.new.id
                ? {
                    ...notification,
                    isRead: payload.new.is_read,
                  }
                : notification,
            ),
          )

          // Update unread count
          setUnreadCount((prev) => {
            if (payload.old.is_read === false && payload.new.is_read === true) {
              return prev - 1
            }
            return prev
          })
        },
      )
      .subscribe()

    return () => {
      notificationSubscription.unsubscribe()
      notificationUpdateSubscription.unsubscribe()
    }
  }, [user, supabase])

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase.rpc("mark_notification_read", { notification_id: notificationId })

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error marking notification as read:", error)
      return false
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)

      return true
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  }
}
