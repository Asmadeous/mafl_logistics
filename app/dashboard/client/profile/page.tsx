"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useClientProfile } from "@/hooks/use-client-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Building, Mail, Phone, MapPin, FileText, User } from "lucide-react"

export default function ClientProfilePage() {
  const { client, loading, error, fetchProfile, updateProfile } = useClientProfile()
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone_number: "",
    address: "",
    billing_contact_name: "",
    billing_contact_email: "",
    billing_address: "",
    tax_id: "",
    notes: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        email: client.email || "",
        phone_number: client.phone_number || "",
        address: client.address || "",
        billing_contact_name: client.billing_contact_name || "",
        billing_contact_email: client.billing_contact_email || "",
        billing_address: client.billing_address || "",
        tax_id: client.tax_id || "",
        notes: client.notes || "",
      })
    }
  }, [client])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }

  if (loading && !client) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-red-500">Error Loading Profile</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
        <Button onClick={() => fetchProfile()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Client Profile</h1>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Manage your company details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="billing_contact_name">Billing Contact Name</Label>
                    <Input
                      id="billing_contact_name"
                      name="billing_contact_name"
                      value={formData.billing_contact_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing_contact_email">Billing Contact Email</Label>
                    <Input
                      id="billing_contact_email"
                      name="billing_contact_email"
                      type="email"
                      value={formData.billing_contact_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing_address">Billing Address</Label>
                    <Input
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
                    <Input id="tax_id" name="tax_id" value={formData.tax_id} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Company Name</div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{client?.company_name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{client?.email}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{client?.phone_number || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{client?.address || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Billing Contact</div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{client?.billing_contact_name || "Not provided"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Billing Email</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{client?.billing_contact_email || "Not provided"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Billing Address</div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{client?.billing_address || "Not provided"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Tax ID / VAT Number</div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{client?.tax_id || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {client?.notes && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Additional Notes</h3>
                    <p className="text-muted-foreground">{client.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
