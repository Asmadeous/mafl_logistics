"use client"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { useAuth } from "@/hooks/use-auth"

interface NotificationDropdownProps {
  iconClassName?: string
  triggerClassName?: string
}

export function NotificationDropdown({ iconClassName = "", triggerClassName = "" }: NotificationDropdownProps) {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${triggerClassName}`}>
          <Bell className={iconClassName} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-mafl-orange text-white rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${!notification.isRead ? "bg-muted/20" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          )}
        </div>
        <div className="p-2 text-center">
          <Link href="/notifications" className="text-xs text-primary hover:underline">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
