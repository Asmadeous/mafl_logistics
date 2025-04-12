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
      notifications: [
        {
          id: "1",
          user_id: "current_user",
          title: "Welcome to MAFL Logistics",
          message: "Thank you for joining our platform. We're excited to have you on board!",
          type: "info",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_id: "current_user",
          title: "Complete your profile",
          message: "Add more information to your profile to help us serve you better.",
          type: "info",
          link: "/profile",
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
      ],
    })
  } catch (error: any) {
    console.error("Error in notifications API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
