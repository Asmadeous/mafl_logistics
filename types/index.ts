// User types
export type UserRole = "admin" | "staff" | "client" | "user"

export interface User {
  id: string
  full_name: string
  email: string
  phone_number?: string
  jti: string
  remember_me?: boolean
  created_at: string
  updated_at: string
}

// Employee types
export interface Employee {
  id: string
  full_name: string
  email: string
  phone_number?: string
  role: "admin" | "staff"
  jti: string
  remember_me?: boolean
  created_at: string
  updated_at: string
}

// Client types
export interface Client {
  id: string
  company_name: string
  email: string
  phone_number?: string
  address?: string
  billing_contact_name?: string
  billing_contact_email?: string
  billing_address?: string
  tax_id?: string
  service_type: string
  notes?: string
  employee_id: string
  jti: string
  remember_me?: boolean
  created_at: string
  updated_at: string
}

// Guest types
export interface Guest {
  id: string
  name: string
  email?: string
  token: string
  created_at: string
  updated_at: string
}

// Blog types
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  employee_id: string
  category_id?: string
  status: "draft" | "published"
  is_featured?: boolean
  published_at?: string
  created_at: string
  updated_at: string
  employee?: Employee
  category?: BlogCategory
  tags?: BlogTag[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface BlogPostTag {
  post_id: string
  tag_id: string
  created_at: string
  updated_at: string
}

// Appointment types
export interface Appointment {
  id: string
  employee_id: string
  client_id?: string
  user_id?: string
  scheduled_at: string
  purpose: string
  created_at: string
  updated_at: string
  employee?: Employee
  client?: Client
  user?: User
}

// Conversation and Message types
export interface Conversation {
  id: string
  user_id?: string
  client_id?: string
  guest_id?: string
  employee_id: string
  last_message_at?: string
  created_at: string
  updated_at: string
  user?: User
  client?: Client
  guest?: Guest
  employee: Employee
  messages?: Message[]
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: "User" | "Employee" | "Client" | "Guest"
  receiver_id: string
  receiver_type: "User" | "Employee" | "Client" | "Guest"
  content: string
  read: boolean
  created_at: string
  updated_at: string
}

// Job types
export interface JobListing {
  id: string
  employee_id: string
  title: string
  description: string
  department?: string
  location?: string
  employment_type?: string
  responsibilities?: string
  requirements?: string
  status: "draft" | "published" | "closed"
  created_at: string
  updated_at: string
  employee?: Employee
  applications?: JobApplication[]
}

export interface JobApplication {
  id: string
  job_listing_id: string
  applicant_type: "User" | "Guest"
  applicant_id: string
  reviewer_id?: string
  content: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  job_listing?: JobListing
  reviewer?: Employee
}

// Notification types
export interface Notification {
  id: number
  title: string
  message: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
  link?: string
  notifiable_id?: string
  notifiable_type?: string
  created_at: string
  updated_at: string
}
