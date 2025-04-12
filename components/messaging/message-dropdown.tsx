"use client"
import Link from "next/link"
import { MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMessages } from "@/hooks/use-messages"
import { useAuth } from "@/hooks/use-auth"

interface MessageDropdownProps {
  iconClassName?: string
  triggerClassName?: string
}

export function MessageDropdown({ iconClassName = "", triggerClassName = "" }: MessageDropdownProps) {
  const { user } = useAuth()
  const { conversations, unreadTotal, loading } = useMessages()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${triggerClassName}`}>
          <MessageSquare className={iconClassName} />
          {unreadTotal > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-mafl-orange text-white rounded-full">
              {unreadTotal > 99 ? "99+" : unreadTotal}
            </Badge>
          )}
          <span className="sr-only">Messages</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Messages</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Link
                key={conversation.userId}
                href={`/messages/${conversation.userId}`}
                className={`block p-4 border-b hover:bg-muted/50 ${conversation.unreadCount > 0 ? "bg-muted/20" : ""}`}
              >
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    {conversation.userAvatar ? (
                      <img
                        src={conversation.userAvatar || "/placeholder.svg"}
                        alt={conversation.userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{conversation.userName}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-mafl-orange">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
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
