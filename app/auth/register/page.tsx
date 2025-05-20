"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole, Mail, User, CheckCircle2, Briefcase, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UnifiedRegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"user" | "client" | "employee">("user");
  const [companyName, setCompanyName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { register, googleAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let userData: any = {};

      if (userType === "user") {
        userData = {
          user: {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            password,
            password_confirmation: confirmPassword,
            remember_me: false,
          },
        };
      } else if (userType === "client") {
        userData = {
          client: {
            company_name: companyName,
            email,
            phone_number: phoneNumber,
            password,
            password_confirmation: confirmPassword,
            remember_me: false,
          },
        };
      } else {
        userData = {
          employee: {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            password,
            password_confirmation: confirmPassword,
            remember_me: false,
            role: "staff",
          },
        };
      }

      const success = await register(userData, userType);

      if (success) {
        toast({
          title: "Account Created",
          description: `Welcome to MAFL Logistics${userType === "employee" ? " Admin" : ""}!`,
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (userType !== "user") {
      toast({
        title: "Google Signup Unavailable",
        description: "Google signup is only available for regular users.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await googleAuth();
      if (!success) {
        throw new Error("Google authentication failed");
      }
    } catch (error) {
      toast({
        title: "Google Signup Failed",
        description: "There was an error signing up with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case "client":
        return <Briefcase className="h-10 w-10 text-primary" />;
      case "employee":
        return <Shield className="h-10 w-10 text-primary" />;
      default:
        return <User className="h-10 w-10 text-primary" />;
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case "client":
        return "Client Registration";
      case "employee":
        return "Employee Registration";
      default:
        return "User Registration";
    }
  };

  const getUserTypeDescription = () => {
    switch (userType) {
      case "client":
        return "Create a client account to manage your logistics operations";
      case "employee":
        return "Create an employee account to access the admin dashboard";
      default:
        return "Create an account to access our logistics services";
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/70 z-10"></div>
        <Image src="/logistics-background.png" alt="MAFL Logistics" fill className="object-cover opacity-60" priority />
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white p-12">
          <div className="mb-8">
            <Image src="/logo-white.png" alt="MAFL Logistics Logo" width={120} height={120} className="mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Join MAFL Logistics</h1>
          <p className="text-xl mb-8 text-center max-w-md">
            Create an account to access our logistics services and manage your shipments efficiently.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">Benefits of Joining</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>Track your shipments in real-time</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>Access detailed logistics reports</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>Manage your logistics operations efficiently</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-navy/95">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-4 md:hidden">
              <Link href="/" className="text-2xl font-bold text-navy dark:text-white">
                MAFL <span className="text-primary">Logistics</span>
              </Link>
            </div>
            <div className="flex justify-center mb-4">{getUserTypeIcon()}</div>
            <CardTitle className="text-2xl font-bold text-center">{getUserTypeTitle()}</CardTitle>
            <CardDescription className="text-center">{getUserTypeDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value as "user" | "client" | "employee")}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="user" id="user" className="peer sr-only" />
                <Label
                  htmlFor="user"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <User className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">User</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="client" id="client" className="peer sr-only" />
                <Label
                  htmlFor="client"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Briefcase className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Client</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="employee" id="employee" className="peer sr-only" />
                <Label
                  htmlFor="employee"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Shield className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Employee</span>
                </Label>
              </div>
            </RadioGroup>

            <form onSubmit={handleSubmit} className="space-y-5">
              {userType === "client" ? (
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="companyName"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                />
                <Label
                  htmlFor="marketing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to receive marketing emails, newsletters, and notifications
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {userType === "user" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignup}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Sign up with Google
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
            <DialogDescription>Last updated: May 1, 2023</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">{/* Privacy Policy content */}</div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPrivacyPolicy(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
            <DialogDescription>Last updated: May 1, 2023</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">{/* Terms of Service content */}</div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowTerms(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}