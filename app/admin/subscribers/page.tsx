"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Trash2, Plus, Save, Mail } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { format } from "date-fns"

type Subscriber = {
  id: string
  email: string
  status: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addSubscriber = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", newEmail)
        .single()

      if (existingSubscriber) {
        toast({
          title: "Error",
          description: "This email is already subscribed.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("newsletter_subscribers").insert([
        {
          email: newEmail,
          status: "active",
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscriber added successfully.",
      })

      // Reset form and refresh subscribers
      setNewEmail("")
      setIsAdding(false)
      fetchSubscribers()
    } catch (error) {
      console.error("Error adding subscriber:", error)
      toast({
        title: "Error",
        description: "Failed to add subscriber. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSubscriberStatus = async (id: string, currentStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      const { error } = await supabase.from("newsletter_subscribers").update({ status: newStatus }).eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Subscriber ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
      })

      // Refresh subscribers
      fetchSubscribers()
    } catch (error) {
      console.error("Error updating subscriber status:", error)
      toast({
        title: "Error",
        description: "Failed to update subscriber status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscriber deleted successfully.",
      })

      // Refresh subscribers
      fetchSubscribers()
    } catch (error) {
      console.error("Error deleting subscriber:", error)
      toast({
        title: "Error",
        description: "Failed to delete subscriber. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subscriber
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Subscriber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-email">Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={addSubscriber}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>
            Manage your newsletter subscribers. You have {subscribers.length} subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading subscribers...</div>
          ) : subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          subscriber.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`mailto:${subscriber.email}`, "_blank")}
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.status)}
                          title={subscriber.status === "active" ? "Deactivate" : "Activate"}
                        >
                          {subscriber.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSubscriber(subscriber.id)}
                          title="Delete"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">No subscribers found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
