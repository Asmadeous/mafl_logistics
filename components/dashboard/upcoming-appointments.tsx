import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Appointment {
  id: string
  title: string
  clientName: string
  clientEmail: string
  clientPhone: string
  scheduledAt: string
  duration: number
  status: string
  notes: string
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
  loading: boolean
}

export function UpcomingAppointments({ appointments, loading }: UpcomingAppointmentsProps) {
  // Sort appointments by date (closest first)
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled meetings and consultations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/admin/appointments/new">Schedule New Appointment</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.scheduledAt)
              const formattedDate = format(appointmentDate, "MMMM d, yyyy")
              const formattedTime = format(appointmentDate, "h:mm a")

              return (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{appointment.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4 mr-1" />
                          <span>{appointment.clientName}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {formattedTime} ({appointment.duration} min)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/admin/appointments/${appointment.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex justify-center mt-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/appointments">View All Appointments</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
