"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Mail,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShoppingCart,
  UserCircle,
  Building2,
  Receipt,
  Loader2,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAdmin, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname.startsWith("/admin/orders"),
    },
    {
      name: "Employees",
      href: "/admin/employees",
      icon: UserCircle,
      current: pathname.startsWith("/admin/employees"),
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Building2,
      current: pathname.startsWith("/admin/customers"),
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      current: pathname.startsWith("/admin/blog") || pathname === "/admin/subscribers",
      subItems: [
        { name: "All Posts", href: "/admin/blog" },
        { name: "Add New", href: "/admin/blog/new" },
        { name: "Categories", href: "/admin/blog/categories" },
        { name: "Tags", href: "/admin/blog/tags" },
        { name: "Subscribers", href: "/admin/subscribers" },
      ],
    },
    {
      name: "Invoices",
      href: "/admin/invoices",
      icon: Receipt,
      current: pathname.startsWith("/admin/invoices"),
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
      current: pathname === "/admin/notifications",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: Mail,
      current: pathname === "/admin/messages",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
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
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-lg font-semibold ml-1">Admin</span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </SheetClose>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="py-4 px-2">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <SheetClose asChild>
                      <Link
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
                    </SheetClose>
                    {item.subItems && item.current && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <SheetClose key={subItem.name} asChild>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block px-3 py-2 text-sm font-medium rounded-md",
                                pathname === subItem.href
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                              )}
                            >
                              {subItem.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-lg font-semibold ml-1">Admin</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
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
                  {item.subItems && item.current && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium rounded-md",
                            pathname === subItem.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.user_metadata?.name || user.email}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Back to Website</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-card border-b lg:hidden">
          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold text-mafl-orange">MAFL</span>
                <span className="text-lg font-semibold ml-1">Admin</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Back to Website</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
