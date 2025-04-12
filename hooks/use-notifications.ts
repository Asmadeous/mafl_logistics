"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getSupabaseClient } from "@/lib/supabase-client"

export type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  link?: string | null
  isRead: boolean
  createdAt: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("user_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) throw error

        const formattedNotifications = data.map((notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type || "info",
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

    // Set up realtime subscription
    const subscription = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type || "info",
            link: payload.new.link,
            isRead: payload.new.is_read,
            createdAt: payload.new.created_at,
          }
          setNotifications((prev) => [newNotification, ...prev])
          if (!newNotification.isRead) {
            setUnreadCount((prev) => prev + 1)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === payload.new.id
                ? {
                    ...notification,
                    title: payload.new.title,
                    message: payload.new.message,
                    type: payload.new.type || "info",
                    link: payload.new.link,
                    isRead: payload.new.is_read,
                  }
                : notification,
            ),
          )
          // Recalculate unread count
          setNotifications((current) => {
            setUnreadCount(current.filter((n) => !n.isRead).length)
            return current
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, supabase])

  const markAsRead = async (notificationId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase.from("user_notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))

      return true
    } catch (error) {
      console.error("Error marking notification as read:", error)
      return false
    }
  }

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return false

    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )
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
