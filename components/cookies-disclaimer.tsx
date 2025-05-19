"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function CookiesDisclaimer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted")
    if (!cookiesAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookiesAccepted", "false")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay to prevent interaction with the rest of the app */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="pb-2">
            <CardTitle>Cookie Policy</CardTitle>
            <CardDescription>
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
              traffic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              By clicking "Accept All Cookies", you agree to the storing of cookies on your device to enhance site
              navigation, analyze site usage, and assist in our marketing efforts. To learn more about how we use
              cookies, please see our{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReject}>
              Reject All
            </Button>
            <Button onClick={handleAccept}>Accept All Cookies</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
