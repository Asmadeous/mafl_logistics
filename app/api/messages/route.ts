import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-utils"

export async function GET(request: Request) {
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
      messages: [
        {
          id: "1",
          sender_id: "user1",
          receiver_id: "current_user",
          content: "Hello, how can I help you today?",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          sender_id: "current_user",
          receiver_id: "user1",
          content: "I have a question about your services.",
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
      ],
    })
  } catch (error: any) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Return mock response
    return NextResponse.json({
      success: true,
      message: {
        id: Math.random().toString(36).substring(7),
        sender_id: "current_user",
        receiver_id: body.receiver_id,
        content: body.content,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
