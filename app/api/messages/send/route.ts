import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, getServerAdminClient } from "@/lib/server-utils"

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const senderId = session.user.id
    const { receiverId, content } = await req.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use admin client (server-side only)
    const supabaseAdmin = getServerAdminClient()

    const { data, error } = await supabaseAdmin
      .from("user_messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .select()

    if (error) {
      console.error("Error sending message:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: data[0],
    })
  } catch (error: any) {
    console.error("Error in send message API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
