"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useMessages } from "@/hooks/use-messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useUserStatus } from "@/hooks/use-user-status"
import { useAuth } from "@/hooks/use-auth"
import { UserRoundSearch, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MessagesPage() {
  const {
    conversations,
    messages,
    unreadTotal,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    markConversationAsRead,
  } = useMessages()
  const { getUserStatus } = useUserStatus()
  const { user, loading } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<{
    userId: string
    userName: string
    userAvatar?: string
  } | null>(null)

  useEffect(() => {
    if (currentConversation && conversations.length > 0) {
      const user = conversations.find((c) => c.userId === currentConversation)
      if (user) {
        setSelectedUser({
          userId: user.userId,
          userName: user.userName,
          userAvatar: user.userAvatar,
        })
      }
    }
  }, [currentConversation, conversations])

  const handleSelectConversation = async (userId: string) => {
    setCurrentConversation(userId)
    await markConversationAsRead(userId)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentConversation || !newMessage.trim()) return

    const success = await sendMessage(currentConversation, newMessage)
    if (success) {
      setNewMessage("")
    }
  }

  if (loading || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>
              {unreadTotal > 0 ? `You have ${unreadTotal} unread messages` : "No unread messages"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {conversations.length > 0 ? (
              <ScrollArea className="h-[500px]">
                {conversations.map((conversation) => {
                  const status = getUserStatus(conversation.userId)
                  const isActive = conversation.userId === currentConversation

                  return (
                    <div
                      key={conversation.userId}
                      className={cn(
                        "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted",
                        isActive && "bg-muted",
                        conversation.unreadCount > 0 && "bg-muted/50",
                      )}
                      onClick={() => handleSelectConversation(conversation.userId)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.userAvatar || undefined} />
                          <AvatarFallback>{conversation.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            status.status === "online"
                              ? "bg-green-500"
                              : status.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500",
                          )}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{conversation.userName}</h4>
                          {conversation.lastMessageTime && (
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex-shrink-0 rounded-full bg-primary h-6 w-6 flex items-center justify-center text-white text-xs">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  )
                })}
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 h-[500px]">
                <UserRoundSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="lg:col-span-2">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedUser.userAvatar || undefined} />
                      <AvatarFallback>{selectedUser.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {currentConversation && (
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                          getUserStatus(currentConversation).status === "online"
                            ? "bg-green-500"
                            : getUserStatus(currentConversation).status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500",
                        )}
                      ></div>
                    )}
                  </div>
                  <div>
                    <CardTitle>{selectedUser.userName}</CardTitle>
                    <CardDescription>
                      {currentConversation && getUserStatus(currentConversation).status === "online"
                        ? "Online"
                        : getUserStatus(currentConversation).status === "away"
                          ? "Away"
                          : "Offline"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4">
                  {messages.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {messages.map((message) => {
                        const isMe = message.senderId === user.id

                        return (
                          <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2",
                                isMe ? "bg-primary text-primary-foreground" : "bg-muted",
                              )}
                            >
                              <p>{message.content}</p>
                              <p
                                className={cn(
                                  "text-xs mt-1",
                                  isMe ? "text-primary-foreground/70" : "text-muted-foreground",
                                )}
                              >
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 h-[600px]">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your Messages</p>
              <p className="text-muted-foreground text-center mt-2">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
