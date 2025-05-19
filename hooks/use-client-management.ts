"use client"

import { useState } from "react"
import api from "@/lib/api"
import type { Client } from "@/types"
import { useToast } from "@/hooks/use-toast"

export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchClients = async (page = 1, query = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.clients.getAll(page, query)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setClients(response.data.clients)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch clients"
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

  const fetchClient = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.clients.getById(id)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setClient(response.data.client)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch client"
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

  const createClient = async (clientData: Partial<Client>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.clients.create(clientData)

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
        description: "Client created successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create client"
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

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.clients.update(id, clientData)

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
        description: "Client updated successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update client"
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

  const deleteClient = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.clients.delete(id)

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
        description: "Client deleted successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete client"
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
    clients,
    client,
    isLoading,
    error,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
  }
}
