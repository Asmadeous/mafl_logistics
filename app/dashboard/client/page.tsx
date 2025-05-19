"use client"

import type React from "react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useAppointments } from "@/hooks/use-appointments"
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

export default function ClientDashboardPage() {
  const { appointments, loading: appointmentsLoading } = useAppointments(false)
  const { stats, recentActivity, performanceData, loading, error } = useDashboardData("client")

  // Initialize appointment notifications
  useAppointmentNotifications(appointments, "client")

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Client Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Download Reports
          </Button>
          <Button size="sm" className="whitespace-nowrap">
            Request Service
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Active Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
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
                  {stats?.shipments_growth || 0} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">In Transit</CardTitle>
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
                <div className="text-2xl font-bold">
                  {stats?.active_shipments ? Math.floor(stats.active_shipments * 0.6) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.shipments_growth && stats.shipments_growth > 0 ? "+" : ""}
                  {stats?.shipments_growth ? Math.floor(stats.shipments_growth * 0.5) : 0} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold">Completed</CardTitle>
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
            <CardTitle className="text-sm font-bold">Total Spend</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
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

      {/* Shipment Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Shipment Tracking</CardTitle>
          <CardDescription>Real-time location of your active shipments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="relative h-[300px] w-full rounded-md overflow-hidden">
              <Image
                src="/kenya-route-map.png"
                alt="Shipment Tracking Map"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-md">
                  Interactive map will be loaded here
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Recent Orders</CardTitle>
          <CardDescription>Your recent logistics orders</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[120px]" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity
                .filter((activity) => activity.type === "order")
                .slice(0, 3)
                .map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{order.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{order.date}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{order.description.split(" - ")[0]}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.description.split(" - ")[1] || "Various Items"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">From: Nairobi, Kenya</p>
                      <p className="text-sm text-muted-foreground truncate">To: Kampala, Uganda</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                        {order.status || "In Transit"}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
                        <Link href={`/dashboard/client/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/client/orders">View All Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Recent Invoices</CardTitle>
          <CardDescription>Your recent billing information</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity
                .filter((activity) => activity.type === "invoice")
                .slice(0, 2)
                .map((invoice, index) => (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{invoice.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{invoice.date}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{invoice.description.split(" - ")[0]}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        Order #{invoice.description.split(" - ")[1] || `ORD-${Math.floor(Math.random() * 10000)}`}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm font-bold">{formatCurrency(invoice.amount || 0)}</p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {index === 0 ? "Pending" : "Paid"}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
                        <Link href={`/dashboard/client/invoices/${invoice.id}`}>View Invoice</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/client/invoices">View All Invoices</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}
