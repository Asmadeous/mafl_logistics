"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, MapPin, Clock, Calendar, Building, DollarSign } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageBanner from "@/components/page-banner"
import api from "@/lib/api"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface JobListing {
  id: string
  slug: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
  location: string
  department: string
  employment_type: string
  salary_range: string
  status: string
  created_at: string
  updated_at: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const jobSlug = params.slug as string

  const [jobListing, setJobListing] = useState<JobListing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
  })

  // Fetch job listing details
  useEffect(() => {
    const fetchJobListing = async () => {
      setIsLoading(true)
      try {
        const response = await api.jobListings.getBySlug(jobSlug)

        if (response.error) {
          throw new Error(response.error)
        }

        setJobListing(response.data)
      } catch (err) {
        console.error("Error fetching job listing:", err)
        setError("Failed to load job details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (jobSlug) {
      fetchJobListing()
    }
  }, [jobSlug])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare application data according to the schema
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        content: formData.coverLetter,
        applicant_type: "guest", // Default to guest if not authenticated
      }

      // Submit application using the Rails API
      const response = await api.jobListings.apply(jobListing?.id || "", applicationData)

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. We'll be in touch soon!",
      })

      // Redirect to careers page after successful submission
      setTimeout(() => {
        router.push("/careers")
      }, 2000)
    } catch (err) {
      console.error("Error submitting application:", err)
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !jobListing) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error || "Job listing not found"}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/careers">Back to Careers</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <PageBanner
        title={jobListing.title}
        subtitle={`Join our ${jobListing.department} team at MAFL Logistics`}
        backgroundImage="/logistics-team-planning.png"
        imageAlt="MAFL Logistics Team"
      />

      <div className="container mx-auto py-12 px-4 md:px-6">
        <Link href="/careers" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{jobListing.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {jobListing.department}
                    </CardDescription>
                  </div>
                  <Badge variant={jobListing.status === "active" ? "default" : "secondary"}>
                    {jobListing.status === "active" ? "Active" : "Closing Soon"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{jobListing.location || "Nairobi, Kenya"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{jobListing.employment_type || "Full-time"}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{jobListing.department}</span>
                  </div>
                  {jobListing.salary_range && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{jobListing.salary_range}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Posted {format(new Date(jobListing.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <p className="whitespace-pre-line">{jobListing.description}</p>
                </div>

                {jobListing.responsibilities && jobListing.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobListing.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobListing.requirements && jobListing.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobListing.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobListing.qualifications && jobListing.qualifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobListing.qualifications.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobListing.benefits && jobListing.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {jobListing.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Position</CardTitle>
                <CardDescription>Fill out the form below to apply</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume/CV</Label>
                    <Input id="resume" type="file" accept=".pdf,.doc,.docx" required />
                    <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                      rows={5}
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Not the right position?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If this isn't exactly what you're looking for, you can submit a general application.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/careers/general-application">Submit General Application</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
