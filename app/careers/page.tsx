"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Briefcase, MapPin, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageBanner from "@/components/page-banner"
import api from "@/lib/api"
import { format } from "date-fns"

interface JobListing {
  id: string
  slug: string
  title: string
  description: string
  location: string
  department: string
  employment_type: string
  salary_range: string
  status: string
  created_at: string
  updated_at: string
}

export default function CareersPage() {
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [filteredListings, setFilteredListings] = useState<JobListing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch job listings from the API
  useEffect(() => {
    const fetchJobListings = async () => {
      setIsLoading(true)
      try {
        const response = await api.jobListings.getAll()

        if (response.error) {
          throw new Error(response.error)
        }

        setJobListings(response.data || [])
        setFilteredListings(response.data || [])
      } catch (err) {
        console.error("Error fetching job listings:", err)
        setError("Failed to load job listings. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobListings()
  }, [])

  // Filter job listings based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredListings(jobListings)
      return
    }

    const filtered = jobListings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredListings(filtered)
  }, [searchTerm, jobListings])

  return (
    <>
      <Navbar />

      <PageBanner
        title="Careers at MAFL Logistics"
        subtitle="Join our team and help shape the future of logistics in East Africa"
        backgroundImage="/logistics-team-planning.png"
        imageAlt="MAFL Logistics Team"
      />

      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Current Openings</h2>
            <p className="text-muted-foreground">
              Discover opportunities to join our team and make an impact in the logistics industry
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search positions by title, location, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-muted rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardFooter>
            </Card>
          ) : filteredListings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Positions Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {searchTerm
                    ? `No positions matching "${searchTerm}" were found. Please try a different search term.`
                    : "There are currently no open positions. Please check back later or submit a general application."}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/careers/general-application">Submit General Application</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredListings.map((job) => (
                <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.department}
                        </CardDescription>
                      </div>
                      <Badge variant={job.status === "active" ? "default" : "secondary"}>
                        {job.status === "active" ? "Active" : "Closing Soon"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location || "Nairobi, Kenya"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.employment_type || "Full-time"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted {format(new Date(job.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                    <p className="line-clamp-3">{job.description}</p>
                  </CardContent>
                  <CardFooter className="bg-muted/50">
                    <Button asChild>
                      <Link href={`/careers/${job.slug}`}>View Details & Apply</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <div className="text-center mt-8">
                <p className="mb-4">Don't see a position that matches your skills?</p>
                <Button asChild variant="outline">
                  <Link href="/careers/general-application">Submit General Application</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
