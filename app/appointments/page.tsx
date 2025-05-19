"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/use-appointments"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from "date-fns"
import { ClientAppointmentDialog } from "@/components/appointments/client-appointment-dialog"
import { useToast } from "@/hooks/use-toast"

export default function BookAppointmentPage() {
  const { toast } = useToast()
  const { appointments, loading, error, createAppointment } = useAppointments(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  // Business hours (9 AM to 5 PM)
  const businessHours = {
    start: 9,
    end: 17,
  }

  // Get dates with appointments for highlighting in calendar
  const datesWithAppointments = appointments.map((appointment) => new Date(appointment.scheduledAt))

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return true
    }

    // Disable dates more than 30 days in the future
    if (isAfter(date, addDays(new Date(), 30))) {
      return true
    }

    return false
  }

  // Function to generate available time slots for the selected date
  const generateAvailableSlots = (date: Date) => {
    if (!date) return []

    const slots: string[] = []
    const bookedSlots = appointments
      .filter((appointment) => isSameDay(new Date(appointment.scheduled_at), date))
      .map((appointment) => {
        const startTime = new Date(appointment.scheduled_at)
        const endTime = new Date(startTime.getTime() + (appointment.duration || 60) * 60000)
        return {
          start: startTime.getHours() * 60 + startTime.getMinutes(),
          end: endTime.getHours() * 60 + endTime.getMinutes(),
        }
      })

    // Generate slots in 30-minute increments
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = hour * 60 + minute
        const slotEnd = slotStart + 60 // Default 1-hour appointment

        // Check if slot overlaps with any booked appointment
        const isOverlapping = bookedSlots.some((bookedSlot) => slotStart < bookedSlot.end && slotEnd > bookedSlot.start)

        if (!isOverlapping) {
          const formattedHour = hour.toString().padStart(2, "0")
          const formattedMinute = minute.toString().padStart(2, "0")
          slots.push(`${formattedHour}:${formattedMinute}`)
        }
      }
    }

    return slots
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const slots = generateAvailableSlots(date)
      setAvailableSlots(slots)
    } else {
      setAvailableSlots([])
    }
  }

  // Handle appointment booking
  const handleBookAppointment = async (data: any) => {
    try {
      await createAppointment(data)
      setIsBookingDialogOpen(false)
      toast({
        title: "Appointment booked",
        description: "Your appointment has been successfully booked.",
      })

      // Refresh available slots
      if (selectedDate) {
        const slots = generateAvailableSlots(selectedDate)
        setAvailableSlots(slots)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a date and time to schedule your logistics consultation
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select a Date</CardTitle>
            <CardDescription>Choose an available date for your appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              disabled={isDateDisabled}
              modifiers={{
                booked: datesWithAppointments,
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
            <CardDescription>
              {selectedDate
                ? `Select a time slot for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Please select a date first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading available slots...</p>
              </div>
            ) : !selectedDate ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please select a date to see available time slots</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No available slots for the selected date</p>
                <Button className="mt-4" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                  Check Next Day
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot) => {
                  const [hours, minutes] = slot.split(":").map(Number)
                  const slotDate = new Date(selectedDate)
                  slotDate.setHours(hours, minutes, 0, 0)

                  return (
                    <Button
                      key={slot}
                      variant="outline"
                      onClick={() => {
                        setIsBookingDialogOpen(true)
                      }}
                    >
                      {format(slotDate, "h:mm a")}
                    </Button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <ClientAppointmentDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        onSubmit={handleBookAppointment}
        defaultDate={selectedDate}
        availableSlots={availableSlots}
      />
    </div>
  )
}
