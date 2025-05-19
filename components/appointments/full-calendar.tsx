"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns"
import type { Appointment } from "@/types/appointment"
import { AppointmentDetailsPopup } from "./appointment-details-popup"

interface FullCalendarProps {
  appointments: Appointment[]
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
  userType: "admin" | "client" | "user"
}

export function FullCalendar({ appointments, onEdit, onDelete, userType }: FullCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous and next month to fill the calendar grid
  const startDay = monthStart.getDay() // 0 = Sunday, 1 = Monday, etc.
  const endDay = monthEnd.getDay()

  // Previous month days to display
  const prevMonthDays =
    startDay > 0
      ? eachDayOfInterval({
          start: new Date(monthStart.getFullYear(), monthStart.getMonth(), -startDay + 1),
          end: new Date(monthStart.getFullYear(), monthStart.getMonth(), 0),
        })
      : []

  // Next month days to display
  const nextMonthDays =
    6 - endDay > 0
      ? eachDayOfInterval({
          start: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1),
          end: new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 6 - endDay),
        })
      : []

  // All days to display in the calendar
  const calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.scheduled_at)
      return isSameDay(appointmentDate, day)
    })
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  // Determine appointment status color
  const getAppointmentStatusColor = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.scheduled_at)
    const now = new Date()

    // Status-based coloring
    switch (appointment.status) {
      case "completed":
        return "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
      case "confirmed":
        return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
      case "pending":
        // If appointment is in the past but still pending
        if (appointmentDate < now) {
          return "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
        }
        // Future pending appointments
        return "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-center font-medium border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day, i) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)

              return (
                <div
                  key={i}
                  className={`min-h-[120px] border-r border-b last:border-r-0 p-1 ${
                    !isCurrentMonth ? "bg-muted/20 text-muted-foreground" : ""
                  } ${isToday(day) ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday(day) ? "text-blue-600 dark:text-blue-400" : ""}`}>
                      {format(day, "d")}
                    </span>
                    {isToday(day) && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className={`text-xs p-1 rounded border cursor-pointer truncate ${getAppointmentStatusColor(appointment)}`}
                      >
                        <div className="font-medium truncate">
                          {format(new Date(appointment.scheduled_at), "h:mm a")}
                        </div>
                        <div className="truncate">{appointment.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5" />
          <span>Active</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5" />
          <span>Upcoming</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1.5" />
          <span>Missed</span>
        </div>
      </div>

      <AppointmentDetailsPopup
        appointment={selectedAppointment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        userType={userType}
      />
    </div>
  )
}
