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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const messageId = params.id

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

    // First check if the message exists and belongs to the user
    const { data: message, error: fetchError } = await adminClient
      .from("user_messages")
      .select("*")
      .eq("id", messageId)
      .eq("receiver_id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching message:", fetchError)
      return NextResponse.json({ error: "Message not found or access denied" }, { status: 404 })
    }

    // Mark the message as read
    const { error: updateError } = await adminClient
      .from("user_messages")
      .update({ is_read: true })
      .eq("id", messageId)
      .eq("receiver_id", userId)

    if (updateError) {
      console.error("Error marking message as read:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in mark message as read API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
