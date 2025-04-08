"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import useMobile from "@/hooks/use-mobile"

export default function Navbar() {
  const { isScrolled } = useScrollPosition()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ]

  const isDark = resolvedTheme === "dark"
  const isTransparent = !isScrolled

  // Determine text color based on theme and scroll state
  const textColor = !mounted
    ? "text-white"
    : isTransparent && !isDark
      ? "text-mafl-dark"
      : isTransparent && isDark
        ? "text-white"
        : isDark
          ? "text-white"
          : "text-mafl-dark"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? "bg-mafl-dark/90 backdrop-blur-md shadow-sm"
            : "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className={`flex items-center ${textColor}`}
            >
              <Phone className="h-4 w-4 mr-2" />
              <span>+254 711 111 017</span>
            </motion.div>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

