"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { getSupabaseClient } from "@/lib/supabase-client"

type UserStatus = "online" | "away" | "offline"

export function useUserStatus() {
  const [userStatuses, setUserStatuses] = useState<Record<string, { status: UserStatus; lastActive: string }>>({})
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  // Update own status and subscribe to status changes
  useEffect(() => {
    if (!user) return

    // Set initial status to online
    const updateStatus = async (status: UserStatus) => {
      await supabase.from("user_status").upsert({ user_id: user.id, status }, { onConflict: "user_id" })
    }

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateStatus("online")
      } else {
        updateStatus("away")
      }
    }

    // Set initial status
    updateStatus("online")

    // Subscribe to status changes
    const statusSubscription = supabase
      .channel("user_status_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_status" }, (payload) => {
        const { user_id, status, last_active } = payload.new
        setUserStatuses((prev) => ({
          ...prev,
          [user_id]: {
            status: status as UserStatus,
            lastActive: last_active,
          },
        }))
      })
      .subscribe()

    // Set up page visibility listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Set up beforeunload to mark user as offline when leaving
    window.addEventListener("beforeunload", () => {
      updateStatus("offline")
    })

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      updateStatus("offline")
      statusSubscription.unsubscribe()
    }
  }, [user, supabase])

  // Get status for a specific user
  const getUserStatus = (userId: string) => {
    return userStatuses[userId] || { status: "offline", lastActive: "" }
  }

  return {
    userStatuses,
    getUserStatus,
  }
}
