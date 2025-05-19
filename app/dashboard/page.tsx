import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCog, Users, Package } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Selector</h1>
        <p className="text-muted-foreground mt-2">Select the dashboard you want to access based on your role.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Admin Dashboard</CardTitle>
              <UserCog className="h-6 w-6 text-orange-500" />
            </div>
            <CardDescription>Full access to all system features and management tools</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm">
              Access user management, inventory, orders, fleet management, support chats, invoices, and blog management.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin">Access Admin Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Dashboard</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <CardDescription>Standard user access for managing your account</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm">
              View your profile, update settings, track orders, and manage your personal information.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/user">Access User Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Dashboard</CardTitle>
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <CardDescription>Client portal for managing shipments and services</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm">
              Track shipments, view invoices, request services, and manage your business relationship with MAFL
              Logistics.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/client">Access Client Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
