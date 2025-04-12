"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Bell, MessageSquare, CheckCircle, Settings } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Fetch messages
          const { data: messagesData, error: messagesError } = await supabase
            .from("user_messages")
            .select("*, sender:sender_id(email, user_metadata)")
            .eq("receiver_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)

          if (messagesError) throw messagesError

          // Fetch notifications
          const { data: notificationsData, error: notificationsError } = await supabase
            .from("user_notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)

          if (notificationsError) throw notificationsError

          setMessages(messagesData || [])
          setNotifications(notificationsData || [])
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoadingData(false)
        }
      }

      fetchData()

      // Set up realtime subscriptions
      const messagesSubscription = supabase
        .channel("messages-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "user_messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((prev) => [payload.new, ...prev])
          },
        )
        .subscribe()

      const notificationsSubscription = supabase
        .channel("notifications-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "user_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev])
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(messagesSubscription)
        supabase.removeChannel(notificationsSubscription)
      }
    }
  }, [user, supabase])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const unreadMessages = messages.filter((msg) => !msg.is_read).length
  const unreadNotifications = notifications.filter((notif) => !notif.is_read).length

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.user_metadata?.name || user.email}</CardTitle>
            <CardDescription>Your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.email} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!user.avatar_url && (
                <p className="text-sm text-muted-foreground mb-2">You haven't uploaded a profile picture yet</p>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Profile
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is your personal dashboard where you can manage your account, view your orders, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <CardDescription>Track your recent orders</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You have no recent orders.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <CardDescription>Your recent messages</CardDescription>
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
                <Link href="/messages">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              {unreadMessages > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                >
                  {unreadMessages}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 3).map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.sender?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {message.sender?.user_metadata?.name || message.sender?.email || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
                      <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                    </div>
                    {!message.is_read && (
                      <div className="ml-auto">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You have no messages.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/messages">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <CardDescription>Your recent notifications</CardDescription>
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
                <Link href="/notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3">
                    <div
                      className={`h-2 w-2 mt-2 rounded-full ${notification.is_read ? "bg-muted" : "bg-primary"}`}
                    ></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You have no notifications.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/notifications">View All Notifications</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{user.user_metadata?.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground capitalize">{user.user_metadata?.role || "user"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
