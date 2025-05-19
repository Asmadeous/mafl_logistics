"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

// Mock data for applications
const applications = [
  {
    id: 1,
    name: "John Kamau",
    email: "john.kamau@example.com",
    position: "Logistics Coordinator",
    date: "April 28, 2025",
    experience: "3 years",
    status: "New",
  },
  {
    id: 2,
    name: "Sarah Odhiambo",
    email: "sarah.odhiambo@example.com",
    position: "Fleet Manager",
    date: "April 27, 2025",
    experience: "7 years",
    status: "Reviewing",
  },
  {
    id: 3,
    name: "David Mwangi",
    email: "david.mwangi@example.com",
    position: "Warehouse Supervisor",
    date: "April 25, 2025",
    experience: "5 years",
    status: "Interviewing",
  },
  {
    id: 4,
    name: "Grace Njeri",
    email: "grace.njeri@example.com",
    position: "Logistics Coordinator",
    date: "April 24, 2025",
    experience: "2 years",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Michael Otieno",
    email: "michael.otieno@example.com",
    position: "Fleet Manager",
    date: "April 22, 2025",
    experience: "4 years",
    status: "New",
  },
  {
    id: 6,
    name: "Jane Wanjiku",
    email: "jane.wanjiku@example.com",
    position: "Customer Service Representative",
    date: "April 20, 2025",
    experience: "3 years",
    status: "Hired",
  },
  {
    id: 7,
    name: "Peter Omondi",
    email: "peter.omondi@example.com",
    position: "Warehouse Supervisor",
    date: "April 18, 2025",
    experience: "6 years",
    status: "Interviewing",
  },
  {
    id: 8,
    name: "Lucy Akinyi",
    email: "lucy.akinyi@example.com",
    position: "Logistics Coordinator",
    date: "April 15, 2025",
    experience: "1 year",
    status: "Rejected",
  },
]

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter applications based on search query and status filter
  const filteredApplications = applications.filter(
    (application) =>
      (application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.position.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "All" || application.status === statusFilter),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/careers">Back to Careers</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>View and manage all job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by name, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-md"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.position}</TableCell>
                    <TableCell>{application.date}</TableCell>
                    <TableCell>{application.experience}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "New"
                            ? "default"
                            : application.status === "Reviewing"
                              ? "outline"
                              : application.status === "Interviewing"
                                ? "secondary"
                                : application.status === "Hired"
                                  ? "success"
                                  : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/admin/careers/applications/${application.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
