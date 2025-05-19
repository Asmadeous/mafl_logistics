"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { addMinutes, isAfter, isBefore } from "date-fns"
import type { Appointment } from "@/types/appointment"

export function useAppointmentNotifications(appointments: Appointment[], userType: "admin" | "client" | "user") {
  const { toast } = useToast()
  const [notifiedAppointments, setNotifiedAppointments] = useState<Set<string>>(new Set())
  const [startingAppointments, setStartingAppointments] = useState<Set<string>>(new Set())
  const [playSound, setPlaySound] = useState(false)

  useEffect(() => {
    // Check for upcoming appointments every minute
    const checkInterval = setInterval(() => {
      const now = new Date()

      appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.scheduled_at)
        const thirtyMinutesBefore = addMinutes(appointmentDate, -30)

        // Check if appointment is 30 minutes away and not already notified
        if (
          isAfter(now, thirtyMinutesBefore) &&
          isBefore(now, appointmentDate) &&
          !notifiedAppointments.has(appointment.id)
        ) {
          // Play notification sound
          setPlaySound(true)

          // Show toast notification
          toast({
            title: "Upcoming Appointment",
            description: `You have an appointment for "${appointment.purpose}" in 30 minutes.`,
            duration: 10000,
          })

          // Mark as notified
          setNotifiedAppointments((prev) => new Set([...prev, appointment.id]))
        }

        // Check if appointment is starting now and not already notified
        if (
          isAfter(now, appointmentDate) &&
          isBefore(now, addMinutes(appointmentDate, 5)) &&
          !startingAppointments.has(appointment.id)
        ) {
          // Play notification sound
          setPlaySound(true)

          // Show toast notification
          toast({
            title: "Appointment Starting",
            description: `Your appointment for "${appointment.purpose}" is starting now.`,
            duration: 10000,
          })

          // Mark as notified
          setStartingAppointments((prev) => new Set([...prev, appointment.id]))
        }
      })
    }, 60000) // Check every minute

    return () => {
      clearInterval(checkInterval)
    }
  }, [appointments, toast, notifiedAppointments, startingAppointments])

  const handleSoundEnded = () => {
    setPlaySound(false)
  }

  return { playSound, handleSoundEnded }
}
