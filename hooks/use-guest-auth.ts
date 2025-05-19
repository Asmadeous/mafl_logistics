"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"

export function useGuestAuth() {
  const { isAuthenticated, isGuest, guestToken, createGuestSession } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)
  const [guestId, setGuestId] = useState<string | null>(null)

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

  useEffect(() => {
    // If user is authenticated, we don't need a guest session
    if (isAuthenticated) {
      setIsInitialized(true)
      return
    }

    // Check if we already have a guest ID
    const storedGuestId = getLocalStorageItem("guest_id")
    if (storedGuestId) {
      setGuestId(storedGuestId)
      setIsInitialized(true)
      return
    }

    // If we have a guest token but no ID, generate one
    if (isGuest && guestToken) {
      const newGuestId = `guest-${Math.random().toString(36).substring(2, 15)}`
      setLocalStorageItem("guest_id", newGuestId)
      setGuestId(newGuestId)
      setIsInitialized(true)
      return
    }

    setIsInitialized(true)
  }, [isAuthenticated, isGuest, guestToken])

  const initializeGuestSession = async (name: string, email: string) => {
    if (isAuthenticated) return

    try {
      const token = await createGuestSession()
      if (!guestId) {
        const newGuestId = `guest-${Math.random().toString(36).substring(2, 15)}`
        setLocalStorageItem("guest_id", newGuestId)
        setGuestId(newGuestId)
      }
      return token
    } catch (error) {
      console.error("Failed to initialize guest session:", error)
      return null
    }
  }

  return {
    isGuestInitialized: isInitialized,
    guestId,
    guestToken,
    initializeGuestSession,
  }
}
