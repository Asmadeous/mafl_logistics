"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

type BlogPost = {
  id: string
  title: string
  slug: string
  status: string
  published_at: string | null
  category: {
    name: string
  } | null
  author_name: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    console.log("Updated posts state:", posts)
  }, [posts])

  const fetchPosts = async () => {
    console.log("Starting fetchPosts, loading: true")
    setLoading(true)
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_RAILS_API_URL)
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/blog/posts`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(localStorage.getItem("jwt_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              }
            : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }

      const data = await response.json()
      console.log("Raw API response:", JSON.stringify(data, null, 2))
      
      // Ensure data.posts is an array
      const postsArray = Array.isArray(data.posts) ? data.posts : []
      
      const transformedData = postsArray.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        published_at: post.published_at || null,
        category: post.category ? { name: post.category.name } : null,
        author_name: post.author_name || "Unknown",
      }))
      
      setPosts([...transformedData])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
      setPosts([])
    } finally {
      console.log("Ending fetchPosts, loading: false")
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/blog_posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(localStorage.getItem("jwt_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              }
            : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      })
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published"
    return format(new Date(dateString), "MMM d, yyyy")
  }

  console.log("Rendering - loading:", loading, "posts:", posts)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total Posts</CardTitle>
            <CardDescription>All blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Published</CardTitle>
            <CardDescription>Live on your blog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{posts.filter((post) => post.status === "published").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Drafts</CardTitle>
            <CardDescription>Work in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{posts.filter((post) => post.status === "draft").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Manage your blog posts. You have {posts.length} posts.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading blog posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-4">No blog posts found. Create your first post!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => {
                  if (!post || !post.id) {
                    console.warn("Invalid post data:", post)
                    return null
                  }
                  return (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title || "Untitled"}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.category?.name || "Uncategorized"}</TableCell>
                      <TableCell>{post.author_name || "Unknown"}</TableCell>
                      <TableCell>{formatDate(post.published_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => deletePost(post.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}