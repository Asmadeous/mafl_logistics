"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon, Clock, Share2, User } from "lucide-react"
import { format } from "date-fns"
import { api } from "@/lib/api"

// Loading component for Suspense
function BlogPostSkeleton() {
  return (
    <div className="pt-24 pb-16 animate-pulse">
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-[300px] md:h-[500px] w-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
  )
}

async function getBlogPost(slug: string) {
  try {
    return await api.blog.getPost(slug)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getRelatedPosts(categoryId: string, currentPostId: string) {
  try {
    return await api.blog.getRelatedPosts(categoryId, currentPostId)
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent slug={params.slug} />
    </Suspense>
  )
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category_id, post.id)

  // Format the date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy")
  }

  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const readingTime = calculateReadingTime(post.content)

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-mafl-orange mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{readingTime} min read</span>
              </div>
              <Link href={`/blog/category/${post.category.slug}`}>
                <Badge variant="outline" className="bg-muted/50">
                  {post.category.name}
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative h-[300px] md:h-[500px] w-full">
        <Image
          src={post.featured_image || "/placeholder.svg?height=500&width=1200"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Blog Content */}
      <section className="py-12 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <article className="prose dark:prose-invert prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Tags:</span>
                  {post.tags.map((tag: any) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                      <Badge variant="outline" className="bg-muted/50">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-4">Share this article:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}&text=${encodeURIComponent(post.title)}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}&title=${encodeURIComponent(post.title)}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)
                        alert("Link copied to clipboard!")
                      }}
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Copy link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              {/* Author Info */}
              <div className="bg-muted/30 p-6 rounded-lg mb-8">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={post.author_image || "/placeholder.svg?height=100&width=100"}
                      alt={post.author_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{post.author_name}</h3>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  MAFL Logistics expert sharing insights on transportation and logistics in East Africa.
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost: any) => (
                      <Card key={relatedPost.id} className="overflow-hidden">
                        <div className="relative h-40 w-full">
                          <Image
                            src={relatedPost.featured_image || "/placeholder.svg?height=160&width=320"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <h4 className="font-bold hover:text-mafl-orange transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(relatedPost.published_at)}</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="text-xs text-mafl-orange hover:text-mafl-orange/80 font-medium"
                          >
                            Read More
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest articles, industry insights, and company news.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              action={async (formData) => {
                "use server"
                const email = formData.get("email") as string
                await api.newsletter.subscribe(email)
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
