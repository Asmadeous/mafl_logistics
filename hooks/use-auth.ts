"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setIsAdmin(session?.user?.user_metadata?.role === "admin" || false)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsAdmin(session?.user?.user_metadata?.role === "admin" || false)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign in",
      }
    }
  }

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            role: "user", // Default role for new users
          },
        },
      })

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign up",
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push("/")
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  return {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }
}
