"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { getSupabaseClient } from "@/lib/supabase-client"

export type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  senderDetails?: {
    name: string
    avatarUrl?: string
    role?: string
  }
}

export type Conversation = {
  userId: string
  userName: string
  userRole?: string
  userAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  // Fetch conversations and subscribe to new messages
  useEffect(() => {
    if (!user) {
      setConversations([])
      setMessages([])
      setUnreadTotal(0)
      setLoading(false)
      return
    }

    setLoading(true)

    // Fetch conversations
    const fetchConversations = async () => {
      try {
        // Get all messages to/from the current user
        const { data: messagesData, error: messagesError } = await supabase
          .from("user_messages")
          .select(`
            id,
            sender_id,
            receiver_id,
            content,
            is_read,
            created_at
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false })

        if (messagesError) throw messagesError

        // Group messages by conversation
        const conversationMap: Record<
          string,
          {
            userId: string
            lastMessage: string
            lastMessageTime: string
            unreadCount: number
          }
        > = {}

        messagesData.forEach((message) => {
          const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id

          if (!conversationMap[otherUserId]) {
            conversationMap[otherUserId] = {
              userId: otherUserId,
              lastMessage: message.content,
              lastMessageTime: message.created_at,
              unreadCount: message.receiver_id === user.id && !message.is_read ? 1 : 0,
            }
          } else if (message.receiver_id === user.id && !message.is_read) {
            conversationMap[otherUserId].unreadCount++
          }
        })

        // Get user details for each conversation
        const userIds = Object.keys(conversationMap)
        if (userIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from("profiles")
            .select("id, name, avatar_url, role")
            .in("id", userIds)

          if (usersError) throw usersError

          // Map user details to conversations
          const conversationsList = userIds
            .map((id) => {
              const userDetails = usersData.find((u) => u.id === id)
              return {
                userId: id,
                userName: userDetails?.name || "Unknown User",
                userRole: userDetails?.role,
                userAvatar: userDetails?.avatar_url,
                lastMessage: conversationMap[id].lastMessage,
                lastMessageTime: conversationMap[id].lastMessageTime,
                unreadCount: conversationMap[id].unreadCount,
              }
            })
            .sort((a, b) => {
              return new Date(b.lastMessageTime || "").getTime() - new Date(a.lastMessageTime || "").getTime()
            })

          setConversations(conversationsList)

          // Calculate total unread messages
          const total = conversationsList.reduce((sum, conv) => sum + conv.unreadCount, 0)
          setUnreadTotal(total)
        } else {
          setConversations([])
          setUnreadTotal(0)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel("user_messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "user_messages" }, (payload) => {
        const newMessage = payload.new

        // Only process if user is sender or receiver
        if (newMessage.sender_id === user.id || newMessage.receiver_id === user.id) {
          // If this is from the current conversation, add to messages
          if (
            currentConversation &&
            (newMessage.sender_id === currentConversation || newMessage.receiver_id === currentConversation)
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMessage.id,
                senderId: newMessage.sender_id,
                receiverId: newMessage.receiver_id,
                content: newMessage.content,
                isRead: newMessage.is_read,
                createdAt: newMessage.created_at,
              },
            ])
          }

          // Update conversations
          fetchConversations()
        }
      })
      .subscribe()

    // Subscribe to message updates (mark as read)
    const messageUpdateSubscription = supabase
      .channel("message_updates")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "user_messages" }, (payload) => {
        // Update message read status if in current messages
        setMessages((prev) =>
          prev.map((message) =>
            message.id === payload.new.id
              ? {
                  ...message,
                  isRead: payload.new.is_read,
                }
              : message,
          ),
        )

        // Update conversations if needed
        if (payload.old.is_read === false && payload.new.is_read === true) {
          fetchConversations()
        }
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      messageUpdateSubscription.unsubscribe()
    }
  }, [user, supabase, currentConversation])

  // Fetch messages for a conversation
  useEffect(() => {
    if (!user || !currentConversation) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("user_messages")
          .select(`
            id,
            sender_id,
            receiver_id,
            content,
            is_read,
            created_at
          `)
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${currentConversation}),and(sender_id.eq.${currentConversation},receiver_id.eq.${user.id})`,
          )
          .order("created_at", { ascending: true })

        if (error) throw error

        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          isRead: msg.is_read,
          createdAt: msg.created_at,
        }))

        setMessages(formattedMessages)

        // Mark unread messages as read
        const unreadIds = data.filter((msg) => msg.receiver_id === user.id && !msg.is_read).map((msg) => msg.id)

        if (unreadIds.length > 0) {
          await supabase.from("user_messages").update({ is_read: true }).in("id", unreadIds)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [user, supabase, currentConversation])

  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from("user_messages")
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
        })
        .select()

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error sending message:", error)
      return false
    }
  }

  // Mark all messages in a conversation as read
  const markConversationAsRead = async (otherUserId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from("user_messages")
        .update({ is_read: true })
        .eq("sender_id", otherUserId)
        .eq("receiver_id", user.id)
        .eq("is_read", false)

      if (error) throw error
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
    loading,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    markConversationAsRead,
  }
}
