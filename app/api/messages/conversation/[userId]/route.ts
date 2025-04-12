import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, getServerAdminClient } from "@/lib/server-utils"

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
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

    const { data, error } = await supabaseAdmin
      .from("user_messages")
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        is_read,
        created_at
      `)
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`,
      )
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching conversation messages:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formattedMessages = data.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      isRead: msg.is_read,
      createdAt: msg.created_at,
    }))

    // Mark unread messages as read
    const unreadIds = data.filter((msg) => msg.receiver_id === currentUserId && !msg.is_read).map((msg) => msg.id)

    if (unreadIds.length > 0) {
      await supabaseAdmin.from("user_messages").update({ is_read: true }).in("id", unreadIds)
    }

    return NextResponse.json({ messages: formattedMessages })
  } catch (error: any) {
    console.error("Error in conversation messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
