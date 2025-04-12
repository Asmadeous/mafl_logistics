"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const { session } = useAuth()

  const setupDatabase = async () => {
    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "You must be logged in as an admin",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      setDebugInfo(null)

      // Log debug info
      setDebugInfo(`Sending request to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/setup`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/setup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      const responseText = await response.text()
      setDebugInfo((prev) => `${prev}\n\nResponse status: ${response.status}\nResponse: ${responseText}`)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to set up database")
      }

      toast({
        title: "Success",
        description: result.message || "Database set up successfully",
      })
    } catch (error: any) {
      console.error("Error setting up database:", error)
      setDebugInfo((prev) => `${prev}\n\nError: ${error.message}`)
      toast({
        title: "Error",
        description: error.message || "Failed to set up database",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Set up tables and security policies for messaging and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create the necessary tables and set up Row Level Security policies to protect your data.
          </p>

          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-h-60">
              <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={setupDatabase} disabled={loading}>
            {loading ? "Setting up..." : "Set Up Database"}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Current session: {session ? "Authenticated" : "Not authenticated"}</p>
            <p>User role: {session?.user?.user_metadata?.role || "N/A"}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
