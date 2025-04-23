import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MAFL Logistics - Your Trusted Logistics Partner",
  description: "Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'theme';
                  var prefersDarkQuery = '(prefers-color-scheme: dark)';
                  var mql = window.matchMedia(prefersDarkQuery);
                  var prefersDarkFromMQ = mql.matches;
                  var persistedPreference = localStorage.getItem(storageKey);
                  
                  var colorMode = persistedPreference
                    ? persistedPreference
                    : prefersDarkFromMQ
                    ? 'dark'
                    : 'light';
                  
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(colorMode);
                } catch (e) {
                  console.error(e);
                }
              })();
            `,
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
