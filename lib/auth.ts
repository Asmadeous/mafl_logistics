import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

// Initialize Supabase client with client-side credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    // Server-side: Always create a new instance to avoid sharing between requests
    return createServerSupabaseClient()
  }

  if (supabaseInstance) return supabaseInstance

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided")
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return supabaseInstance
}

// For server-side operations
function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// User roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// Check if user is authenticated
export async function isAuthenticated() {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

// Check if user has admin role
export async function isAdmin() {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return false

  // Check user metadata for role
  const userRole = session.user?.user_metadata?.role
  return userRole === UserRole.ADMIN
}

// Redirect if not authenticated
export async function requireAuth(redirectTo = "/auth/login") {
  const isAuthed = await isAuthenticated()
  if (!isAuthed) {
    redirect(redirectTo)
  }
}

// Redirect if not admin
export async function requireAdmin(redirectTo = "/auth/login") {
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    redirect(redirectTo)
  }
}

// Sign out
export async function signOut() {
  const supabase = getSupabaseClient()
  await supabase.auth.signOut()
}
