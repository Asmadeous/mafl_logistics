"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/use-appointments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientAppointmentDialog } from "@/components/appointments/client-appointment-dialog"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { ConfirmDialog } from "@/components/appointments/confirm-dialog"
import { AppointmentDetailsPopup } from "@/components/appointments/appointment-details-popup"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { NotificationPlayer } from "@/components/notification-player"
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications"

export default function UserAppointmentsPage() {
  const { appointments, loading, error, createAppointment, updateAppointment, deleteAppointment } =
    useAppointments(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  const { playSound, handleSoundEnded } = useAppointmentNotifications(appointments || [], "user")

  // Handle appointment creation
  const handleCreateAppointment = async (data: any) => {
    try {
      await createAppointment(data)
      setIsDialogOpen(false)
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      })
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to create appointment:", error)
    }
  }

  // Handle appointment deletion
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return

    try {
      await deleteAppointment(selectedAppointment.id)
      setIsConfirmDialogOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your appointment. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to delete appointment:", error)
    }
  }

  // Handle appointment selection for details
  const handleSelectAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  // Handle appointment selection for deletion
  const handleSelectForDeletion = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsConfirmDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {playSound && <NotificationPlayer type="appointment" play={playSound} onEnded={handleSoundEnded} />}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading appointments</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>View and manage your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-3 w-[200px]" />
                      </div>
                      <div>
                        <Skeleton className="h-9 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AppointmentList
                  appointments={appointments}
                  onViewDetails={handleSelectAppointment}
                  onCancelAppointment={handleSelectForDeletion}
                  userType="user"
                />
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <AppointmentCalendar
                appointments={appointments}
                loading={loading}
                onSelectAppointment={handleSelectAppointment}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Appointment booking dialog */}
      <ClientAppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAppointment}
        userType="user"
      />

      {/* Appointment details popup */}
      {selectedAppointment && (
        <AppointmentDetailsPopup
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          appointment={selectedAppointment}
          onCancelAppointment={() => {
            setIsDetailsOpen(false)
            setIsConfirmDialogOpen(true)
          }}
          userType="user"
        />
      )}

      {/* Confirmation dialog for cancellation */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDeleteAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
      />
    </div>
  )
}
