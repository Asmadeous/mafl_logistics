"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/use-appointments"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, List, CalendarIcon } from "lucide-react"
import { AppointmentDialog } from "@/components/appointments/appointment-dialog"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { FullCalendar } from "@/components/appointments/full-calendar"
import { ConfirmDialog } from "@/components/appointments/confirm-dialog"
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications"
import { useToast } from "@/hooks/use-toast"
import type { Appointment } from "@/types/appointment"

export default function AppointmentsPage() {
  const { toast } = useToast()
  const { appointments, loading, error, createAppointment, updateAppointment, deleteAppointment } =
    useAppointments(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")

  // Initialize appointment notifications
  useAppointmentNotifications(appointments, "admin")

  // Mock data for employees, clients, and users
  const [employees, setEmployees] = useState([
    {
      id: "1",
      full_name: "Mahdi M. Issack",
      email: "mahdi@mafl.com",
      role: "admin",
    },
    {
      id: "2",
      full_name: "Sarah Kimani",
      email: "sarah@mafl.com",
      role: "staff",
    },
  ])

  const [clients, setClients] = useState([
    {
      id: "1",
      company_name: "Softcare Ltd",
      email: "john@softcare.co.ke",
      phone_number: "+254712345678",
    },
    {
      id: "2",
      company_name: "Malimount Enterprises",
      email: "info@malimount.com",
      phone_number: "+254723456789",
    },
  ])

  const [users, setUsers] = useState([
    {
      id: "1",
      full_name: "Jane Wanjiku",
      email: "jane.wanjiku@gmail.com",
      phone_number: "+254745678901",
    },
    {
      id: "2",
      full_name: "Michael Otieno",
      email: "michael.o@yahoo.com",
      phone_number: "+254756789012",
    },
  ])

  // Handle appointment creation
  const handleCreateAppointment = async (data: any) => {
    try {
      // Ensure employee_id is set
      if (!data.appointment.employee_id) {
        data.appointment.employee_id = employees[0]?.id
      }

      await createAppointment(data)
      setIsCreateDialogOpen(false)
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle appointment update
  const handleUpdateAppointment = async (data: any) => {
    try {
      // Ensure employee_id is set
      if (!data.appointment.employee_id) {
        data.appointment.employee_id = selectedAppointment?.employee_id || employees[0]?.id
      }

      await updateAppointment(selectedAppointment!.id, data)
      setIsEditDialogOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle appointment deletion
  const handleDeleteAppointment = async () => {
    try {
      await deleteAppointment(selectedAppointment!.id)
      setIsDeleteDialogOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been successfully cancelled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Open edit dialog with selected appointment
  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditDialogOpen(true)
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Appointment Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView(view === "calendar" ? "list" : "calendar")}>
            {view === "calendar" ? <List className="mr-2 h-4 w-4" /> : <CalendarIcon className="mr-2 h-4 w-4" />}
            {view === "calendar" ? "List View" : "Calendar View"}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Tabs defaultValue={view} value={view} onValueChange={(value) => setView(value as "calendar" | "list")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading appointments...</p>
            </div>
          ) : (
            <FullCalendar
              appointments={appointments}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              userType="admin"
            />
          )}
        </TabsContent>

        <TabsContent value="list">
          <AppointmentList
            appointments={appointments}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Create Appointment Dialog */}
      <AppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAppointment}
        defaultDate={new Date()}
        employees={employees}
        clients={clients}
        users={users}
      />

      {/* Edit Appointment Dialog */}
      {selectedAppointment && (
        <AppointmentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateAppointment}
          appointment={selectedAppointment}
          mode="edit"
          employees={employees}
          clients={clients}
          users={users}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
      />
    </div>
  )
}
