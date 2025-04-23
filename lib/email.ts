import { Resend } from "resend"

// Initialize Resend with API key - with proper error handling
let resend: Resend | null = null

try {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY environment variable is not set. Email functionality will be disabled.")
  } else {
    resend = new Resend(resendApiKey)
  }
} catch (error) {
  console.error("Failed to initialize Resend:", error)
}

type EmailParams = {
  to: string | string[]
  subject: string
  text: string
  html?: string
  from?: string
  replyTo?: string
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = "MAFL Logistics <no-reply@mafllogistics.com>",
  replyTo,
}: EmailParams) {
  try {
    // Check if Resend is properly initialized
    if (!resend) {
      console.warn("Resend is not initialized. Email will not be sent.")
      return {
        success: false,
        error: new Error("Email service is not configured properly."),
      }
    }

    // Convert to array if single email
    const toEmails = Array.isArray(to) ? to : [to]

    const { data, error } = await resend.emails.send({
      from,
      to: toEmails,
      subject,
      text,
      html: html || text,
      replyTo: replyTo,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

// Helper function to create a simple HTML email template
export function createEmailTemplate(content: string, title = "MAFL Logistics") {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #F59E0B;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MAFL Logistics</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MAFL Logistics. All rights reserved.<br>
          Malili, Konza, Kenya
        </div>
      </body>
    </html>
  `
}
