"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/hooks/use-auth"

type UserStatus = {
  status: "online" | "away" | "offline"
  lastSeen: string | null
}

export function useUserStatus() {
  const { user } = useAuth()
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({})
  const supabase = getSupabaseClient()

  // Update current user's status
  useEffect(() => {
    if (!user) return

    // Function to update user's status
    const updateStatus = async (status: "online" | "away" | "offline") => {
      try {
        const { error } = await supabase.from("user_statuses").upsert(
          {
            user_id: user.id,
            status,
            last_seen: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )

        if (error) throw error
      } catch (error) {
        console.error("Error updating user status:", error)
      }
    }

    // Set user as online when component mounts
    updateStatus("online")

    // Set up event listeners for user activity/inactivity
    let activityTimeout: NodeJS.Timeout

    const resetActivityTimer = () => {
      clearTimeout(activityTimeout)

      // If user was away, set back to online
      if (userStatuses[user.id]?.status === "away") {
        updateStatus("online")
      }

      // Set timeout to mark user as away after 5 minutes of inactivity
      activityTimeout = setTimeout(
        () => {
          updateStatus("away")
        },
        5 * 60 * 1000,
      ) // 5 minutes
    }

    // Listen for user activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"]
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetActivityTimer)
    })

    // Set up beforeunload event to mark user as offline when leaving
    const handleBeforeUnload = () => {
      updateStatus("offline")
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Start the initial activity timer
    resetActivityTimer()

    // Cleanup function
    return () => {
      clearTimeout(activityTimeout)
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetActivityTimer)
      })
      window.removeEventListener("beforeunload", handleBeforeUnload)
      updateStatus("offline")
    }
  }, [user, supabase])

  // Function to get a specific user's status
  const getUserStatus = (userId: string): UserStatus => {
    return userStatuses[userId] || { status: "offline", lastSeen: null }
  }

  return {
    getUserStatus,
  }
}
