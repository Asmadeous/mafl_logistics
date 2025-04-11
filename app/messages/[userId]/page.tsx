"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useMessages } from "@/hooks/use-messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useUserStatus } from "@/hooks/use-user-status"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function ConversationPage({ params }: { params: { userId: string } }) {
  const { conversations, messages, currentConversation, setCurrentConversation, sendMessage } = useMessages()
  const { getUserStatus } = useUserStatus()
  const { user, loading } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [conversationUser, setConversationUser] = useState<{
    id: string
    name: string
    avatarUrl?: string
    role?: string
  } | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  // Set current conversation based on URL param
  useEffect(() => {
    if (params.userId) {
      setCurrentConversation(params.userId)
    }
  }, [params.userId, setCurrentConversation])

  // Fetch user details if not in conversations
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!params.userId) return

      // First check if user is in conversations
      const conversation = conversations.find((c) => c.userId === params.userId)
      if (conversation) {
        setConversationUser({
          id: conversation.userId,
          name: conversation.userName,
          avatarUrl: conversation.userAvatar,
          role: conversation.userRole,
        })
        return
      }

      // If not found, fetch from profiles
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, role")
          .eq("id", params.userId)
          .single()

        if (error) throw error

        if (data) {
          setConversationUser({
            id: data.id,
            name: data.name,
            avatarUrl: data.avatar_url,
            role: data.role,
          })
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchUserDetails()
  }, [params.userId, conversations, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!params.userId || !newMessage.trim()) return

    const success = await sendMessage(params.userId, newMessage)
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/messages")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      {conversationUser ? (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conversationUser.avatarUrl || undefined} />
                  <AvatarFallback>{conversationUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    getUserStatus(conversationUser.id).status === "online"
                      ? "bg-green-500"
                      : getUserStatus(conversationUser.id).status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500",
                  )}
                ></div>
              </div>
              <div>
                <CardTitle>{conversationUser.name}</CardTitle>
                <CardDescription>
                  {conversationUser.role &&
                    conversationUser.role.charAt(0).toUpperCase() + conversationUser.role.slice(1)}{" "}
                  •
                  {getUserStatus(conversationUser.id).status === "online"
                    ? " Online"
                    : getUserStatus(conversationUser.id).status === "away"
                      ? " Away"
                      : " Offline"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="flex flex-col h-[600px]">
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
                  <div ref={messageEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No messages yet. Send a message to start a conversation.</p>
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
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">User not found</h2>
            <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/messages")}>Return to Messages</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
