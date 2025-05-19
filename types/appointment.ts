export interface Appointment {
  id: string
  employee_id: string
  client_id?: string
  user_id?: string
  scheduled_at: string
  purpose: string
  status: string
  notes?: string
  duration?: number
  created_at: string
  updated_at: string
  employee?: {
    id: string
    full_name: string
    email: string
    role: string
  }
  client?: {
    id: string
    company_name: string
    email: string
    phone_number?: string
  }
  user?: {
    id: string
    full_name: string
    email: string
    phone_number?: string
  }
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

export interface AppointmentFormData {
  employee_id: string
  client_id?: string
  user_id?: string
  scheduled_at: string
  purpose: string
  notes?: string
  status?: AppointmentStatus
}
