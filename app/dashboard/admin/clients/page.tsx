"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building,
  ChevronDown,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useClientManagement } from "@/hooks/use-client-management"

// Replace the mock client data with this
// const clients = [] // We'll load this from the API

// Mock pending applications
const pendingApplications = [
  {
    id: 101,
    companyName: "Nairobi Distributors",
    contactName: "Peter Omondi",
    email: "peter@nairobidist.co.ke",
    phone: "+254 778 901 234",
    businessType: "Retail",
    submittedDate: "Apr 1, 2025",
    status: "Pending Review",
  },
  {
    id: 102,
    companyName: "Meru Farmers Cooperative",
    contactName: "Jane Muthoni",
    email: "jane@merufarmers.co.ke",
    phone: "+254 789 012 345",
    businessType: "Agriculture",
    submittedDate: "Apr 3, 2025",
    status: "Pending Review",
  },
  {
    id: 103,
    companyName: "Eldoret Constructors Ltd",
    contactName: "Samuel Kipchirchir",
    email: "samuel@eldoretconstructors.co.ke",
    phone: "+254 790 123 456",
    businessType: "Construction",
    submittedDate: "Apr 5, 2025",
    status: "Pending Review",
  },
]

// Update the ClientsPage component to use the API
export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  // Use our custom hook
  const { clients, isLoading, error, fetchClients, createClient, deleteClient } = useClientManagement()

  // Load clients when the component mounts
  useEffect(() => {
    fetchClients(currentPage, searchTerm)
  }, [currentPage, searchTerm, fetchClients])

  // Handle search
  const handleSearch = () => {
    fetchClients(1, searchTerm)
    setCurrentPage(1)
  }

  // Handle add client
  const handleAddClient = async (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target)
    const clientData = {
      company_name: formData.get("companyName"),
      email: formData.get("email"),
      phone_number: formData.get("phone"),
      address: formData.get("address"),
      billing_contact_name: formData.get("contactName"),
      billing_contact_email: formData.get("email"),
      billing_address: formData.get("address"),
      service_type: formData.get("accountType"),
      notes: formData.get("description"),
    }

    const success = await createClient(clientData)

    if (success) {
      setIsAddingClient(false)
      fetchClients(currentPage, searchTerm)
    }
  }

  // Handle approve application
  const handleApproveApplication = (id) => {
    toast({
      title: "Application approved",
      description: "The client application has been approved and account created.",
    })
  }

  // Handle reject application
  const handleRejectApplication = (id) => {
    toast({
      title: "Application rejected",
      description: "The client application has been rejected.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Enter the details of the new client to add them to the system.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddClient} className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" name="companyName" placeholder="ACME Corporation" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Person</Label>
                      <Input id="contactName" name="contactName" placeholder="John Doe" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="contact@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="+254 712 345 678" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="123 Business Street" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" placeholder="Nairobi" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" placeholder="Kenya" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select defaultValue="retail">
                        <SelectTrigger id="businessType">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Select defaultValue="11-50">
                        <SelectTrigger id="employeeCount">
                          <SelectValue placeholder="Select employee count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about the business and their logistics needs..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" placeholder="company_admin" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialPassword">Initial Password</Label>
                      <Input
                        id="initialPassword"
                        name="initialPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                      <p className="text-xs text-gray-500">The client will be prompted to change this on first login</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select defaultValue="client">
                      <SelectTrigger id="accountType">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Standard Client</SelectItem>
                        <SelectItem value="premium">Premium Client</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddingClient(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Client Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Active Clients</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Pending Applications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>Manage your client accounts and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search clients..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                          <Filter className="h-4 w-4" />
                          <span>Filter</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem>All Clients</DropdownMenuItem>
                        <DropdownMenuItem>Active Clients</DropdownMenuItem>
                        <DropdownMenuItem>Inactive Clients</DropdownMenuItem>
                        <DropdownMenuItem>Government</DropdownMenuItem>
                        <DropdownMenuItem>Corporate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients
                        ?.filter(
                          (client) =>
                            client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.billing_contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.email.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.company_name}</TableCell>
                            <TableCell>
                              <div>{client.billing_contact_name}</div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </TableCell>
                            <TableCell>{client.service_type}</TableCell>
                            <TableCell>{client.address}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  client.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                                }`}
                              >
                                {client.status}
                              </span>
                            </TableCell>
                            <TableCell>{client.created_at}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Link href={`/dashboard/admin/clients/${client.id}`} className="w-full">
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit Client</DropdownMenuItem>
                                  <DropdownMenuItem>Manage Services</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Client Applications</CardTitle>
              <CardDescription>Review and process new client applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Business Type</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.companyName}</TableCell>
                          <TableCell>
                            <div>{application.contactName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </TableCell>
                          <TableCell>{application.businessType}</TableCell>
                          <TableCell>{application.submittedDate}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
                              {application.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600"
                                onClick={() => handleApproveApplication(application.id)}
                              >
                                <span className="sr-only">Approve</span>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handleRejectApplication(application.id)}
                              >
                                <span className="sr-only">Reject</span>
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/admin/applications/${application.id}`}>
                                  <span className="sr-only">View Details</span>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
