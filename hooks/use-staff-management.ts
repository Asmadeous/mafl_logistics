"use client"

import { useState } from "react"
import api from "@/lib/api"
import type { Employee } from "@/types"
import { useToast } from "@/hooks/use-toast"

export function useStaffManagement() {
  const [staff, setStaff] = useState<Employee[]>([])
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchStaff = async (page = 1, query = "") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.staff.getAll(page, query)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setStaff(response.data.employees)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch staff"
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

  const fetchEmployee = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.staff.getById(id)

      if (response.error) {
        setError(response.error)
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      setEmployee(response.data.employee)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch employee"
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

  const createEmployee = async (employeeData: Partial<Employee>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.staff.create(employeeData)

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
        description: "Employee created successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create employee"
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

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.staff.update(id, employeeData)

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
        description: "Employee updated successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update employee"
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

  const deleteEmployee = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.staff.delete(id)

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
        description: "Employee deleted successfully",
      })
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete employee"
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
    staff,
    employee,
    isLoading,
    error,
    fetchStaff,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
