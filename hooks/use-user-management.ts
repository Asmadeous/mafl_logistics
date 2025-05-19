"use client"

import { useState } from "react"
import api from "@/lib/api"
import type { User } from "@/types"
import { useToast } from "@/hooks/use-toast"

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = async (page = 1, query = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.users.getAll(page, query)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setUsers(response.data.users)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUser = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.users.getById(id)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setUser(response.data.user)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (userData: Partial<User>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.users.create(userData)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Success",
        description: "User created successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create user"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.users.update(id, userData)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.users.delete(id)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    users,
    user,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
}
