import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendEmail, createEmailTemplate } from "@/lib/email"

// Initialize Supabase client with client-side credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    // Get unprocessed notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from("blog_notification_queue")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true })
      .limit(10)

    if (notificationsError) throw notificationsError

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ message: "No notifications to process" })
    }

    // Process each notification
    for (const notification of notifications) {
      try {
        // Get the blog post details
        const { data: post, error: postError } = await supabase
          .from("blog_posts")
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            author_name,
            published_at,
            blog_categories(name)
          `)
          .eq("id", notification.post_id)
          .single()

        if (postError) throw postError

        // Get all newsletter subscribers
        const { data: subscribers, error: subscribersError } = await supabase
          .from("newsletter_subscribers")
          .select("email")
          .eq("status", "active")

        if (subscribersError) throw subscribersError

        if (subscribers && subscribers.length > 0) {
          // Create email content
          const emailSubject = `New Blog Post: ${post.title}`

          const emailHtml = createEmailTemplate(
            `
            <h2>New Blog Post: ${post.title}</h2>
            <p>We've just published a new article that we thought you might be interested in.</p>
            
            <div style="margin: 20px 0;">
              <img src="${post.featured_image || "https://via.placeholder.com/600x300"}" alt="${post.title}" style="max-width: 100%; height: auto; border-radius: 5px;">
            </div>
            
            <h3>${post.title}</h3>
            <p>${post.excerpt || "Click to read the full article."}</p>
            
            <p>Category: ${post.blog_categories?.name || "Uncategorized"}</p>
            <p>Published: ${new Date(post.published_at).toLocaleDateString()}</p>
            
            <div style="margin: 25px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://mafllogistics.com"}/blog/${post.slug}" style="background-color: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Full Article</a>
            </div>
            
            <p>Thank you for subscribing to our newsletter!</p>
          `,
            "New Blog Post",
          )

          // Send email to all subscribers (in batches to avoid rate limits)
          const batchSize = 50
          for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize)
            const emails = batch.map((sub) => sub.email)

            await sendEmail({
              to: emails,
              subject: emailSubject,
              text: `New Blog Post: ${post.title}\n\nRead it here: ${process.env.NEXT_PUBLIC_SITE_URL || "https://mafllogistics.com"}/blog/${post.slug}`,
              html: emailHtml,
            })
          }
        }

        // Mark notification as processed
        await supabase
          .from("blog_notification_queue")
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
          })
          .eq("id", notification.id)
      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error)
        // Continue with next notification
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${notifications.length} notifications`,
    })
  } catch (error) {
    console.error("Error in blog notification processing:", error)
    return NextResponse.json({ error: "Failed to process blog notifications" }, { status: 500 })
  }
}
