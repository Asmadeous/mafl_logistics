"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { sendEmail, createEmailTemplate } from "@/lib/email"

// Initialize Supabase client with client-side credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return {
        success: true,
        message: "You are already subscribed to our newsletter.",
      }
    }

    // Insert new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

    if (error) {
      console.error("Error subscribing to newsletter:", error)
      return {
        success: false,
        message: "Failed to subscribe. Please try again later.",
      }
    }

    try {
      // Send confirmation email
      const confirmationHtml = createEmailTemplate(
        `
        <h2>Welcome to MAFL Logistics Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates about our services, industry news, and special offers.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>MAFL Logistics Team</p>
      `,
        "Newsletter Subscription Confirmation",
      )

      await sendEmail({
        to: email,
        subject: "Welcome to MAFL Logistics Newsletter",
        text: "Thank you for subscribing to our newsletter. You'll now receive updates about our services, industry news, and special offers.",
        html: confirmationHtml,
      })
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
      // Continue with success since we saved to database
    }

    revalidatePath("/")
    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
