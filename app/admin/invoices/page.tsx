import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptIcon } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice Management</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ReceiptIcon className="mr-2 h-5 w-5 text-primary" />
            Coming Soon
          </CardTitle>
          <CardDescription>The invoice management system is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <ReceiptIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Invoice Management</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We're working hard to bring you a comprehensive invoice management system. This feature will allow you to
              create, track, and manage invoices efficiently.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Expected features:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Invoice creation and customization</li>
                <li>Payment tracking</li>
                <li>Automated reminders</li>
                <li>Financial reporting</li>
                <li>Integration with accounting software</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
