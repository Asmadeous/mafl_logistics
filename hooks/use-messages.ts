"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

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

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userRole: "admin",
    lastMessage: "Hello, how can I help you today?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    unreadCount: 1,
  },
  {
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userRole: "user",
    lastMessage: "Thanks for your assistance!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 0,
  },
]

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  user1: [
    {
      id: "msg1",
      senderId: "currentUser",
      receiverId: "user1",
      content: "Hi there, how can I help you with your logistics needs?",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    {
      id: "msg2",
      senderId: "user1",
      receiverId: "currentUser",
      content: "Hello, I'm looking for information about your cross-border services.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    },
    {
      id: "msg3",
      senderId: "user1",
      receiverId: "currentUser",
      content: "Do you provide services to Rwanda?",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
  ],
  user2: [
    {
      id: "msg4",
      senderId: "user2",
      receiverId: "currentUser",
      content: "Hi, I need a quote for heavy machinery transport.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    },
    {
      id: "msg5",
      senderId: "currentUser",
      receiverId: "user2",
      content: "I'd be happy to help with that. Could you provide more details about the machinery?",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 175).toISOString(), // 2 hours 55 minutes ago
    },
    {
      id: "msg6",
      senderId: "user2",
      receiverId: "currentUser",
      content: "Thanks for your assistance!",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
  ],
}

export function useMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  // const supabase = getSupabaseClient()

  // Fetch conversations when user changes
  useEffect(() => {
    if (!user) {
      setConversations([])
      setUnreadTotal(0)
      setLoading(false)
      return
    }

    // Simulate loading conversations
    const timer = setTimeout(() => {
      setConversations(mockConversations)
      setUnreadTotal(mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0))
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [user])

  // Fetch messages for current conversation
  useEffect(() => {
    if (!user || !currentConversation) {
      setMessages([])
      return
    }

    // Simulate loading messages
    const timer = setTimeout(() => {
      setMessages(mockMessages[currentConversation] || [])
    }, 300)

    return () => clearTimeout(timer)
  }, [user, currentConversation])

  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return false

    // Create a new message
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: "currentUser",
      receiverId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    // Add to messages
    setMessages((prev) => [...prev, newMessage])

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.userId === receiverId
          ? {
              ...conv,
              lastMessage: content,
              lastMessageTime: newMessage.createdAt,
            }
          : conv,
      ),
    )

    return true
  }

  // Mark conversation as read
  const markConversationAsRead = async (userId: string) => {
    if (!user) return false

    // Update messages
    setMessages((prev) => prev.map((msg) => (msg.senderId === userId && !msg.isRead ? { ...msg, isRead: true } : msg)))

    // Update conversation
    setConversations((prev) => {
      const updatedConversations = prev.map((conv) =>
        conv.userId === userId
          ? {
              ...conv,
              unreadCount: 0,
            }
          : conv,
      )

      // Recalculate total unread
      const newUnreadTotal = updatedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
      setUnreadTotal(newUnreadTotal)

      return updatedConversations
    })

    return true
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
