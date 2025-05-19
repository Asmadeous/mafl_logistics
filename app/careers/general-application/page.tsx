"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageBanner from "@/components/page-banner"

export default function GeneralApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    interests: "",
    coverLetter: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        experience: formData.experience,
        education: formData.education,
        interests: formData.interests,
        content: formData.coverLetter,
        is_general: true,
        applicant_type: "guest", // Default to guest if not authenticated
      }

      // Submit general application using the Rails API
      const response = await api.jobListings.apply("general", applicationData)

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Application Submitted",
        description:
          "Your general application has been successfully submitted. We'll keep your information on file for future opportunities.",
      })

      // Redirect to careers page after successful submission
      setTimeout(() => {
        router.push("/careers")
      }, 2000)
    } catch (err) {
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again later.",
        variant: "destructive",
      })
      console.error("Error submitting general application:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <PageBanner
        title="General Application"
        subtitle="Submit your information to be considered for future opportunities at MAFL Logistics"
        backgroundImage="/logistics-team-planning.png"
        imageAlt="MAFL Logistics Team"
      />

      <div className="container mx-auto py-12 px-4 md:px-6">
        <Link href="/careers" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Link>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>General Application</CardTitle>
              <CardDescription>
                Don't see a specific position that matches your skills? Submit a general application and we'll keep your
                information on file for future opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      placeholder="Enter years of relevant experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Education Level</Label>
                    <select
                      id="education"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <select
                    id="interests"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.interests}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select area of interest</option>
                    <option value="operations">Operations</option>
                    <option value="transportation">Transportation</option>
                    <option value="warehousing">Warehousing</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="administration">Administration</option>
                    <option value="finance">Finance</option>
                    <option value="it">Information Technology</option>
                    <option value="hr">Human Resources</option>
                    <option value="other">Other</option>
                  </select>
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
                    placeholder="Tell us about your skills, experience, and what type of role you're interested in at MAFL Logistics"
                    rows={5}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <CardFooter className="flex justify-end px-0">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  )
}
