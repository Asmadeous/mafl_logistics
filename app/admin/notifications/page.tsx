"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Bell, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"

type User = {
  id: string
  email: string
  name: string
  role: string
}

const formSchema = z.object({
  type: z.enum(["info", "success", "warning", "error"], {
    required_error: "Please select a notification type",
  }),
  recipient: z.enum(["all", "user", "role"], {
    required_error: "Please select a recipient type",
  }),
  userId: z.string().optional(),
  userRole: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  link: z.string().optional(),
})

export default function NotificationsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "info",
      recipient: "all",
      title: "",
      message: "",
      link: "",
    },
  })

  const recipientType = form.watch("recipient")

  useEffect(() => {
    fetchUsers()
    fetchNotificationHistory()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Use Rails API to fetch users
      const response = await fetch(`${process.env.RAILS_API_URL}/contacts`, {
        // credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotificationHistory = async () => {
    try {
      // Use Rails API to fetch notification history
      const response = await fetch(`${process.env.RAILS_API_URL}/notifications`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notification history")
      }

      const data = await response.json()
      setNotificationHistory(data || [])
    } catch (error) {
      console.error("Error fetching notification history:", error)
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true)
    try {
      // Use Rails API to send notifications
      const response = await fetch(`${process.env.RAILS_API_URL}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to send notifications")
      }

      toast({
        title: "Success",
        description: `Notification sent successfully`,
        // default: "success",
      })

      // Reset form and refresh history
      form.reset({
        type: "info",
        recipient: "all",
        title: "",
        message: "",
        link: "",
      })

      fetchNotificationHistory()
    } catch (error: any) {
      console.error("Error sending notifications:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send notifications",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      // Use Rails API to delete notification
      const response = await fetch(`${process.env.RAILS_API_URL}/notifications/${id}`, {
        method: "DELETE",
        // credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notification")
      }

      toast({
        title: "Success",
        description: "Notification deleted",
      })

      fetchNotificationHistory()
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Send notifications to users or groups</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="info" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Info</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="success" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Success</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="warning" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Warning</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="error" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Error</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipients</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="role">By Role</SelectItem>
                            <SelectItem value="user">Specific User</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {recipientType === "user" && (
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select User</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {recipientType === "role" && (
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Role</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">Regular User</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Notification title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notification message" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/page" {...field} />
                      </FormControl>
                      <FormDescription>URL to redirect users when they click on the notification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Bell className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Last {notificationHistory.length} notifications sent</CardDescription>
          </CardHeader>
          <CardContent>
            {notificationHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationHistory.map((notification) => {
                    const typeIcon =
                      notification.type === "success" ? (
                        <span className="text-green-500">✓</span>
                      ) : notification.type === "warning" ? (
                        <span className="text-yellow-500">!</span>
                      ) : notification.type === "error" ? (
                        <span className="text-red-500">×</span>
                      ) : (
                        <span className="text-blue-500">i</span>
                      )

                    return (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {typeIcon}
                            <span className="ml-2">{notification.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                            {notification.message}
                          </div>
                        </TableCell>
                        <TableCell>{notification.type}</TableCell>
                        <TableCell>{format(new Date(notification.created_at), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications sent yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
