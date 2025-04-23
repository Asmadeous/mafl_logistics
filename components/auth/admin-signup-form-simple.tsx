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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"

// Form validation schema
const formSchema = z
  .object({
    fullname: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    password_confirmation: z.string().min(1, { message: "Please confirm your password" }),
    role: z.enum(["admin", "staff"], { required_error: "Please select a role" }),
    avatar: z.any().optional(),
    full_picture: z.any().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

export default function AdminSignupFormSimple() {
  const { registerEmployee, googleAuthEmployee } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [fullPicturePreview, setFullPicturePreview] = useState<string | null>(null)
  const avatarFileRef = useRef<HTMLInputElement>(null)
  const fullPictureFileRef = useRef<HTMLInputElement>(null)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "admin",
      avatar: undefined,
      full_picture: undefined,
      terms: false,
    },
    mode: "onBlur",
  })

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Set the file in the form
      form.setValue("avatar", file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle full picture file selection
  const handleFullPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Set the file in the form
      form.setValue("full_picture", file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFullPicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create FormData for file uploads
      const formData = new FormData()
      formData.append("employee[name]", values.fullname)
      formData.append("employee[email]", values.email)
      formData.append("employee[password]", values.password)
      formData.append("employee[password_confirmation]", values.password_confirmation)
      formData.append("employee[role]", values.role)

      // Add avatar file if it exists
      if (avatarFileRef.current?.files?.[0]) {
        formData.append("employee[avatar]", avatarFileRef.current.files[0])
      }

      // Add full picture file if it exists
      if (fullPictureFileRef.current?.files?.[0]) {
        formData.append("employee[full_picture]", fullPictureFileRef.current.files[0])
      }

      // Register employee with FormData
      await registerEmployee(formData, true)

      // Add explicit redirection as a fallback
      console.log("Admin signup successful, redirecting to dashboard...")
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 500)
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Admin Account</CardTitle>
        <CardDescription>Enter your details to create a new admin account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar upload */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex justify-center mb-2">
                      <div className="relative">
                        <Avatar className="h-24 w-24 cursor-pointer" onClick={() => avatarFileRef.current?.click()}>
                          <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                          <AvatarFallback>
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
                          onClick={() => avatarFileRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </div>
                        <input
                          type="file"
                          ref={avatarFileRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Upload a profile picture</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Picture upload */}
            <FormField
              control={form.control}
              name="full_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Picture</FormLabel>
                  <FormControl>
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                      onClick={() => fullPictureFileRef.current?.click()}
                    >
                      {fullPicturePreview ? (
                        <div className="relative w-full h-48">
                          <img
                            src={fullPicturePreview || "/placeholder.svg"}
                            alt="Full Picture Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload a full picture</p>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fullPictureFileRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFullPictureChange}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Upload a full-length photo of yourself</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your role in the organization</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="terms">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4" onClick={googleAuthEmployee}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
