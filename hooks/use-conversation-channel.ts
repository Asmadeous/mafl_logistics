"use client"

import { useState, useEffect, useCallback } from "react"
import { getConsumer } from "@/lib/actioncable"
import { useGuestAuth } from "@/hooks/use-guest-auth"

// Define the message type
type Message = {
  id: string
  content: string
  sender_id: string
  sender_type: string
  created_at: string
  sender_name: string
  read: boolean
}

export function useConversationChannel(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const { ensureGuestAuth } = useGuestAuth()

  // Load messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    // Ensure guest authentication
    ensureGuestAuth()

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would fetch messages from the API
        const token = localStorage.getItem("authToken") || localStorage.getItem("guestToken")
        const response = await fetch(`/api/conversations/${conversationId}/messages`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setMessages(data.messages || [])
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch messages"))
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId, ensureGuestAuth])

  // Subscribe to the conversation channel
  useEffect(() => {
    if (!conversationId) return

    // Ensure guest authentication
    ensureGuestAuth()

    const consumer = getConsumer()

    const newSubscription = consumer.subscriptions.create(
      {
        channel: "ConversationsChannel",
        conversation_id: conversationId,
      },
      {
        connected() {
          console.log(`Connected to conversation ${conversationId}`)
        },
        disconnected() {
          console.log(`Disconnected from conversation ${conversationId}`)
        },
        received(data) {
          console.log("Received message:", data)
          if (data.message) {
            setMessages((prev) => [...prev, data.message])

            // Play message sound if the message is from someone else
            const currentUserId = localStorage.getItem("userId") || localStorage.getItem("guestId")
            if (data.message.sender_id !== currentUserId) {
              try {
                const audio = new Audio("/sounds/message.mp3")
                audio.play().catch((e) => console.log("Audio play prevented:", e))
              } catch (e) {
                console.log("Error playing message sound:", e)
              }
            }
          }
        },
      },
    )

    setSubscription(newSubscription)

    // Cleanup subscription on unmount
    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe()
      }
    }
  }, [conversationId, ensureGuestAuth])

  // Send message function
  const sendMessage = useCallback(
    (content: string) => {
      if (!conversationId || !subscription || !content.trim()) {
        return
      }

      // Ensure guest authentication
      ensureGuestAuth()

      // Get the appropriate token
      const token = localStorage.getItem("authToken") || localStorage.getItem("guestToken")

      // In a real implementation, this would send a message via the API
      fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: { content } }),
      }).catch((err) => {
        console.error("Error sending message:", err)
        setError(err instanceof Error ? err : new Error("Failed to send message"))
      })
    },
    [conversationId, subscription, ensureGuestAuth],
  )

  // Mark message as read
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!conversationId) {
        return
      }

      // Ensure guest authentication
      ensureGuestAuth()

      // Get the appropriate token
      const token = localStorage.getItem("authToken") || localStorage.getItem("guestToken")

      // In a real implementation, this would mark a message as read via the API
      fetch(`/api/conversations/${conversationId}/messages/${messageId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }).catch((err) => {
        console.error("Error marking message as read:", err)
      })
    },
    [conversationId, ensureGuestAuth],
  )

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
  }
}
