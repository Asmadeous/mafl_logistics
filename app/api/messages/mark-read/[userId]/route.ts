import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-utils"

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify user is authenticated
    const {
      data: { session },
    } = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Just return success since we're using mock data
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in mark read API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
