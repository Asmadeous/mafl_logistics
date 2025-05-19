"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building, X, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Appointment } from "@/types/appointment"

interface AppointmentListProps {
  appointments: Appointment[]
  onViewDetails: (appointment: Appointment) => void
  onCancelAppointment: (appointment: Appointment) => void
  userType: "user" | "client" | "admin"
}

export function AppointmentList({ appointments, onViewDetails, onCancelAppointment, userType }: AppointmentListProps) {
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
  )

  // Format date
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy 'at' h:mm a")
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

  // Check if appointment can be cancelled
  const canCancel = (appointment: Appointment) => {
    return ["pending", "confirmed"].includes(appointment.status)
  }

  return (
    <div className="space-y-4">
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No appointments scheduled.</p>
          <p className="text-sm mt-2">Book an appointment to get started.</p>
        </div>
      ) : (
        sortedAppointments.map((appointment) => {
          const statusBadge = getStatusBadge(appointment.status)

          return (
            <div
              key={appointment.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{appointment.purpose}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatAppointmentDate(appointment.scheduled_at)}
                    </span>
                    {appointment.employee && (
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {appointment.employee.full_name}
                      </span>
                    )}
                    {userType === "admin" && appointment.client && (
                      <span className="flex items-center">
                        <Building className="mr-1 h-4 w-4" />
                        {appointment.client.company_name}
                      </span>
                    )}
                    {userType === "admin" && appointment.user && (
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {appointment.user.full_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                <div className="flex gap-2 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(appointment)} title="View Details">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
                  {canCancel(appointment) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancelAppointment(appointment)}
                      title="Cancel Appointment"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
