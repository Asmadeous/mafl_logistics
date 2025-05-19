"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  FileText,
  Users,
  LayoutDashboard,
  X,
  MessageSquare,
  Home,
  Sun,
  Moon,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { useSupportChat } from "@/components/support-chat-context"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface MainSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MainSidebar({ isOpen, onClose }: MainSidebarProps) {
  const { theme, setTheme } = useTheme()
  const { openChat } = useSupportChat()
  const { isAuthenticated, userType } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close sidebar when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.id === "sidebar-overlay") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("click", handleClickOutside)
      // Prevent scrolling of the body when sidebar is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("click", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div id="sidebar-overlay" className="fixed inset-0 bg-black/50 z-50 transition-opacity" aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-[280px] bg-background z-50 shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <Logo showText={true} width={40} height={40} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close sidebar"
              className="hover:bg-accent focus:ring-0 focus:ring-offset-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <Separator className="mb-2" />

          {/* Content */}
          <ScrollArea className="flex-1 px-4">
            <nav className="flex flex-col space-y-1 py-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                href="/services"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">Services</span>
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Company</span>
              </Link>

              <Link
                href="/blogs"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">Blogs</span>
              </Link>

              <Link
                href="/careers"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Careers</span>
              </Link>

              {/* Notifications Link */}
              <Link
                href={isAuthenticated ? "/notifications" : "/auth/login?redirect=/notifications"}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Bell className="h-5 w-5" />
                <span className="font-medium">Notifications</span>
              </Link>

              {isAuthenticated && (
                <Link
                  href={getDashboardUrl()}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  onClick={onClose}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}

              <Separator className="my-4" />

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium">Theme</span>
                {mounted ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="focus:ring-0 focus:ring-offset-0"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Moon className="h-[1.2rem] w-[1.2rem]" />
                    )}
                  </Button>
                ) : (
                  <div className="h-9 w-9 flex items-center justify-center rounded-md border border-input">
                    <span className="h-[1.2rem] w-[1.2rem] bg-muted rounded-full" />
                  </div>
                )}
              </div>
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 mt-auto">
            {isAuthenticated ? (
              <Button
                variant="orange"
                className="w-full"
                onClick={() => {
                  onClose()
                  router.push(getDashboardUrl())
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <Button
                variant="orange"
                className="w-full"
                onClick={() => {
                  onClose()
                  openChat()
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Get Quote
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
