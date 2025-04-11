"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContactPopup from "@/components/contact-popup"
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check if the current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth/") || pathname?.startsWith("/admin/login")

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {!isAuthPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <ContactPopup />}
    </ThemeProvider>
  )
}
