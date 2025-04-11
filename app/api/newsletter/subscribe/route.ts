import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address." }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to our newsletter.",
      })
    }

    // Insert new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

    if (error) {
      console.error("Error subscribing to newsletter:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to subscribe. Please try again later.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}
