import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a server-side Supabase client with the service role key
const createAdminClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: Request) {
  try {
    // Get the user's session to verify authentication
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use the user's ID from the session
    const userId = session.user.id

    // Use admin client for operations that might be restricted by RLS
    const adminClient = createAdminClient()

    // Get notifications for the user
    const { data: notifications, error } = await adminClient
      .from("user_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notifications:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notifications })
  } catch (error: any) {
    console.error("Error in notifications API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get the user's session to verify authentication
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const userRole = session.user.user_metadata?.role
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 })
    }

    // Get request body
    const { userId, title, message, type = "info", link } = await request.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use admin client for operations that might be restricted by RLS
    const adminClient = createAdminClient()

    // Insert the notification
    const { data, error } = await adminClient
      .from("user_notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
      })
      .select()

    if (error) {
      console.error("Error creating notification:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notification: data[0] })
  } catch (error: any) {
    console.error("Error in notifications API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
