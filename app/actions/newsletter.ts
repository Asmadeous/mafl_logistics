"use server"

import { z } from "zod"
import { api } from "@/lib/api"

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Validate email
    const validatedFields = newsletterSchema.parse({
      email: formData.get("email"),
    })

    // Submit to Rails API
    await api.newsletter.subscribe(validatedFields.email)

    // Return success
    return {
      success: true,
      message: "You've successfully subscribed to our newsletter!",
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid email address.",
      }
    }

    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    }
  }
}
