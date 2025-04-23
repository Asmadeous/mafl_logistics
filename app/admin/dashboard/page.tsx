"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  ArrowRight,
  ShoppingCart,
  UserCircle,
  Receipt,
  BarChart,
  TrendingUp,
  Calendar,
  AlertCircle,
  FileText,
  Mail,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminRoutes } from "../routes"
import { useAuth } from "@/hooks/use-auth"
import  MessagesTab  from "@/components/messaging/messages-tab"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalPosts: 0,
    totalSubscribers: 0,
    totalMessages: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        // In a real implementation, these would be API calls to your Rails backend
        // For now, we'll use mock data

        // Mock stats
        setStats({
          totalOrders: 124,
          totalCustomers: 48,
          totalRevenue: 28750,
          pendingOrders: 5,
          totalPosts: 23,
          totalSubscribers: 156,
          totalMessages: 12,
        })

        // Mock recent orders
        setRecentOrders([
          {
            id: "ORD-001",
            customer: "Acme Corporation",
            status: "completed",
            amount: 2500,
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: "ORD-002",
            customer: "Global Enterprises",
            status: "processing",
            amount: 1800,
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
          {
            id: "ORD-003",
            customer: "Tech Solutions Ltd",
            status: "pending",
            amount: 3200,
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          },
        ])

        // Mock recent blog posts
        setRecentPosts([
          {
            id: 1,
            title: "Top 10 Logistics Trends for 2025",
            status: "published",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            comments: 8,
            views: 342,
          },
          {
            id: 2,
            title: "How to Optimize Your Supply Chain",
            status: "published",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            comments: 5,
            views: 217,
          },
          {
            id: 3,
            title: "Sustainable Logistics: The Future of Transportation",
            status: "draft",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            comments: 0,
            views: 0,
          },
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

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
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Link href={adminRoutes.orders.new}>
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </Link>
          <Link href={adminRoutes.blog.new}>
            <Button variant="outline">
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
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href={adminRoutes.orders.index} className="text-sm text-primary flex items-center">
                View all orders
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href={adminRoutes.customers.index} className="text-sm text-primary flex items-center">
                View all customers
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Link href={adminRoutes.invoices.index} className="text-sm text-primary flex items-center">
                View all invoices
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

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
              <Link href={adminRoutes.blog.index} className="text-sm text-primary flex items-center">
                View all posts
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pendingOrders}</h3>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalSubscribers}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
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
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="orders" className="w-full mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="messages">Support Messages</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest orders. {loading && "Loading..."}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link href={adminRoutes.orders.view(order.id)} className="font-medium hover:text-primary">
                              {order.id}
                            </Link>
                          </td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{formatCurrency(order.amount)}</td>
                          <td className="py-3 px-4">{formatDate(order.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">No recent orders found.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={adminRoutes.orders.index}>
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Your latest blog posts. {loading && "Loading..."}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Comments</th>
                        <th className="text-left py-3 px-4 font-medium">Views</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link
                              href={adminRoutes.blog.edit(post.id.toString())}
                              className="font-medium hover:text-primary"
                            >
                              {post.title}
                            </Link>
                          </td>
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
                          <td className="py-3 px-4">{post.comments}</td>
                          <td className="py-3 px-4">{post.views}</td>
                          <td className="py-3 px-4">{formatDate(post.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4">No recent blog posts found.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={adminRoutes.blog.index}>
                <Button variant="outline" size="sm">
                  View All Posts
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <MessagesTab  />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-muted-foreground">John Doe created a new account</p>
                    <p className="text-xs text-muted-foreground mt-1">Today, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New order placed</p>
                    <p className="text-sm text-muted-foreground">Order #ORD-004 was placed by Acme Corporation</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Invoice paid</p>
                    <p className="text-sm text-muted-foreground">Invoice #INV-002 was paid by Global Enterprises</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago, 11:20 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New blog post published</p>
                    <p className="text-sm text-muted-foreground">
                      "Top 10 Logistics Trends for 2025" was published to the blog
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago, 9:15 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats and Logistics Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Upcoming Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Nairobi to Mombasa</p>
                  <p className="text-sm text-muted-foreground">Construction materials</p>
                </div>
                <p className="text-sm">Tomorrow</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Nakuru to Kisumu</p>
                  <p className="text-sm text-muted-foreground">Heavy machinery</p>
                </div>
                <p className="text-sm">May 20, 2025</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Nairobi to Eldoret</p>
                  <p className="text-sm text-muted-foreground">Agricultural supplies</p>
                </div>
                <p className="text-sm">May 22, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">On-time Deliveries</p>
                  <p className="text-sm font-medium">92%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Customer Satisfaction</p>
                  <p className="text-sm font-medium">88%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Fleet Utilization</p>
                  <p className="text-sm font-medium">76%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href={adminRoutes.orders.new}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">New Order</span>
              </div>
            </Link>
            <Link href={adminRoutes.blog.new}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">New Post</span>
              </div>
            </Link>
            <Link href={adminRoutes.customers.new}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">New Customer</span>
              </div>
            </Link>
            <Link href={adminRoutes.invoices.new}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Receipt className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">New Invoice</span>
              </div>
            </Link>
            <Link href={adminRoutes.messages}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Mail className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">Messages</span>
              </div>
            </Link>
            <Link href={adminRoutes.settings}>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Settings className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium text-center">Settings</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
