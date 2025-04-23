"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, User, MessageSquare, Bell, Settings, LogOut, Menu, X, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: true,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      current: false,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      current: false,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      current: false,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: false,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-lg font-semibold ml-1">Dashboard</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="py-4 px-2">
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{user.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1 mt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    item.current
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                Back to Home
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  logout()
                }}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              >
                <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                Logout
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-lg font-semibold ml-1">Dashboard</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{user.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    item.current
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              >
                <Home className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                Back to Home
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-card border-b lg:hidden">
          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-mafl-orange">MAFL</span>
                <span className="text-lg font-semibold ml-1">Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
