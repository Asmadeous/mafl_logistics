"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  FileText,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Briefcase,
  FileEdit,
  Settings,
  Home,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  dashboardType: "admin" | "client" | "user"
  onCollapse?: (collapsed: boolean) => void
}

export function DashboardSidebar({ isOpen, onClose, dashboardType, onCollapse }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  // Mock admin data - in a real app, this would come from your auth context
  const adminData = {
    name: "Admin User",
    email: "admin@mafl-logistics.com",
    avatar: "/confident-leader.png", // Using one of the existing images
    role: "Administrator",
  }

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      onClose()
    }
  }, [pathname, onClose])

  const toggleCollapsed = () => {
    const newCollapsedState = !collapsed
    setCollapsed(newCollapsedState)
    if (onCollapse) {
      onCollapse(newCollapsedState)
    }
  }

  const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/admin/clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/admin/employees", label: "Employees", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/admin/fleet", label: "Fleet", icon: <Truck className="h-5 w-5" /> },
    { href: "/dashboard/admin/inventory", label: "Inventory", icon: <Package className="h-5 w-5" /> },
    { href: "/dashboard/admin/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/dashboard/admin/invoices", label: "Invoices", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/admin/appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
    { href: "/dashboard/admin/support", label: "Support", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/dashboard/admin/blogs", label: "Blog", icon: <FileEdit className="h-5 w-5" /> },
    { href: "/dashboard/admin/careers", label: "Careers", icon: <Briefcase className="h-5 w-5" /> },
  ]

  const clientLinks = [
    { href: "/dashboard/client", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/client/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/dashboard/client/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/dashboard/client/invoices", label: "Invoices", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/client/support", label: "Support", icon: <MessageSquare className="h-5 w-5" /> },
    {
      href: "/dashboard/client/appointments",
      label: "Appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
  ]

  const userLinks = [
    { href: "/dashboard/user", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/user/profile", label: "Profile", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/user/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    {
      href: "/dashboard/user/appointments",
      label: "Appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
  ]

  const links = dashboardType === "admin" ? adminLinks : dashboardType === "client" ? clientLinks : userLinks
  const dashboardTitle =
    dashboardType === "admin" ? "Admin Dashboard" : dashboardType === "client" ? "Client Dashboard" : "User Dashboard"

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header with Logo and Dashboard Title */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800">
            {!collapsed ? (
              <div className="flex items-center w-full px-4">
                <div className="flex items-center">
                  <img src="/logo.jpeg" alt="MAFL Logistics" className="h-8 w-auto rounded-full" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h2 className="text-base font-bold truncate">{dashboardTitle}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapsed}
                  className="hidden md:flex"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden" aria-label="Close sidebar">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center justify-center">
                  <img src="/logo.jpeg" alt="MAFL Logistics" className="h-8 w-auto rounded-full" />
                </div>
                <div className="mt-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapsed}
                    className="hidden md:flex"
                    aria-label="Expand sidebar"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="md:hidden"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-2 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className={`flex items-center justify-center flex-shrink-0 ${collapsed ? "w-full h-6" : ""}`}>
                      {React.cloneElement(link.icon, {
                        className: `${collapsed ? "h-6 w-6" : "h-5 w-5"} ${isActive ? "text-primary" : ""}`,
                      })}
                    </span>
                    {!collapsed && <span className="ml-3 truncate font-bold">{link.label}</span>}
                  </Link>
                )
              })}
            </nav>

            <Separator className="my-4" />

            {/* Quick Access Links */}
            <div className="space-y-1">
              <Link
                href="/dashboard/admin/settings"
                className="flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className={`flex items-center justify-center flex-shrink-0 ${collapsed ? "w-full h-6" : ""}`}>
                  <Settings className={collapsed ? "h-6 w-6" : "h-5 w-5"} />
                </span>
                {!collapsed && <span className="ml-3 truncate font-bold">Settings</span>}
              </Link>
              <Link
                href="/"
                className="flex items-center px-2 py-2 rounded-md transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className={`flex items-center justify-center flex-shrink-0 ${collapsed ? "w-full h-6" : ""}`}>
                  <Home className={collapsed ? "h-6 w-6" : "h-5 w-5"} />
                </span>
                {!collapsed && <span className="ml-3 truncate font-bold">Back to Website</span>}
              </Link>
            </div>
          </ScrollArea>

          {/* Admin Profile at Bottom */}
          <div className={`px-4 py-4 border-t border-gray-200 dark:border-gray-800 ${collapsed ? "text-center" : ""}`}>
            {!collapsed ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src={adminData.avatar || "/placeholder.svg"} alt={adminData.name} />
                  <AvatarFallback>{adminData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{adminData.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{adminData.role}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">Back to Website</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                      <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={adminData.avatar || "/placeholder.svg"} alt={adminData.name} />
                        <AvatarFallback>{adminData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{adminData.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">Back to Website</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
