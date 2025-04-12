import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-utils"

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, content } = await req.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a mock message
    const message = {
      id: `msg${Date.now()}`,
      senderId: "currentUser",
      receiverId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error: any) {
    console.error("Error in send message API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
