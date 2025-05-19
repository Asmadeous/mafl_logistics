"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Building2,
  FileText,
  Users,
  Sun,
  Moon,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { MainSidebar } from "@/components/main-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useSupportChat } from "@/components/support-chat-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, userType } = useAuth()
  const { openChat } = useSupportChat()

  // Check if component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Determine dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!isAuthenticated) return "#"

    switch (userType) {
      case "employee":
        return "/dashboard/admin"
      case "client":
        return "/dashboard/client"
      case "user":
      default:
        return "/dashboard/user"
    }
  }

  const handleContactClick = () => {
    openChat()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-0">
        <div className="container flex h-16 items-center">
          <div className="flex items-center">
            <Logo showText={true} />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:items-center md:justify-center md:space-x-6 flex-1">
            <div className="flex items-center justify-center space-x-6">
              <Link
                href="/services"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
              >
                <Briefcase className="h-4 w-4" />
                <span>Services</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
              >
                <Building2 className="h-4 w-4" />
                <span>Company</span>
              </Link>
              <Link
                href="/blogs"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
              >
                <FileText className="h-4 w-4" />
                <span>Blogs</span>
              </Link>
              <Link
                href="/careers"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
              >
                <Users className="h-4 w-4" />
                <span>Careers</span>
              </Link>
            </div>
          </div>

          {/* Right-aligned buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {/* Theme Toggle Button */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="mr-2"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            )}

            {/* Notification Bell (for all users) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 relative">
                  <Bell className="h-[1.2rem] w-[1.2rem]" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex flex-col space-y-1 p-2">
                  <h3 className="font-medium text-sm">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {isAuthenticated ? "You have new notifications" : "Sign in to view your notifications"}
                  </p>
                </div>
                {!isAuthenticated && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer">
                      Sign in to view notifications
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAuthenticated && (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <span className="font-medium">New message received</span>
                      <span className="text-xs text-muted-foreground">2 minutes ago</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <span className="font-medium">Shipment status updated</span>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <Link href={getDashboardUrl()}>
                <Button variant="default" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Button variant="default" size="sm" onClick={handleContactClick} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Contact Us</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
            className="md:hidden ml-auto"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main Sidebar */}
      <MainSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  )
}
