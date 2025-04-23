import { NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail, createEmailTemplate } from "@/lib/email"

// Define schema for request validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedFields = contactFormSchema.parse(body)

    // Forward the request to the Rails API
    const response = await fetch(`${process.env.RAILS_API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact: validatedFields }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Failed to submit contact form" },
        { status: response.status },
      )
    }

    // Send notification email to admin
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedFields.name}</p>
      <p><strong>Email:</strong> ${validatedFields.email}</p>
      <p><strong>Phone:</strong> ${validatedFields.phone || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${validatedFields.message}</p>
    `

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "maishaagrofarmlimited@gmail.com",
      subject: "New Contact Form Submission - MAFL Logistics",
      text: `New contact from ${validatedFields.name} (${validatedFields.email})`,
      html: createEmailTemplate(adminEmailContent),
    })

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Thank You for Contacting MAFL Logistics</h2>
      <p>Dear ${validatedFields.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <p><em>${validatedFields.message}</em></p>
      <p>Best regards,<br>MAFL Logistics Team</p>
    `

    await sendEmail({
      to: validatedFields.email,
      subject: "Thank You for Contacting MAFL Logistics",
      text: `Thank you for contacting MAFL Logistics. We have received your message and will get back to you soon.`,
      html: createEmailTemplate(userEmailContent),
      replyTo: "maishaagrofarmlimited@gmail.com",
    })

    // Return success response
    return NextResponse.json({ message: "Your message has been sent. We'll get back to you soon!" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed. Please check your inputs.", errors: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ message: "Failed to submit the form. Please try again later." }, { status: 500 })
  }
}
