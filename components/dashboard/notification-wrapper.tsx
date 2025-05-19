"use client"

import type React from "react"

import { useEffect } from "react"
import { useNotificationChannel } from "@/hooks/use-notification-channel"
import NotificationPlayer from "@/components/notification-player"
import { useToast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const { notifications, unreadCount, currentSound, handleSoundEnded, markAsRead } = useNotificationChannel()
  const { toast } = useToast()
  const router = useRouter()

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]

      // Only show toast for unread notifications
      if (!latestNotification.read) {
        toast({
          title: latestNotification.title,
          description: latestNotification.message,
          action: latestNotification.link
            ? {
                label: "View",
                onClick: () => {
                  markAsRead(latestNotification.id)
                  router.push(latestNotification.link || "#")
                },
              }
            : undefined,
          icon: <Bell className="h-4 w-4" />,
        })

        // Mark as read after showing toast
        setTimeout(() => {
          markAsRead(latestNotification.id)
        }, 5000)
      }
    }
  }, [notifications, markAsRead, toast, router])

  return (
    <>
      {children}
      {/* Notification sound player */}
      {currentSound && <NotificationPlayer type={currentSound} play={true} onEnded={handleSoundEnded} />}
    </>
  )
}

export default NotificationWrapper
