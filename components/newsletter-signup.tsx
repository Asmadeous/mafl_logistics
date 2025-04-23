"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export function NewsletterSignup({
  className,
  variant = "default",
}: {
  className?: string
  variant?: "default" | "card"
}) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { user } = useAuth()

  // Pre-fill email if user is logged in
  useState(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.newsletter.subscribe(email)
      setIsSuccess(true)
      toast({
        title: "Success!",
        description: "You have successfully subscribed to the newsletter.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subscribe to Our Newsletter</CardTitle>
          <CardDescription>Stay updated with our latest news, services, and industry insights.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-xl font-medium">Thanks for subscribing!</h3>
              <p className="text-muted-foreground mt-1">
                You're now on our mailing list and will receive our latest updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-xs text-center text-muted-foreground">
          We respect your privacy and won't share your information.
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className={className}>
      {isSuccess ? (
        <div className="flex items-center text-green-500">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          <span>Thanks for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="email"
            placeholder="Your email address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="max-w-md"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  )
}
