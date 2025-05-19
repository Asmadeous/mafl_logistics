"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, Users, DollarSignIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

export default function AdminDashboard() {
  const { stats, recentActivity, performanceData, loading, error } = useDashboardData("admin")

  // Mock appointments data for the dashboard (will be replaced with API call in a separate ticket)
  const mockAppointments = [
    {
      id: "1",
      title: "Logistics Consultation - John Doe",
      clientName: "John Doe",
      clientEmail: "john@example.com",
      clientPhone: "+1 (555) 123-4567",
      scheduledAt: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(), // Today at 2:30 PM
      duration: 60,
      status: "scheduled",
      notes: "Initial consultation for cross-border logistics",
    },
    {
      id: "2",
      title: "Service Quote - Jane Smith",
      clientName: "Jane Smith",
      clientEmail: "jane@example.com",
      clientPhone: "+1 (555) 987-6543",
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
      duration: 60,
      status: "scheduled",
      notes: "Quote for warehousing services",
    },
    {
      id: "3",
      title: "Technical Support - Bob Johnson",
      clientName: "Bob Johnson",
      clientEmail: "bob@example.com",
      clientPhone: "+1 (555) 456-7890",
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // Day after tomorrow
      duration: 60,
      status: "scheduled",
      notes: "Support for tracking system integration",
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Export Reports
          </Button>
          <Button size="sm" className="whitespace-nowrap">
            Add New User
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.users_count || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.users_growth && stats.users_growth > 0 ? "+" : ""}
                  {stats?.users_growth || 0} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Active Shipments</CardTitle>
            <Truck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.active_shipments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.shipments_growth && stats.shipments_growth > 0 ? "+" : ""}
                  {stats?.shipments_growth || 0} from last week
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Inventory Items</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.inventory_count || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.inventory_growth && stats.inventory_growth > 0 ? "+" : ""}
                  {stats?.inventory_growth || 0} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Revenue</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats?.revenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.revenue_growth && stats.revenue_growth > 0 ? "+" : ""}
                  {stats?.revenue_growth || 0}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Performance Chart */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6">
        <UpcomingAppointments appointments={mockAppointments} loading={false} />

        <Card>
          <CardHeader>
            <CardTitle className="font-bold">Performance Overview</CardTitle>
            <CardDescription>Monthly shipment volume and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <div className="relative h-[300px] w-full">
                {performanceData ? (
                  <Image
                    src="/monthly-sales-performance.png"
                    alt="Performance Chart"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-bold">Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity
                  .filter((activity) => activity.type === "user_registration")
                  .slice(0, 4)
                  .map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                        <Link href={`/dashboard/admin/users/${activity.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/admin/users">View All Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-bold">Recent Orders</CardTitle>
            <CardDescription>Latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity
                  .filter((activity) => activity.type === "order")
                  .slice(0, 4)
                  .map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                        <Link href={`/dashboard/admin/orders/${activity.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/admin/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Blog Management</CardTitle>
          <CardDescription>Manage your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">Recent Blog Posts</h3>
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-[200px]" />
                  ) : (
                    `You have ${recentActivity.filter((a) => a.type === "blog_post").length} published blog posts`
                  )}
                </p>
              </div>
              <Button asChild className="whitespace-nowrap">
                <Link href="/dashboard/admin/blogs/new">Create New Post</Link>
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {loading
                    ? [1, 2, 3].map((i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-[200px]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-[100px]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-[100px]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-[80px]" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Skeleton className="h-4 w-[80px] ml-auto" />
                          </td>
                        </tr>
                      ))
                    : recentActivity
                        .filter((activity) => activity.type === "blog_post")
                        .slice(0, 3)
                        .map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                              {post.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {post.description.split(" - ")[0]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {post.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                                {post.status || "Published"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/dashboard/admin/blogs/${post.id}/edit`}
                                className="text-primary hover:text-primary/80 mr-4"
                              >
                                Edit
                              </Link>
                              <Link
                                href={`/dashboard/admin/blogs/${post.id}`}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/blogs">View All Blog Posts</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
