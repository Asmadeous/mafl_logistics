import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { SupportChatProvider } from "@/components/support-chat-context"
import { CookiesDisclaimer } from "@/components/cookies-disclaimer"
import { SupportChatPopup } from "@/components/support-chat-popup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MAFL Logistics",
  description: "Modern African Logistics Solutions",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-white.png", media: "(prefers-color-scheme: dark)" },
      { url: "/logo.jpeg", media: "(prefers-color-scheme: light)" },
    ],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <SupportChatProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <CookiesDisclaimer />
              <SupportChatPopup />
            </ThemeProvider>
          </SupportChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
