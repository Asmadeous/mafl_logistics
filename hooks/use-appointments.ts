"use client"

import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"
import type { Appointment } from "@/types/appointment"

export function useAppointments(isAdmin = false) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = isAdmin ? await api.appointments.adminGetAll() : await api.appointments.getAll()

      if (response.error) {
        setError(response.error)
        return
      }

      if (response.data) {
        setAppointments(response.data)
      }
    } catch (err) {
      setError("Failed to fetch appointments")
      console.error("Appointments fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  // Create appointment
  const createAppointment = useCallback(
    async (appointmentData: any) => {
      setLoading(true)
      setError(null)

      try {
        // Ensure the data structure matches the schema
        if (!appointmentData.appointment.employee_id && isAdmin) {
          setError("Employee ID is required")
          throw new Error("Employee ID is required")
        }

        if (!appointmentData.appointment.scheduled_at) {
          setError("Scheduled time is required")
          throw new Error("Scheduled time is required")
        }

        if (!appointmentData.appointment.purpose) {
          setError("Purpose is required")
          throw new Error("Purpose is required")
        }

        const response = await api.appointments.create(appointmentData)

        if (response.error) {
          setError(response.error)
          throw new Error(response.error)
        }

        if (response.data) {
          setAppointments((prev) => [...prev, response.data])
          return response.data
        }
      } catch (err) {
        setError("Failed to create appointment")
        console.error("Appointment creation error:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [isAdmin],
  )

  // Update appointment
  const updateAppointment = useCallback(
    async (id: string, appointmentData: any) => {
      setLoading(true)
      setError(null)

      try {
        // Ensure the data structure matches the schema
        if (appointmentData.appointment && !appointmentData.appointment.employee_id && isAdmin) {
          setError("Employee ID is required")
          throw new Error("Employee ID is required")
        }

        const response = await api.appointments.update(id, appointmentData)

        if (response.error) {
          setError(response.error)
          throw new Error(response.error)
        }

        if (response.data) {
          setAppointments((prev) => prev.map((appointment) => (appointment.id === id ? response.data : appointment)))
          return response.data
        }
      } catch (err) {
        setError("Failed to update appointment")
        console.error("Appointment update error:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [isAdmin],
  )

  // Delete appointment
  const deleteAppointment = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.appointments.delete(id)

      if (response.error) {
        setError(response.error)
        throw new Error(response.error)
      }

      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
      return true
    } catch (err) {
      setError("Failed to delete appointment")
      console.error("Appointment deletion error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  }
}
