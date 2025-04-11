"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotifications, type Notification } from "@/hooks/use-notifications"
import { useAuth } from "@/hooks/use-auth"
import { BellOff, Bell } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "all" ? notifications : notifications.filter((n) => !n.isRead)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Loading...</div>
      </div>
    )
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if needed
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    // Navigate if has link
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>
            Unread
          </Button>
          {notifications.some((n) => !n.isRead) && (
            <Button variant="outline" onClick={() => markAllAsRead()}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            {filter === "all"
              ? `Showing all notifications (${notifications.length})`
              : `Showing unread notifications (${filteredNotifications.length})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-4 border rounded-lg hover:bg-muted transition-colors",
                    !notification.isRead && "bg-muted/50",
                    notification.link && "cursor-pointer",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(notification.createdAt), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-sm text-primary mt-2 inline-block hover:underline"
                        >
                          View details
                        </Link>
                      )}
                    </div>
                    {!notification.isRead && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary"></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "You don't have any notifications yet."
                  : "You don't have any unread notifications."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const getIconClass = () => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300"
      case "error":
        return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
      default:
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
    }
  }

  return (
    <div className={cn("rounded-full p-2 flex-shrink-0", getIconClass())}>
      <Bell className="h-5 w-5" />
    </div>
  )
}
