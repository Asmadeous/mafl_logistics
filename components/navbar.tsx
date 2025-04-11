"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Modify imports to include our new components
import { NotificationDropdown } from "./notifications/notification-dropdown"
import { MessageDropdown } from "./messaging/message-dropdown"

export default function Navbar() {
  const { scrollPosition, isScrolled } = useScrollPosition()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isHomePage = pathname === "/"
  const { user, isAdmin, signOut, loading } = useAuth()

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ]

  const isDark = resolvedTheme === "dark"

  // Determine navbar background based on page and scroll position
  const navbarBg = isHomePage
    ? "bg-black/30 backdrop-blur-sm" // Always transparent on home page
    : isScrolled
      ? isDark
        ? "bg-mafl-dark/90 backdrop-blur-md shadow-sm"
        : "bg-white/90 backdrop-blur-md shadow-sm"
      : "bg-black/30 backdrop-blur-sm" // Translucent on other pages when not scrolled

  // Text color should be white when transparent (over video)
  const textColor = !mounted
    ? "text-white"
    : isHomePage || (!isScrolled && !isHomePage)
      ? "text-white"
      : isDark
        ? "text-white"
        : "text-mafl-dark"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-mafl-orange">MAFL</span>
              <span className={`text-xl font-semibold ${textColor}`}>Logistics</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-mafl-orange ${
                    pathname === item.href ? "text-mafl-orange font-semibold" : textColor
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Authentication and Notification Icons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <NotificationDropdown iconClassName={textColor} />

                    {/* Messages */}
                    <MessageDropdown iconClassName={textColor} />

                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className={`flex items-center ${textColor}`}>
                          <User className="h-4 w-4 mr-2" />
                          <span className="mr-1">{user.user_metadata?.name || "Account"}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile" className="cursor-pointer">
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/settings" className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" className={textColor}>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        variant="outline"
                        className="border-mafl-orange text-mafl-orange hover:bg-mafl-orange hover:text-white"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </motion.nav>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden space-x-4">
            {!loading && user && (
              <>
                <NotificationDropdown triggerClassName="relative" iconClassName={`h-5 w-5 ${textColor}`} />
                <MessageDropdown triggerClassName="relative" iconClassName={`h-5 w-5 ${textColor}`} />
              </>
            )}
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={textColor}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Account</p>
                            {isAdmin && (
                              <Link href="/admin" className="block py-2 text-muted-foreground hover:text-primary">
                                Admin Dashboard
                              </Link>
                            )}
                            <Link href="/dashboard" className="block py-2 text-muted-foreground hover:text-primary">
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              className="block py-2 text-muted-foreground hover:text-primary"
                            >
                              Profile
                            </Link>
                            <Link
                              href="/dashboard/settings"
                              className="block py-2 text-muted-foreground hover:text-primary"
                            >
                              Settings
                            </Link>
                            <Button
                              variant="ghost"
                              className="w-full justify-start pl-0 mt-2 text-red-500 hover:text-red-600 hover:bg-transparent"
                              onClick={() => signOut()}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign out
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                          <Link href="/auth/login">
                            <Button variant="outline" className="w-full justify-start">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/auth/signup">
                            <Button className="w-full justify-start">Sign Up</Button>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
