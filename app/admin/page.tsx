"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Users, Mail, ArrowRight, ShoppingCart, UserCircle, Building2, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalSubscribers: 0,
    totalMessages: 0,
    recentViews: 0,
  })
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = getSupabaseClient()

        // Fetch stats
        const [
          { count: postsCount, error: postsError },
          { count: subscribersCount, error: subscribersError },
          { count: messagesCount, error: messagesError },
          { data: viewsData, error: viewsError },
        ] = await Promise.all([
          supabase.from("blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("blog_posts").select("view_count").order("view_count", { ascending: false }).limit(5),
        ])

        if (postsError) throw postsError
        if (subscribersError) throw subscribersError
        if (messagesError) throw messagesError
        if (viewsError) throw viewsError

        // Calculate total views from top 5 posts
        const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

        setStats({
          totalPosts: postsCount || 0,
          totalSubscribers: subscribersCount || 0,
          totalMessages: messagesCount || 0,
          recentViews: totalViews,
        })

        // Fetch recent posts
        const { data: posts, error: recentPostsError } = await supabase
          .from("blog_posts")
          .select(`
            id,
            title,
            slug,
            status,
            published_at,
            view_count,
            blog_categories(name)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentPostsError) throw recentPostsError
        setRecentPosts(posts || [])

        // Fetch recent messages
        const { data: messages, error: recentMessagesError } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (recentMessagesError) throw recentMessagesError
        setRecentMessages(messages || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link href="/admin/blog/new">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/orders" className="text-sm text-primary flex items-center">
                Manage orders
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/employees" className="text-sm text-primary flex items-center">
                Manage employees
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/customers" className="text-sm text-primary flex items-center">
                Manage customers
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invoices</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/invoices" className="text-sm text-primary flex items-center">
                Manage invoices
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalPosts}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/blog" className="text-sm text-primary flex items-center">
                View all posts
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blog Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalSubscribers}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/subscribers" className="text-sm text-primary flex items-center">
                Manage subscribers
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalMessages}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/messages" className="text-sm text-primary flex items-center">
                View messages
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="messages">Recent Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>
                Your latest {recentPosts.length} blog posts. {loading && "Loading..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Published</th>
                        <th className="text-left py-3 px-4 font-medium">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link href={`/admin/blog/edit/${post.id}`} className="font-medium hover:text-primary">
                              {post.title}
                            </Link>
                          </td>
                          <td className="py-3 px-4">{post.blog_categories?.name || "Uncategorized"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {post.published_at ? formatDate(post.published_at) : "Not published"}
                          </td>
                          <td className="py-3 px-4">{post.view_count || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">No posts found. Create your first blog post!</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href="/admin/blog">
                <Button variant="outline" size="sm">
                  View All Posts
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Your latest {recentMessages.length} contact form submissions. {loading && "Loading..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <Card key={message.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{message.name}</CardTitle>
                            <CardDescription>
                              {message.email} | {message.phone || "No phone provided"}
                            </CardDescription>
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs ${
                              message.status === "read"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {message.status || "unread"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm line-clamp-2">{message.message}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${message.email}`, "_blank")}
                        >
                          Reply
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">No messages found.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href="/admin/messages">
                <Button variant="outline" size="sm">
                  View All Messages
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
