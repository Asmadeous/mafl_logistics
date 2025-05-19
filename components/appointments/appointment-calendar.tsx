"use client"

import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Appointment } from "@/types/appointment"
import { Skeleton } from "@/components/ui/skeleton"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  loading: boolean
  onSelectAppointment: (appointment: Appointment) => void
}

export function AppointmentCalendar({ appointments, loading, onSelectAppointment }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Group appointments by date
  const appointmentsByDate = appointments.reduce(
    (acc, appointment) => {
      const date = format(new Date(appointment.scheduled_at), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>,
  )

  // Get appointments for selected date
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return []
    const dateKey = format(date, "yyyy-MM-dd")
    return appointmentsByDate[dateKey] || []
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { variant: "outline" as const, label: "Pending" }
      case "confirmed":
        return { variant: "default" as const, label: "Confirmed" }
      case "completed":
        return { variant: "secondary" as const, label: "Completed" }
      case "cancelled":
        return { variant: "destructive" as const, label: "Cancelled" }
      default:
        return { variant: "outline" as const, label: status }
    }
  }

  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  // Get selected date appointments
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6">
      <Card>
        <CardContent className="p-4">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              appointment: Object.keys(appointmentsByDate).map((date) => new Date(date)),
            }}
            modifiersStyles={{
              appointment: {
                fontWeight: "bold",
                backgroundColor: "var(--primary-50)",
                borderColor: "var(--primary-200)",
              },
            }}
          />
        </CardContent>
      </Card>

      <div>
        <h3 className="font-medium mb-3">{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : selectedDateAppointments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No appointments scheduled for this date.</p>
        ) : (
          <div className="space-y-3">
            {selectedDateAppointments.map((appointment) => {
              const statusBadge = getStatusBadge(appointment.status)

              return (
                <div
                  key={appointment.id}
                  className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectAppointment(appointment)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium truncate">{appointment.purpose}</p>
                    <Badge variant={statusBadge.variant} className="ml-2 whitespace-nowrap">
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatTime(appointment.scheduled_at)}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
