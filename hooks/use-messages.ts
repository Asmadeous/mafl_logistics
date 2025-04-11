"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}

export function useMessages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setMessages([])
      setLoading(false)
      return
    }

    async function fetchMessages() {
      try {
        setLoading(true)
        const response = await fetch("/api/messages")

        if (!response.ok) {
          throw new Error(`Error fetching messages: ${response.statusText}`)
        }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (err: any) {
        console.error("Error fetching messages:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [user])

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) {
      throw new Error("You must be logged in to send messages")
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`)
      }

      const data = await response.json()

      // Update local messages state
      setMessages((prev) => [data.message, ...prev])

      return data.message
    } catch (err: any) {
      console.error("Error sending message:", err)
      throw err
    }
  }

  const markAsRead = async (messageId: string) => {
    if (!user) return false

    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Error marking message as read: ${response.statusText}`)
      }

      // Update local state
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, is_read: true } : msg)))

      return true
    } catch (err) {
      console.error("Error marking message as read:", err)
      return false
    }
  }

  const getUnreadCount = () => {
    if (!messages.length) return 0
    return messages.filter((msg) => !msg.is_read && msg.receiver_id === user?.id).length
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    getUnreadCount,
  }
}
