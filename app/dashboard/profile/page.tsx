"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Camera } from "lucide-react"

// Profile form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  avatar: z.string().nullable().optional(),
})

// Password form validation schema
const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, { message: "Current password is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

export default function ProfilePage() {
  const { user } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
    },
  })

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  })

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAvatarFile(file)
    }
  }

  // Profile update handler
  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsUpdating(true)
      setUpdateError(null)
      setUpdateSuccess(null)

      // Create FormData for file upload if there's a new avatar
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(`user[${key}]`, value as string)
        }
      })

      // Add avatar file if it exists
      if (avatarFile) {
        formData.append("user[avatar]", avatarFile)
      }

      // Call API to update profile
      await api.user.updateProfileWithAvatar(formData)

      setUpdateSuccess("Profile updated successfully")
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Password update handler
  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    try {
      setIsUpdating(true)
      setPasswordError(null)
      setPasswordSuccess(null)

      // Call API to update password
      await api.user.updatePassword(values)

      setPasswordSuccess("Password updated successfully")
      passwordForm.reset()
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information and avatar</CardDescription>
            </CardHeader>
            <CardContent>
              {updateError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

              {updateSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{updateSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <AvatarImage src={avatarPreview || user?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{user?.name?.charAt(0) || user?.email.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{user?.name || user?.email}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Email cannot be changed. Contact support if you need to update your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>Ensure your account is using a secure password</CardDescription>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              )}

              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 8 characters long</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
