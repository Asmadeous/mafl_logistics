"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Briefcase, Shield, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function UnifiedLoginPage({ defaultUserType = "user" }: { defaultUserType?: "user" | "client" | "employee" }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"user" | "client" | "employee">(defaultUserType)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare login data according to the schema
      let loginData: any = {}

      if (userType === "user") {
        loginData = {
          user: {
            email,
            password,
            remember_me: rememberMe,
          },
        }
      } else if (userType === "client") {
        loginData = {
          client: {
            email,
            password,
            remember_me: rememberMe,
          },
        }
      } else {
        loginData = {
          employee: {
            email,
            password,
            remember_me: rememberMe,
          },
        }
      }

      const success = await login(email, password, userType, rememberMe)


      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back to MAFL Logistics${userType === "employee" ? " Admin" : ""}!`,
        })
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (userType !== "user") {
      toast({
        title: "Google Login Unavailable",
        description: "Google login is only available for regular users.",
        variant: "destructive",
      })
      return
    }

    setIsGoogleLoading(true)

    try {
      // This is a placeholder for Google OAuth integration
      // In a real implementation, you would use the Google OAuth API
      window.location.href = "/users/auth/google_oauth2"
    } catch (error) {
      toast({
        title: "Google Login Failed",
        description: "There was an error logging in with Google. Please try again.",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  const getUserTypeIcon = () => {
    switch (userType) {
      case "client":
        return <Briefcase className="h-10 w-10 text-primary" />
      case "employee":
        return <Shield className="h-10 w-10 text-primary" />
      default:
        return <User className="h-10 w-10 text-primary" />
    }
  }

  const getUserTypeTitle = () => {
    switch (userType) {
      case "client":
        return "Client Sign In"
      case "employee":
        return "Employee Sign In"
      default:
        return "User Sign In"
    }
  }

  const getUserTypeDescription = () => {
    switch (userType) {
      case "client":
        return "Enter your credentials to access your client account"
      case "employee":
        return "Enter your credentials to access the admin dashboard"
      default:
        return "Enter your credentials to access your account"
    }
  }

  return (
  <div className="min-h-screen flex flex-col md:flex-row">
    {/* Left side - Image/Brand section */}
    <div className="hidden md:flex md:w-1/2 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/70 z-10"></div>
      <Image
        src="/logistics-background.png"
        alt="MAFL Logistics"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-white p-12">
        <div className="mb-8">
          <Image
            src="/logo-white.png"
            alt="MAFL Logistics Logo"
            width={120}
            height={120}
            className="mx-auto rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">MAFL Logistics</h1>
        <p className="text-lg text-center">
          Streamlining logistics for a seamless experience
        </p>
      </div>
    </div>

    {/* Right side - Login form */}
    <div className="flex w-full md:w-1/2 items-center justify-center bg-background p-6 md:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {getUserTypeIcon()}
          <h2 className="mt-6 text-3xl font-bold text-foreground">{getUserTypeTitle()}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{getUserTypeDescription()}</p>
        </div>

        {/* User Type Selector */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setUserType("user")}
            className={`px-4 py-2 rounded-md ${userType === "user" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
          >
            User
          </button>
          <button
            onClick={() => setUserType("client")}
            className={`px-4 py-2 rounded-md ${userType === "client" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
          >
            Client
          </button>
          <button
            onClick={() => setUserType("employee")}
            className={`px-4 py-2 rounded-md ${userType === "employee" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
          >
            Employee
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              aria-label="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-foreground">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Google Login */}
        {userType === "user" && (
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground hover:bg-muted disabled:opacity-50"
          >
            {isGoogleLoading ? "Loading..." : "Sign in with Google"}
          </button>
        )}

        {/* Sign-up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  </div>
)};
