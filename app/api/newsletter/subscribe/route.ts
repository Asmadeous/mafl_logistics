import { NextResponse } from "next/server"
import { z } from "zod"

// Define schema for request validation
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    // Forward the request to the Rails API
    const response = await fetch(`${process.env.RAILS_API_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscriber: { email } }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ message: errorData.message || "Failed to subscribe" }, { status: response.status })
    }

    // Return success response
    return NextResponse.json({ message: "You've successfully subscribed to our newsletter!" }, { status: 200 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ message: "Failed to subscribe. Please try again later." }, { status: 500 })
  }
}
