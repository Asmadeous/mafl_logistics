"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthPage, setIsAuthPage] = useState(false)

  useEffect(() => {
    // Check if the current page is an auth page
    const authPaths = ["/auth/login", "/auth/signup", "/auth/verification", "/admin/login"]
    setIsAuthPage(authPaths.includes(pathname))
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {!isAuthPage && <Navbar />}
        <main>{children}</main>
        {!isAuthPage && <Footer />}
      </AuthProvider>
    </ThemeProvider>
  )
}
