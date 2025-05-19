"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import type { Client } from "@/types"

export function useClientProfile() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await api.auth.client.getCurrentClient()

      if (error) {
        setError(error)
        toast({
          title: "Error",
          description: `Failed to fetch profile: ${error}`,
          variant: "destructive",
        })
        return null
      }

      setClient(data.client)
      return data.client
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Failed to fetch profile: ${errorMessage}`,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  const updateProfile = useCallback(
    async (profileData: Partial<Client>) => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await api.auth.client.updateProfile(profileData)

        if (error) {
          setError(error)
          toast({
            title: "Error",
            description: `Failed to update profile: ${error}`,
            variant: "destructive",
          })
          return false
        }

        setClient(data.client)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast({
          title: "Error",
          description: `Failed to update profile: ${errorMessage}`,
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  return {
    client,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
}
