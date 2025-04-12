"use client"

import * as React from "react"
import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

// Define user type
type AuthUser = {
  id: string
  email: string
  name?: string
  type: "user" | "employee"
  role?: string
} | null

// Create context
type AuthContextType = {
  user: AuthUser
  loading: boolean
  error: string | null
  loginUser: (email: string, password: string) => Promise<void>
  loginEmployee: (email: string, password: string) => Promise<void>
  registerUser: (userData: any) => Promise<void>
  registerEmployee: (userData: any) => Promise<void>
  logout: () => Promise<void>
  requestPasswordReset: (email: string, isEmployee?: boolean) => Promise<void>
  resetPassword: (
    resetData: { reset_password_token: string; password: string; password_confirmation: string },
    isEmployee?: boolean,
  ) => Promise<void>
  isAdmin: boolean
  googleAuthUser: () => void
  googleAuthEmployee: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is admin
  const isAdmin = user?.type === "employee" || user?.role === "admin"

  // Check if user is logged in on mount
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)
        const userData = await api.auth.getCurrentUser()
        if (userData && userData.id) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (err) {
        // User is not logged in
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // User login function
  async function loginUser(email: string, password: string) {
    try {
      setLoading(true)
      setError(null)

      const userData = await api.auth.loginUser({ email, password })
      setUser({ ...userData, type: "user" })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Employee login function
  async function loginEmployee(email: string, password: string) {
    try {
      setLoading(true)
      setError(null)

      const userData = await api.auth.loginEmployee({ email, password })
      setUser({ ...userData, type: "employee" })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Failed to login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // User registration function
  async function registerUser(userData: any) {
    try {
      setLoading(true)
      setError(null)

      // Check if userData is FormData
      const isFormData = userData instanceof FormData

      if (isFormData) {
        await api.auth.registerUserWithFormData(userData)
      } else {
        await api.auth.registerUser(userData)
      }

      // Redirect to login page
      router.push("/auth/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Failed to register")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Employee registration function
  async function registerEmployee(userData: any) {
    try {
      setLoading(true)
      setError(null)

      await api.auth.registerEmployee(userData)

      // Redirect to employee login page
      router.push("/admin/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Failed to register")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  async function logout() {
    try {
      setLoading(true)

      if (user?.type === "employee") {
        await api.auth.logoutEmployee()
      } else {
        await api.auth.logoutUser()
      }

      setUser(null)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to logout")
    } finally {
      setLoading(false)
    }
  }

  // Password reset request function
  async function requestPasswordReset(email: string, isEmployee = false) {
    try {
      setLoading(true)
      setError(null)

      if (isEmployee) {
        await api.auth.requestPasswordResetEmployee(email)
      } else {
        await api.auth.requestPasswordResetUser(email)
      }

      // Redirect to confirmation page
      router.push(isEmployee ? "/admin/forgot-password/confirmation" : "/auth/forgot-password/confirmation")
    } catch (err: any) {
      setError(err.message || "Failed to request password reset")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Password reset function
  async function resetPassword(
    resetData: { reset_password_token: string; password: string; password_confirmation: string },
    isEmployee = false,
  ) {
    try {
      setLoading(true)
      setError(null)

      if (isEmployee) {
        await api.auth.resetPasswordEmployee(resetData)
      } else {
        await api.auth.resetPasswordUser(resetData)
      }

      // Redirect to login page
      router.push(isEmployee ? "/admin/login?reset=true" : "/auth/login?reset=true")
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth functions
  function googleAuthUser() {
    window.location.href = api.auth.googleAuthUser
  }

  function googleAuthEmployee() {
    window.location.href = api.auth.googleAuthEmployee
  }

  const value = {
    user,
    loading,
    error,
    loginUser,
    loginEmployee,
    registerUser,
    registerEmployee,
    logout,
    requestPasswordReset,
    resetPassword,
    isAdmin,
    googleAuthUser,
    googleAuthEmployee,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

// Hook for using auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
