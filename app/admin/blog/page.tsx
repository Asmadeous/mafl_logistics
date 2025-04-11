"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Edit, Eye, MoreHorizontal, Plus, Trash2, Users } from "lucide-react"
import { format } from "date-fns"
import { getSupabaseClient } from "@/lib/supabase-client"

type BlogPost = {
  id: string
  title: string
  slug: string
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  view_count: number
  blog_categories: {
    name: string
  } | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    fetchPosts()

    // Fetch subscriber count
    const fetchSubscriberCount = async () => {
      try {
        const supabase = getSupabaseClient()
        const { count, error } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        if (error) throw error
        setSubscriberCount(count || 0)
      } catch (error) {
        console.error("Error fetching subscriber count:", error)
      }
    }

    fetchSubscriberCount()
  }, [activeTab])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()

      let query = supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          status,
          published_at,
          created_at,
          updated_at,
          view_count,
          blog_categories(name)
        `)
        .order("updated_at", { ascending: false })

      if (activeTab === "published") {
        query = query.eq("status", "published")
      } else if (activeTab === "draft") {
        query = query.eq("status", "draft")
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      })

      // Refresh the posts list
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex space-x-2">
          <Link href="/admin/subscribers">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <Users className="h-4 w-4 mr-1" />
        <span>{subscriberCount} active subscribers will be notified of new published posts.</span>
        <Link href="/admin/subscribers" className="ml-2 text-primary hover:underline">
          Manage subscribers
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                Manage your blog posts. You have {posts.length} {activeTab === "all" ? "total" : activeTab} posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading posts...</div>
              ) : posts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant={post.status === "published" ? "default" : "outline"}
                              className={post.status === "published" ? "bg-green-500" : ""}
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.blog_categories?.name || "Uncategorized"}</TableCell>
                          <TableCell>{formatDate(post.published_at)}</TableCell>
                          <TableCell>{post.view_count}</TableCell>
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
                                <DropdownMenuItem onClick={() => deletePost(post.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">No posts found. Create your first blog post!</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
