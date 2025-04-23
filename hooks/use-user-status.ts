"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import { useAuth } from "./use-auth"

type UserStatus = {
  status: "online" | "away" | "offline"
  lastSeen: string | null
}

// Mock user statuses
const mockStatuses: Record<string, UserStatus> = {
  default: { status: "online", lastSeen: new Date().toISOString() },
}

export function useUserStatus() {
  const { user } = useAuth()
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>(mockStatuses)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to reset the activity timer
  const resetActivityTimer = useCallback(() => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }

    // If user was away, set back to online
    setUserStatuses((prev) => {
      const userId = user?.id
      if (!userId) return prev

      if (prev[userId]?.status === "away") {
        return {
          ...prev,
          [userId]: { status: "online", lastSeen: new Date().toISOString() },
        }
      }
      return prev
    })

    // Set timeout to mark user as away after 5 minutes of inactivity
    activityTimeoutRef.current = setTimeout(
      () => {
        setUserStatuses((prev) => {
          const userId = user?.id
          if (!userId) return prev

          return {
            ...prev,
            [userId]: { status: "away", lastSeen: new Date().toISOString() },
          }
        })
      },
      5 * 60 * 1000,
    ) // 5 minutes
  }, [user?.id])

  // Update current user's status
  useEffect(() => {
    if (!user) return

    // Set user as online when component mounts
    setUserStatuses((prev) => ({
      ...prev,
      [user.id]: { status: "online", lastSeen: new Date().toISOString() },
    }))

    // Listen for user activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetActivityTimer)
    })

    // Start the initial activity timer
    resetActivityTimer()

    // Cleanup function
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetActivityTimer)
      })
    }
  }, [user, resetActivityTimer])

  // Function to get a specific user's status
  const getUserStatus = (userId: string): UserStatus => {
    return userStatuses[userId] || userStatuses["default"] || { status: "offline", lastSeen: null }
  }

  return {
    getUserStatus,
  }
}
