import { type NextRequest, NextResponse } from "next/server"
import { getServerSession, getServerAdminClient } from "@/lib/server-utils"

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Use admin client (server-side only)
    const supabaseAdmin = getServerAdminClient()

    // Get all messages to/from the current user
    const { data: messagesData, error: messagesError } = await supabaseAdmin
      .from("user_messages")
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        is_read,
        created_at
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    // Group messages by conversation
    const conversationMap: Record<
      string,
      {
        userId: string
        lastMessage: string
        lastMessageTime: string
        unreadCount: number
      }
    > = {}

    messagesData.forEach((message) => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id

      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = {
          userId: otherUserId,
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unreadCount: message.receiver_id === userId && !message.is_read ? 1 : 0,
        }
      } else if (message.receiver_id === userId && !message.is_read) {
        conversationMap[otherUserId].unreadCount++
      }
    })

    // Get user details for each conversation
    const userIds = Object.keys(conversationMap)
    let conversationsList = []

    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabaseAdmin
        .from("profiles")
        .select("id, name, avatar_url, role")
        .in("id", userIds)

      if (usersError) {
        console.error("Error fetching user profiles:", usersError)
        return NextResponse.json({ error: usersError.message }, { status: 500 })
      }

      // Map user details to conversations
      conversationsList = userIds
        .map((id) => {
          const userDetails = usersData.find((u) => u.id === id)
          return {
            userId: id,
            userName: userDetails?.name || "Unknown User",
            userRole: userDetails?.role,
            userAvatar: userDetails?.avatar_url,
            lastMessage: conversationMap[id].lastMessage,
            lastMessageTime: conversationMap[id].lastMessageTime,
            unreadCount: conversationMap[id].unreadCount,
          }
        })
        .sort((a, b) => {
          return new Date(b.lastMessageTime || "").getTime() - new Date(a.lastMessageTime || "").getTime()
        })
    }

    // Calculate total unread messages
    const unreadTotal = conversationsList.reduce((sum, conv) => sum + conv.unreadCount, 0)

    return NextResponse.json({
      conversations: conversationsList,
      unreadTotal,
    })
  } catch (error: any) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
