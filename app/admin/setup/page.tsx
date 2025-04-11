"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const [adminSecret, setAdminSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSetup = async () => {
    if (!adminSecret) {
      toast({
        title: "Error",
        description: "Please enter the admin secret",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/setup-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorization: adminSecret }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to set up database")
      }

      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error: any) {
      console.error("Setup error:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Set up the required database tables and functions for the messaging and notification system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-secret" className="block text-sm font-medium mb-1">
                Admin Secret
              </label>
              <Input
                id="admin-secret"
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Enter admin secret"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This should match the ADMIN_SECRET environment variable.
              </p>
            </div>
            <Button onClick={handleSetup} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                "Set Up Database"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
