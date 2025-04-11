import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon } from "lucide-react"

export default function OrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RocketIcon className="mr-2 h-5 w-5 text-primary" />
            Coming Soon
          </CardTitle>
          <CardDescription>The orders management system is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <RocketIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Orders Management</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We're working hard to bring you a comprehensive orders management system. This feature will allow you to
              track, manage, and process customer orders efficiently.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Expected features:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Order tracking and status updates</li>
                <li>Customer order history</li>
                <li>Order processing workflow</li>
                <li>Delivery scheduling and tracking</li>
                <li>Order analytics and reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
