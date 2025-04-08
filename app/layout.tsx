import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContactPopup from "@/components/contact-popup"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MAFL Logistics - Your Trusted Logistics Partner",
  description: "Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="mafl-theme"
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ContactPopup />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'