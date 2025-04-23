"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { MessageSquare, Bell, Calendar, TruckIcon, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<any[]>([])

  useEffect(() => {
    // Fetch unread messages count
    // This would be replaced with an actual API call
    setUnreadMessages(3)

    // Fetch unread notifications count
    // This would be replaced with an actual API call
    setUnreadNotifications(5)

    // Fetch recent activity
    // This would be replaced with an actual API call
    setRecentActivity([
      {
        id: 1,
        type: "message",
        title: "New message from Support",
        description: "Your inquiry about delivery times has been answered",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "notification",
        title: "Order status updated",
        description: "Your order #12345 has been shipped",
        time: "1 day ago",
      },
      {
        id: 3,
        type: "system",
        title: "System maintenance",
        description: "The system will be down for maintenance on May 20, 2025",
        time: "2 days ago",
      },
    ])

    // Fetch upcoming deliveries
    // This would be replaced with an actual API call
    setUpcomingDeliveries([
      {
        id: 1,
        title: "Heavy machinery delivery",
        location: "Nairobi to Mombasa",
        date: "May 18, 2025",
        status: "scheduled",
      },
      {
        id: 2,
        title: "Construction materials",
        location: "Nairobi to Nakuru",
        date: "May 22, 2025",
        status: "processing",
      },
    ])
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || "User"}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>Your recent messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary mr-2" />
                <div>
                  <p className="font-medium">{unreadMessages} unread messages</p>
                  <p className="text-sm text-muted-foreground">Check your inbox</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/messages">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Your recent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-primary mr-2" />
                <div>
                  <p className="font-medium">{unreadNotifications} unread notifications</p>
                  <p className="text-sm text-muted-foreground">Stay updated</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/notifications">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Support</CardTitle>
            <CardDescription>Get help from our team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary mr-2" />
                <div>
                  <p className="font-medium">Direct support</p>
                  <p className="text-sm text-muted-foreground">Chat with our team</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/support">Contact</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest activity on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {activity.type === "message" && <MessageSquare className="h-5 w-5 text-primary" />}
                    {activity.type === "notification" && <Bell className="h-5 w-5 text-primary" />}
                    {activity.type === "system" && <FileText className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deliveries</CardTitle>
            <CardDescription>Your scheduled deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TruckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{delivery.title}</p>
                      <Badge variant={delivery.status === "scheduled" ? "outline" : "secondary"}>
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{delivery.location}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {delivery.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
              <Link href="/dashboard/profile">
                <User className="h-6 w-6 mb-2" />
                <span>Update Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Check Messages</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
              <Link href="/dashboard/support">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Contact Support</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-6 w-6 mb-2" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function User(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function Settings(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
