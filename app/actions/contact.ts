"use server"

import { z } from "zod"
import { api } from "@/lib/api"

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = contactFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      message: formData.get("message"),
    })

    // Submit to Rails API
    const response = await api.contact.submit(validatedFields)

    // Return success
    return {
      success: true,
      message: "Your message has been sent. We'll get back to you soon!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed. Please check your inputs.",
        errors: error.errors,
      }
    }

    return {
      success: false,
      message: "Failed to submit the form. Please try again later.",
    }
  }
}
