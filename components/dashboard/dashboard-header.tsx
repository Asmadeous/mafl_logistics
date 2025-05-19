"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { useNotificationChannel } from "@/hooks/use-notification-channel"

type DashboardHeaderProps = {
  onMenuButtonClick: () => void
  dashboardType: "admin" | "client" | "user"
  userId?: string
}

export function DashboardHeader({ onMenuButtonClick, dashboardType, userId }: DashboardHeaderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  // Use the notification channel hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationChannel(userId)

  // Use ref for audio element to prevent recreation on each render
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)
  const audioLoaded = useRef(false)

  // Initialize audio elements once
  useEffect(() => {
    if (typeof window !== "undefined" && !audioLoaded.current) {
      try {
        notificationSoundRef.current = new Audio("/sounds/notification.mp3")

        // Preload the audio
        if (notificationSoundRef.current) {
          notificationSoundRef.current.volume = 0.5
          notificationSoundRef.current.load()
          audioLoaded.current = true
        }
      } catch (error) {
        console.log("Audio initialization failed:", error)
      }
    }

    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause()
        notificationSoundRef.current = null
      }
    }
  }, [])

  // Play sound when new notification arrives
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]

      // Only play sound for unread notifications
      if (!latestNotification.read) {
        try {
          if (notificationSoundRef.current) {
            notificationSoundRef.current.currentTime = 0
            notificationSoundRef.current.play().catch((e) => {
              console.log("Audio play failed:", e)
            })
          }

          // Show toast notification
          toast({
            title: "New Notification",
            description: latestNotification.message,
          })
        } catch (error) {
          console.log("Audio play error:", error)
        }
      }
    }
  }, [notifications, toast])

  // Get user initials based on dashboard type
  const getUserInitials = () => {
    switch (dashboardType) {
      case "admin":
        return "AD"
      case "client":
        return "CL"
      case "user":
        return "US"
      default:
        return "MA"
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sm:px-6 md:left-64">
      <div className="flex items-center min-w-0">
        <button
          type="button"
          className="text-gray-500 focus:outline-none md:hidden mr-2 flex-shrink-0"
          onClick={onMenuButtonClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground border-none">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] sm:w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-bold">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start p-3 cursor-default ${!notification.read ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-bold ${!notification.read ? "text-primary" : ""} truncate`}>
                        {notification.message}
                      </span>
                      {!notification.read && (
                        <Badge className="ml-2 bg-primary text-primary-foreground border-none flex-shrink-0">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">No notifications</div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/${dashboardType}/notifications`}
                className="justify-center text-primary cursor-pointer font-bold"
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu with avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={`/placeholder-with-text.png?text=${getUserInitials()}`} alt="User avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
              </Avatar>
              {/* Online/Offline indicator */}
              <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-red-500"}`}
                aria-hidden="true"
              ></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${dashboardType}/profile`} className="w-full font-medium">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${dashboardType}/settings`} className="w-full font-medium">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="w-full font-medium">
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
