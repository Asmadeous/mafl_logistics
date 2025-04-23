"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

// Form validation schema
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, {
        message: "Please enter a valid phone number",
      }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    password_confirmation: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

// Maximum file size (1MB)
const MAX_FILE_SIZE = 1 * 1024 * 1024
// Maximum dimensions for image compression
const MAX_IMAGE_DIMENSIONS = 500

export default function SignupForm() {
  const { registerUser, googleAuthUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  })

  // Handle avatar file selection with validation
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    const file = event.target.files?.[0]

    if (!file) return

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image is too large. Maximum size is 1MB.")
      return
    }

    try {
      // Set the file in the form
      form.setValue("avatar", file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Error processing avatar:", err)
      setFileError("Error processing image. Please try another image.")
    }
  }

  // Compress and resize image before converting to base64
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_IMAGE_DIMENSIONS) {
              height = Math.round((height * MAX_IMAGE_DIMENSIONS) / width)
              width = MAX_IMAGE_DIMENSIONS
            }
          } else {
            if (height > MAX_IMAGE_DIMENSIONS) {
              width = Math.round((width * MAX_IMAGE_DIMENSIONS) / height)
              height = MAX_IMAGE_DIMENSIONS
            }
          }

          // Create canvas and draw resized image
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Could not get canvas context"))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Get base64 data with reduced quality
          const base64String = canvas.toDataURL("image/jpeg", 0.7)
          // Extract only the base64 data part (remove the data:image/jpeg;base64, prefix)
          const base64Data = base64String.split(",")[1]
          resolve(base64Data)
        }
        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
        img.src = event.target?.result as string
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(file)
    })
  }

  // Update the onSubmit function to ensure JSON submission with correct field names
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError(null)

      // Remove terms from the payload and map field names correctly
      const { terms, avatar, name, phone, ...otherUserData } = values

      // Create the payload object with correct field names
      const payload: any = {
        user: {
          full_name: name, // Map 'name' to 'full_name'
          phone_number: phone, // Map 'phone' to 'phone_number'
          ...otherUserData,
        },
      }

      // If there's an avatar, compress it and add to payload
      if (avatar instanceof File) {
        try {
          // Compress and resize the image before converting to base64
          const compressedBase64 = await compressImage(avatar)
          payload.user.avatar = compressedBase64
          console.log("Avatar compressed and added to payload")
        } catch (err) {
          console.error("Error compressing avatar:", err)
          // Continue with registration even if avatar processing fails
          setFileError("Error processing image. Continuing without avatar.")
        }
      }

      console.log("Sending JSON payload")

      // Force JSON submission by explicitly calling the API
      const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Registration failed with status ${response.status}`)
      }

      // Check for JWT token in response
      const data = await response.json()
      if (data && data.token) {
        // Use the JWT token handling from jwt-utils
        const { setToken } = await import("@/lib/jwt-utils")
        setToken(data.token)
      }

      // Redirect to login page with success message
      router.push("/auth/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Avatar upload */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                    <AvatarFallback>
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
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
              </div>

              {fileError && <div className="text-sm text-red-500 text-center">{fileError}</div>}
              <div className="text-xs text-muted-foreground text-center">Maximum file size: 1MB</div>

              <FormField
                control={form.control}
                name="name"
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
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} type="tel" />
                    </FormControl>
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
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

            <Button variant="outline" className="w-full mt-4" onClick={googleAuthUser}>
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => window.history.pushState(null, "", "/auth?tab=login")}
          >
            Log in
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}
