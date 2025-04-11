"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MessageDropdownProps {
  iconClassName?: string
  triggerClassName?: string
}

export function MessageDropdown({ iconClassName = "", triggerClassName = "" }: MessageDropdownProps) {
  // This would be replaced with real data from your messages hook
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Support Team",
      message: "How can we help you today?",
      time: "1 hour ago",
      read: false,
      online: true,
    },
  ])

  const unreadCount = messages.filter((m) => !m.read).length

  const markAllAsRead = () => {
    setMessages(messages.map((m) => ({ ...m, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <MessageSquare className={iconClassName} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-mafl-orange text-white">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Messages</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Messages</h3>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${!message.read ? "bg-muted/20" : ""}`}
              >
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                    <User className="h-4 w-4" />
                    {message.online && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{message.sender}</p>
                    <p className="text-xs text-muted-foreground">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No messages</div>
          )}
        </div>
        <div className="p-2 text-center">
          <Link href="/messages" className="text-xs text-primary hover:underline">
            View all messages
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
