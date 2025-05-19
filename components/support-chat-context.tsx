"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useGuestAuth } from "@/hooks/use-guest-auth"


interface SupportChatContextType {
  isOpen: boolean
  toggleChat: () => void
  closeChat: () => void
  openChat: () => void
  messages: Message[]
  addMessage: (message: Message) => void
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  conversationId: string | null
  setConversationId: (id: string | null) => void
  initialMessage: string
  setInitialMessage: (message: string) => void
  registerGuest: (name: string, email?: string) => Promise<boolean>
  isGuestRegistering: boolean
  guestToken?: string
}

interface Message {
  id: string
  content: string
  sender: "user" | "support"
  timestamp: Date
}

// Safely get localStorage items
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

// Safely set localStorage items
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined)

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [initialMessage, setInitialMessage] = useState("")
  const [isGuestRegistering, setIsGuestRegistering] = useState(false)
  const { isAuthenticated, userType, userData } = useAuth()
  const { guestId, guestToken, initializeGuestSession } = useGuestAuth()

  // Load messages and conversation ID from localStorage on mount
  useEffect(() => {
    const storedMessages = getLocalStorageItem("supportChatMessages")
    const storedConversationId = getLocalStorageItem("supportConversationId")

    if (storedConversationId) {
      setConversationId(storedConversationId)
    }

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDateObjects)
      } catch (error) {
        console.error("Failed to parse stored messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      setLocalStorageItem("supportChatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Register for guest chat
  const registerGuest = async (name: string, email = "") => {
    setIsGuestRegistering(true)
    try {
      // Initialize guest session
      const success = await initializeGuestSession(name, email)

      if (success) {
        // Subscribe to notifications if we have a conversation ID
        if (conversationId) {
          try {
            await fetch(`/api/notifications/subscribe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getLocalStorageItem("guestToken")}`,
              },
              body: JSON.stringify({
                entity_id: conversationId,
                entity_type: "conversation",
              }),
            })
          } catch (error) {
            console.error("Failed to subscribe to notifications:", error)
          }
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to register guest:", error)
      return false
    } finally {
      setIsGuestRegistering(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  const openChat = () => {
    setIsOpen(true)
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const sendMessage = async (content: string) => {
    setIsLoading(true)

    try {
      // Generate a unique ID for the message
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      // Add the user message to the chat
      const userMessage: Message = {
        id: messageId,
        content,
        sender: "user",
        timestamp: new Date(),
      }
      addMessage(userMessage)

      // If not authenticated, ensure we have a guest session
      // NOTE: Cannot initialize guest session here because name/email are not available in this scope.
      // If needed, ensure guest session is initialized before calling sendMessage.
      if (!isAuthenticated && !guestToken) {
        console.warn("Guest session is not initialized. Please register guest before sending messages.")
        return
      }

      // TODO: Send the message to the backend API
      // This would typically involve a fetch call to your API
      // For now, we'll simulate a response after a delay

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add a support response
      const supportMessage: Message = {
        id: `reply-${messageId}`,
        content: "Thank you for your message. Our support team will get back to you shortly.",
        sender: "support",
        timestamp: new Date(),
      }
      addMessage(supportMessage)

      // Play notification sound for guest users
      if (!isAuthenticated && guestToken) {
        const notificationSound = document.getElementById("notification-sound") as HTMLAudioElement
        if (notificationSound) {
          notificationSound.play().catch((e) => console.error("Failed to play notification sound:", e))
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Add an error message
      addMessage({
        id: `error-${Date.now()}`,
        content: "Failed to send message. Please try again later.",
        sender: "support",
        timestamp: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SupportChatContext.Provider
      value={{
        isOpen,
        toggleChat,
        closeChat,
        openChat,
        messages,
        addMessage,
        isLoading,
        sendMessage,
        conversationId,
        setConversationId,
        initialMessage,
        setInitialMessage,
        registerGuest,
        isGuestRegistering,
      }}
    >
      {children}
    </SupportChatContext.Provider>
  )
}

export function useSupportChat() {
  const context = useContext(SupportChatContext)
  if (context === undefined) {
    throw new Error("useSupportChat must be used within a SupportChatProvider")
  }
  return context
}
