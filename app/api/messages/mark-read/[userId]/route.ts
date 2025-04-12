import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, getServerAdminClient } from "@/lib/server-utils"

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.id
    const otherUserId = params.userId

    // Use admin client (server-side only)
    const supabaseAdmin = getServerAdminClient()

    const { error } = await supabaseAdmin
      .from("user_messages")
      .update({ is_read: true })
      .eq("sender_id", otherUserId)
      .eq("receiver_id", currentUserId)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking conversation as read:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in mark read API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
