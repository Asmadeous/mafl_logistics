"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotificationDropdownProps {
  iconClassName?: string
  triggerClassName?: string
}

export function NotificationDropdown({ iconClassName = "", triggerClassName = "" }: NotificationDropdownProps) {
  // This would be replaced with real data from your notifications hook
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Your order has been shipped",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: 'New blog post: "Logistics Trends 2023"',
      time: "Yesterday",
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Bell className={iconClassName} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-mafl-orange text-white">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-muted/20" : ""}`}
              >
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
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
