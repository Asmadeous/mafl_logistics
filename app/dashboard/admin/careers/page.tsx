"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import type { JobListing } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function CareersAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newJobData, setNewJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    description: "",
    responsibilities: "",
    requirements: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchJobListings = async () => {
      setIsLoading(true)
      try {
        const response = await api.jobListings.getAll()
        if (response.error) {
          setError(response.error)
        } else {
          setJobListings(response.data || [])
        }
      } catch (err) {
        setError("Failed to load job listings. Please try again later.")
        console.error("Error fetching job listings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobListings()
  }, [])

  // Fallback to mock data if API fails or returns empty data
  const useMockData = isLoading || error || jobListings.length === 0

  // Mock data as fallback
  const mockJobListings = [
    {
      id: "1",
      title: "Logistics Coordinator",
      department: "Operations",
      location: "Nairobi, Kenya",
      type: "Full-time",
      postedDate: "April 15, 2025",
      applications: 12,
      status: "Active",
    },
    {
      id: "2",
      title: "Fleet Manager",
      department: "Transportation",
      location: "Mombasa, Kenya",
      type: "Full-time",
      postedDate: "April 10, 2025",
      applications: 8,
      status: "Active",
    },
    {
      id: "3",
      title: "Warehouse Supervisor",
      department: "Warehousing",
      location: "Nairobi, Kenya",
      type: "Full-time",
      postedDate: "April 5, 2025",
      applications: 15,
      status: "Active",
    },
    {
      id: "4",
      title: "Customer Service Representative",
      department: "Customer Service",
      location: "Nairobi, Kenya",
      type: "Part-time",
      postedDate: "March 28, 2025",
      applications: 24,
      status: "Closed",
    },
  ]

  // Format API data for display
  const formatJobListing = (job: JobListing) => {
    return {
      id: job.id,
      title: job.title,
      department: job.department || "Operations",
      location: job.location || "Nairobi, Kenya",
      type: job.employment_type || "Full-time",
      postedDate: new Date(job.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      applications: job.applications?.length || 0,
      status: job.status === "published" ? "Active" : job.status === "closed" ? "Closed" : "Draft",
    }
  }

  // Use either API data or mock data
  const displayListings = useMockData ? mockJobListings : jobListings.map(formatJobListing)

  // Filter job listings based on search query
  const filteredJobs = displayListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setNewJobData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCreateJob = async () => {
    setIsSubmitting(true)
    try {
      // Prepare job data
      const jobData = {
        title: newJobData.title,
        department: newJobData.department,
        location: newJobData.location,
        employment_type: newJobData.type,
        description: newJobData.description,
        responsibilities: newJobData.responsibilities,
        requirements: newJobData.requirements,
        status: "published",
      }

      // Create job listing
      const response = await api.jobListings.create(jobData)

      if (response.error) {
        toast({
          title: "Failed to Create Job",
          description: response.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Job Created",
          description: "The job listing has been successfully created.",
        })

        // Reset form and refresh data
        setNewJobData({
          title: "",
          department: "",
          location: "",
          type: "full-time",
          description: "",
          responsibilities: "",
          requirements: "",
        })

        // Refresh job listings
        const refreshResponse = await api.jobListings.getAll()
        if (!refreshResponse.error) {
          setJobListings(refreshResponse.data || [])
        }
      }
    } catch (err) {
      toast({
        title: "Failed to Create Job",
        description: "There was an error creating the job listing. Please try again later.",
        variant: "destructive",
      })
      console.error("Error creating job listing:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Careers Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Position
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Job Position</DialogTitle>
              <DialogDescription>Create a new job listing to appear on the careers page.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Logistics Coordinator"
                    value={newJobData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g. Operations"
                    value={newJobData.department}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Nairobi, Kenya"
                    value={newJobData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newJobData.type}
                    onChange={handleInputChange}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job role, responsibilities, and requirements"
                  rows={5}
                  value={newJobData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Key Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  placeholder="Enter key responsibilities, one per line"
                  rows={3}
                  value={newJobData.responsibilities}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Enter job requirements, one per line"
                  rows={3}
                  value={newJobData.requirements}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreateJob} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Listing"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>Manage job positions and view applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search job listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-12 flex items-center">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No job listings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{job.postedDate}</TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell>
                        <Badge
                          variant={job.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/admin/careers/${job.id}/applications`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View applications</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {displayListings.length} job listings
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>View and manage recent job applications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-12 flex items-center">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: 1,
                    name: "John Kamau",
                    position: "Logistics Coordinator",
                    date: "April 28, 2025",
                    experience: "3 years",
                    status: "New",
                  },
                  {
                    id: 2,
                    name: "Sarah Odhiambo",
                    position: "Fleet Manager",
                    date: "April 27, 2025",
                    experience: "7 years",
                    status: "Reviewing",
                  },
                  {
                    id: 3,
                    name: "David Mwangi",
                    position: "Warehouse Supervisor",
                    date: "April 25, 2025",
                    experience: "5 years",
                    status: "Interviewing",
                  },
                  {
                    id: 4,
                    name: "Grace Njeri",
                    position: "Logistics Coordinator",
                    date: "April 24, 2025",
                    experience: "2 years",
                    status: "Rejected",
                  },
                ].map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="ml-auto">
            <Link href="/dashboard/admin/careers/applications">View All Applications</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
