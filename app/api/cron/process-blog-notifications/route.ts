import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Call the notification processing endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/blog/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ error: "Failed to run cron job" }, { status: 500 })
  }
}
