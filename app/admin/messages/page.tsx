"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Trash2, Mail, Eye, EyeOff } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { format } from "date-fns"

type Message = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id)

      if (error) throw error

      // Update local state
      setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, status: "read" } : message)))

      toast({
        title: "Success",
        description: "Message marked as read.",
      })
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markAsUnread = async (id: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("contact_messages").update({ status: "unread" }).eq("id", id)

      if (error) throw error

      // Update local state
      setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, status: "unread" } : message)))

      toast({
        title: "Success",
        description: "Message marked as unread.",
      })
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Message deleted successfully.",
      })

      // Refresh messages
      fetchMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a")
  }

  const toggleExpandMessage = (id: string) => {
    setExpandedMessage((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Manage contact form submissions. You have {messages.length} messages.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={message.status === "unread" ? "border-primary" : ""}>
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
                        {message.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p
                          className={`${
                            expandedMessage === message.id ? "" : "line-clamp-2"
                          } whitespace-pre-wrap text-sm`}
                        >
                          {message.message}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandMessage(message.id)}
                          className="ml-2 flex-shrink-0"
                        >
                          {expandedMessage === message.id ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" /> Show Less
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" /> Show More
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`mailto:${message.email}`, "_blank")}
                        >
                          <Mail className="h-4 w-4 mr-1" /> Reply
                        </Button>
                        {message.status === "unread" ? (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(message.id)}>
                            <Eye className="h-4 w-4 mr-1" /> Mark as Read
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => markAsUnread(message.id)}>
                            <EyeOff className="h-4 w-4 mr-1" /> Mark as Unread
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">No messages found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
