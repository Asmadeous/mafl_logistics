"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Edit, Tag, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function BlogPostPage({ params }) {
  const { slug } = params
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true)
      try {
        const response = await api.blogs.getBySlug(slug)
        if (response.error) {
          setError(response.error)
        } else {
          setPost(response.data)
        }
      } catch (err) {
        setError("Failed to load blog post")
        console.error("Error fetching blog post:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchBlogPost()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
            <div className="flex flex-wrap gap-4">
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
              </div>

              <div className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Blog Post Not Found</h1>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>{error || "The requested blog post could not be found."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/admin/blogs/${post.slug}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Post
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {post.employee && (
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" /> {post.employee.full_name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />{" "}
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
              </div>
              {post.reading_time && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> {post.reading_time} min read
                </div>
              )}
              <div className="flex items-center">
                <span className="mr-1">Status:</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.status === "published"
                      ? "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </div>
                ))}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
