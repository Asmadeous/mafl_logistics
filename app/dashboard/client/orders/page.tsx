import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

export default function ClientOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">View and manage your logistics orders.</p>
      </div>

      <Card className="border-dashed border-2">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2 pt-6">
          <CalendarIcon className="h-12 w-12 text-muted-foreground/70" />
        </CardHeader>
        <CardContent className="text-center pb-6">
          <CardTitle className="text-xl mt-4 mb-2">Coming Soon</CardTitle>
          <CardDescription className="mx-auto max-w-md">
            Our order management system is currently under development. You'll soon be able to track, manage, and create
            new orders from this page.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
