"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

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

  // Update current user's status
  useEffect(() => {
    if (!user) return

    // Set user as online when component mounts
    setUserStatuses((prev) => ({
      ...prev,
      [user.id]: { status: "online", lastSeen: new Date().toISOString() },
    }))

    // Set up event listeners for user activity/inactivity
    let activityTimeout: NodeJS.Timeout

    const resetActivityTimer = () => {
      clearTimeout(activityTimeout)

      // If user was away, set back to online
      if (userStatuses[user.id]?.status === "away") {
        setUserStatuses((prev) => ({
          ...prev,
          [user.id]: { status: "online", lastSeen: new Date().toISOString() },
        }))
      }

      // Set timeout to mark user as away after 5 minutes of inactivity
      activityTimeout = setTimeout(
        () => {
          setUserStatuses((prev) => ({
            ...prev,
            [user.id]: { status: "away", lastSeen: new Date().toISOString() },
          }))
        },
        5 * 60 * 1000,
      ) // 5 minutes
    }

    // Listen for user activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetActivityTimer)
    })

    // Start the initial activity timer
    resetActivityTimer()

    // Cleanup function
    return () => {
      clearTimeout(activityTimeout)
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetActivityTimer)
      })
    }
  }, [user, userStatuses])

  // Function to get a specific user's status
  const getUserStatus = (userId: string): UserStatus => {
    return userStatuses[userId] || userStatuses["default"] || { status: "offline", lastSeen: null }
  }

  return {
    getUserStatus,
  }
}
