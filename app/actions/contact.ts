"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { sendEmail, createEmailTemplate } from "@/lib/email"
import { urls } from "@/config/urls"

// Initialize Supabase client with client-side credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = (formData.get("phone") as string) || "Not provided"
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Insert contact message into database
    const { error: dbError } = await supabase.from("contact_messages").insert([{ name, email, phone, message }])

    if (dbError) {
      console.error("Error submitting contact form:", dbError)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      }
    }

    // Create email content
    const emailText = `
      New contact form submission:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      
      Message:
      ${message}
    `

    const emailHtml = createEmailTemplate(
      `
      <h2>New Contact Form Submission</h2>
      <p>You have received a new message from your website contact form.</p>
      
      <h3>Contact Details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
      "New Contact Form Submission",
    )

    try {
      // Send email to company
      const emailResult = await sendEmail({
        to: urls.contact.email,
        subject: `New Contact Form Submission from ${name}`,
        text: emailText,
        html: emailHtml,
        replyTo: email,
      })

      if (!emailResult.success) {
        console.error("Error sending notification email:", emailResult.error)
      }

      // Send confirmation email to user
      const confirmationHtml = createEmailTemplate(
        `
        <h2>Thank you for contacting MAFL Logistics</h2>
        <p>Hello ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <h3>Your Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
        
        <p>If you have any urgent inquiries, please call us at ${urls.contact.phone}.</p>
        <p>Best regards,<br>MAFL Logistics Team</p>
      `,
        "We've Received Your Message",
      )

      await sendEmail({
        to: email,
        subject: "Thank you for contacting MAFL Logistics",
        text: `Thank you for contacting MAFL Logistics. We have received your message and will get back to you as soon as possible.`,
        html: confirmationHtml,
      })
    } catch (emailError) {
      console.error("Error in email sending process:", emailError)
      // Continue with success since we saved to database
    }

    revalidatePath("/")
    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
