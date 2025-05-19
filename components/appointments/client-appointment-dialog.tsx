"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

interface ClientAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  defaultDate?: Date
  availableSlots: string[]
}

export function ClientAppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultDate = new Date(),
  availableSlots = [],
}: ClientAppointmentDialogProps) {
  const { isAuthenticated, userType, userData } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [purpose, setPurpose] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && userData) {
      if (userType === "user") {
        setName(userData.full_name || "")
        setEmail(userData.email || "")
        setPhone(userData.phone_number || "")
      } else if (userType === "client") {
        setName(userData.company_name || "")
        setEmail(userData.email || "")
        setPhone(userData.phone_number || "")
      }
    }
  }, [isAuthenticated, userData, userType])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedSlot(availableSlots.length > 0 ? availableSlots[0] : "")
      setPurpose("")
      setNotes("")
    }
  }, [open, availableSlots])

  const handleSubmit = () => {
    if (!selectedSlot || !purpose) {
      return
    }

    // Create a Date object with the selected date and time
    const scheduledAt = new Date(defaultDate)
    const [hours, minutes] = selectedSlot.split(":").map(Number)
    scheduledAt.setHours(hours, minutes, 0, 0)

    // Prepare appointment data according to the schema
    const appointmentData = {
      appointment: {
        scheduled_at: scheduledAt.toISOString(),
        purpose,
        notes,
        status: "pending",
      },
    }

    // Add client or user ID based on user type
    if (isAuthenticated) {
      if (userType === "client") {
        appointmentData.appointment.client_id = userData?.id
      } else if (userType === "user") {
        appointmentData.appointment.user_id = userData?.id
      }
    } else {
      // For non-authenticated users, include contact info
      appointmentData.appointment.contact_info = {
        name,
        email,
        phone,
      }
    }

    onSubmit(appointmentData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule your appointment for{" "}
            {defaultDate ? format(defaultDate, "MMMM d, yyyy") : "the selected date"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="time-slot">Time Slot</Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot}>
              <SelectTrigger id="time-slot">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => {
                  const [hours, minutes] = slot.split(":").map(Number)
                  const slotDate = new Date(defaultDate)
                  slotDate.setHours(hours, minutes, 0, 0)

                  return (
                    <SelectItem key={slot} value={slot}>
                      {format(slotDate, "h:mm a")}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Appointment</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Brief description of why you need this appointment"
              required
            />
          </div>

          {!isAuthenticated && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information you'd like to provide"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
