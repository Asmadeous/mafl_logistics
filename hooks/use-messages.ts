"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getSupabaseClient } from "@/lib/supabase-client"

type Conversation = {
  userId: string
  userName: string
  userAvatar?: string
  userRole?: string
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

export function useMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  // Fetch conversations when user changes
  useEffect(() => {
    if (!user) {
      setConversations([])
      setUnreadTotal(0)
      setLoading(false)
      return
    }

    const fetchConversations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/messages/conversations")

        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }

        const data = await response.json()
        setConversations(data.conversations || [])
        setUnreadTotal(data.unreadTotal || 0)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Set up realtime subscription for new messages
    const subscription = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          // Fetch updated conversations to get the latest state
          fetchConversations()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, supabase])

  // Fetch messages for current conversation
  useEffect(() => {
    if (!user || !currentConversation) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/conversation/${currentConversation}`)

        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Set up realtime subscription for new messages in this conversation
    const subscription = supabase
      .channel(`conversation-${currentConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_messages",
          filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${currentConversation}),and(sender_id=eq.${currentConversation},receiver_id=eq.${user.id}))`,
        },
        async (payload) => {
          // Add the new message to the list
          const newMessage = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            receiverId: payload.new.receiver_id,
            content: payload.new.content,
            isRead: payload.new.is_read,
            createdAt: payload.new.created_at,
          }

          setMessages((prev) => [...prev, newMessage])

          // If the message is to the current user and unread, mark it as read
          if (payload.new.receiver_id === user.id && !payload.new.is_read) {
            await markConversationAsRead(currentConversation)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, currentConversation, supabase])

  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return false

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId, content }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

  // Mark conversation as read
  const markConversationAsRead = async (userId: string) => {
    if (!user) return false

    try {
      const response = await fetch(`/api/messages/mark-read/${userId}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to mark conversation as read")
      }

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === userId
            ? {
                ...conv,
                unreadCount: 0,
              }
            : conv,
        ),
      )

      // Recalculate total unread
      setConversations((current) => {
        const newUnreadTotal = current.reduce((sum, conv) => sum + conv.unreadCount, 0)
        setUnreadTotal(newUnreadTotal)
        return current
      })

      return true
    } catch (error) {
      console.error("Error marking conversation as read:", error)
      return false
    }
  }

  return {
    conversations,
    messages,
    unreadTotal,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    markConversationAsRead,
    loading,
  }
}
