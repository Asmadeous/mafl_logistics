import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-utils"

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId

    // Return mock messages based on userId
    let messages = []

    if (userId === "user1") {
      messages = [
        {
          id: "msg1",
          senderId: "currentUser",
          receiverId: "user1",
          content: "Hi there, how can I help you with your logistics needs?",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          id: "msg2",
          senderId: "user1",
          receiverId: "currentUser",
          content: "Hello, I'm looking for information about your cross-border services.",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: "msg3",
          senderId: "user1",
          receiverId: "currentUser",
          content: "Do you provide services to Rwanda?",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ]
    } else if (userId === "user2") {
      messages = [
        {
          id: "msg4",
          senderId: "user2",
          receiverId: "currentUser",
          content: "Hi, I need a quote for heavy machinery transport.",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        {
          id: "msg5",
          senderId: "currentUser",
          receiverId: "user2",
          content: "I'd be happy to help with that. Could you provide more details about the machinery?",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
        },
        {
          id: "msg6",
          senderId: "user2",
          receiverId: "currentUser",
          content: "Thanks for your assistance!",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
      ]
    }

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error("Error in conversation messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
