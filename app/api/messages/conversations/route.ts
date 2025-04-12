import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-utils"

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return mock data
    return NextResponse.json({
      conversations: [
        {
          userId: "user1",
          userName: "John Doe",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userRole: "admin",
          lastMessage: "Hello, how can I help you today?",
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          unreadCount: 1,
        },
        {
          userId: "user2",
          userName: "Jane Smith",
          userAvatar: "/placeholder.svg?height=40&width=40",
          userRole: "user",
          lastMessage: "Thanks for your assistance!",
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          unreadCount: 0,
        },
      ],
      unreadTotal: 1,
    })
  } catch (error: any) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
