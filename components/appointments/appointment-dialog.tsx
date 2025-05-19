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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  appointment?: Appointment
  defaultDate?: Date
  mode?: "create" | "edit"
  employees?: any[]
  clients?: any[]
  users?: any[]
}

export function AppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  appointment,
  defaultDate = new Date(),
  mode = "create",
  employees = [],
  clients = [],
  users = [],
}: AppointmentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate)
  const [time, setTime] = useState<string>("09:00")
  const [duration, setDuration] = useState<number>(60)
  const [purpose, setPurpose] = useState<string>("")
  const [employeeId, setEmployeeId] = useState<string>("")
  const [clientId, setClientId] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [appointmentType, setAppointmentType] = useState<"client" | "user">("client")
  const [notes, setNotes] = useState<string>("")

  // Initialize form with appointment data if in edit mode
  useEffect(() => {
    if (appointment && mode === "edit") {
      const appointmentDate = new Date(appointment.scheduledAt)
      setDate(appointmentDate)
      setTime(format(appointmentDate, "HH:mm"))
      setDuration(appointment.duration || 60)
      setPurpose(appointment.purpose || "")
      setEmployeeId(appointment.employeeId || "")

      if (appointment.clientId) {
        setAppointmentType("client")
        setClientId(appointment.clientId)
      } else if (appointment.userId) {
        setAppointmentType("user")
        setUserId(appointment.userId)
      }

      setNotes(appointment.notes || "")
    } else {
      // Reset form for create mode
      setDate(defaultDate)
      setTime("09:00")
      setDuration(60)
      setPurpose("")
      setEmployeeId(employees.length > 0 ? employees[0].id : "")
      setClientId("")
      setUserId("")
      setNotes("")
    }
  }, [appointment, mode, defaultDate, employees])

  const handleSubmit = () => {
    if (!date || !time || !purpose || !employeeId) {
      return
    }

    // Parse time string to create a Date object with the selected time
    const scheduledAt = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    scheduledAt.setHours(hours, minutes, 0, 0)

    // Prepare appointment data according to the schema
    const appointmentData = {
      appointment: {
        employee_id: employeeId,
        scheduled_at: scheduledAt.toISOString(),
        purpose,
        notes,
        status: mode === "create" ? "pending" : appointment?.status || "pending",
      },
    }

    // Add client or user ID based on appointment type
    if (appointmentType === "client" && clientId) {
      appointmentData.appointment.client_id = clientId
    } else if (appointmentType === "user" && userId) {
      appointmentData.appointment.user_id = userId
    }

    onSubmit(appointmentData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Appointment" : "Edit Appointment"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Schedule a new appointment with a client or user."
              : "Update the details of this appointment."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Appointment With</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="client-type"
                  checked={appointmentType === "client"}
                  onChange={() => setAppointmentType("client")}
                  className="h-4 w-4 text-primary"
                />
                <Label htmlFor="client-type" className="text-sm">
                  Client
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="user-type"
                  checked={appointmentType === "user"}
                  onChange={() => setAppointmentType("user")}
                  className="h-4 w-4 text-primary"
                />
                <Label htmlFor="user-type" className="text-sm">
                  User
                </Label>
              </div>
            </div>
          </div>

          {appointmentType === "client" ? (
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Brief description of the appointment purpose"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details or notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {mode === "create" ? "Create Appointment" : "Update Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
