"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Appointment } from "@/types/appointment"

interface AppointmentDetailsPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment
  onCancelAppointment: () => void
  userType: "user" | "client" | "admin"
}

export function AppointmentDetailsPopup({
  open,
  onOpenChange,
  appointment,
  onCancelAppointment,
  userType,
}: AppointmentDetailsPopupProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a")
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

  // Check if appointment can be edited
  const canEdit = (appointment: Appointment) => {
    return ["pending", "confirmed"].includes(appointment.status) && userType === "admin"
  }

  // Check if appointment can be cancelled
  const canCancel = (appointment: Appointment) => {
    return ["pending", "confirmed"].includes(appointment.status)
  }

  const statusBadge = getStatusBadge(appointment.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>View the details of your scheduled appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{appointment.purpose}</h3>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Date and Time</p>
                <p className="text-muted-foreground">{formatDate(appointment.scheduled_at)}</p>
              </div>
            </div>

            {appointment.employee && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Staff Member</p>
                  <p className="text-muted-foreground">
                    {appointment.employee.full_name} - {appointment.employee.role}
                  </p>
                </div>
              </div>
            )}

            {userType === "admin" && appointment.client && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Client</p>
                  <p className="text-muted-foreground">
                    {appointment.client.company_name} ({appointment.client.email})
                  </p>
                </div>
              </div>
            )}

            {userType === "admin" && appointment.user && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">User</p>
                  <p className="text-muted-foreground">
                    {appointment.user.full_name} ({appointment.user.email})
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Purpose</p>
                <p className="text-muted-foreground">{appointment.purpose}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Booking Information</p>
                <p className="text-muted-foreground">
                  Booked on {format(new Date(appointment.created_at), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canCancel(appointment) && (
            <Button variant="destructive" onClick={onCancelAppointment}>
              Cancel Appointment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
