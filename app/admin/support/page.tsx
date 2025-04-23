"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, UserRoundSearch } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

type Conversation = {
  userId: string
  userName: string
  userAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

export default function SupportPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load support conversations on mount
  useEffect(() => {
    fetchSupportConversations()
  }, [])

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (currentUserId) {
      fetchMessages(currentUserId)
    }
  }, [currentUserId])

  // Fetch all support conversations
  const fetchSupportConversations = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/api/support_conversations`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch support conversations")
      }

      const data = await response.json()
      setConversations(data || [])

      // Select the first conversation if available
      if (data.length > 0 && !currentUserId) {
        setCurrentUserId(data[0].userId)
      }
    } catch (error) {
      console.error("Error fetching support conversations:", error)
      toast({
        title: "Error",
        description: "Failed to load support conversations.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/api/conversations/${userId}/messages`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data || [])

      // Mark conversation as read
      await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/api/conversations/${userId}/read`, {
        method: "POST",
        credentials: "include",
      })

      // Update unread count in conversations list
      setConversations((prev) => prev.map((conv) => (conv.userId === userId ? { ...conv, unreadCount: 0 } : conv)))
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      })
    }
  }

  // Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUserId || !newMessage.trim() || !user) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          receiver_id: currentUserId,
          content: newMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newMsg = await response.json()

      // Add message to the list
      setMessages((prev) => [...prev, newMsg])

      // Update the conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === currentUserId
            ? {
                ...conv,
                lastMessage: newMessage,
                lastMessageTime: new Date().toISOString(),
              }
            : conv,
        ),
      )

      // Clear input
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Conversations</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>{conversations.length} active support conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length > 0 ? (
              <ScrollArea className="h-[500px]">
                {conversations.map((conversation) => {
                  const isActive = conversation.userId === currentUserId

                  return (
                    <div
                      key={conversation.userId}
                      className={cn(
                        "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted",
                        isActive && "bg-muted",
                        conversation.unreadCount > 0 && "bg-muted/50",
                      )}
                      onClick={() => setCurrentUserId(conversation.userId)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.userAvatar || undefined} />
                          <AvatarFallback>{conversation.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
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
                        <div className="flex-shrink-0 rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs">
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
                <p className="text-muted-foreground">No support conversations yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {currentUserId
                ? conversations.find((c) => c.userId === currentUserId)?.userName || "Customer"
                : "Support Chat"}
            </CardTitle>
            <CardDescription>
              {currentUserId
                ? "Respond to customer inquiries and provide assistance"
                : "Select a conversation to start responding"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!currentUserId ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 h-[500px]">
                <UserRoundSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Support Messages</p>
                <p className="text-muted-foreground text-center mt-2">Select a conversation to start messaging</p>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  {messages.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {messages.map((message) => {
                        const isMe = message.senderId === user?.id

                        return (
                          <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            {!isMe && (
                              <Avatar className="mr-2 flex-shrink-0">
                                <AvatarImage
                                  src={conversations.find((c) => c.userId === currentUserId)?.userAvatar || undefined}
                                />
                                <AvatarFallback>
                                  {conversations
                                    .find((c) => c.userId === currentUserId)
                                    ?.userName.slice(0, 2)
                                    .toUpperCase() || "CU"}
                                </AvatarFallback>
                              </Avatar>
                            )}
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
                            {isMe && (
                              <Avatar className="ml-2 flex-shrink-0">
                                <AvatarImage src={user?.avatar_url || undefined} />
                                <AvatarFallback>{user?.name?.charAt(0) || "S"}</AvatarFallback>
                              </Avatar>
                            )}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
