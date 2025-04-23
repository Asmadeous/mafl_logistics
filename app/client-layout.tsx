"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/hooks/use-auth"
import { ErrorBoundary } from "react-error-boundary"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
// Remove: import SupportChat from "@/components/support-chat"
import { usePathname } from "next/navigation"

// Simple error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 text-muted-foreground">We're having trouble connecting to our servers.</p>
      <p className="mb-6 text-sm text-red-500">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [apiAvailable, setApiAvailable] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if the API is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        // Skip the health check in development or preview environments
        if (process.env.NODE_ENV === "development" || window.location.hostname.includes("vercel.app")) {
          console.log("Skipping API health check in development/preview environment")
          return
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/health_check`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        setApiAvailable(response.ok)
      } catch (error) {
        console.warn("API health check failed - continuing with limited functionality:", error)
        setApiAvailable(false)
      }
    }

    checkApiAvailability()
  }, [])

  // Update the ApiUnavailableAlert component to be less intrusive
  const ApiUnavailableAlert = () => {
    if (!apiAvailable) {
      return (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 fixed bottom-4 right-4 z-50 max-w-md shadow-lg rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Some features may be limited in preview mode.</p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // In the ClientLayout component, add this code to check the current path
  const pathname = usePathname()
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // suppressHydrationWarning
    >
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <AuthProvider>
          {mounted && <Navbar />}
          <main>{children}</main>
          {mounted && !isDashboardOrAdmin && <Footer />}
          {mounted && <ApiUnavailableAlert />}
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
