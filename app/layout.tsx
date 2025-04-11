import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MAFL Logistics - Your Trusted Logistics Partner",
  description: "Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa",
  generator: "v0.dev",
}

// Update the RootLayout component to conditionally render the Navbar
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
