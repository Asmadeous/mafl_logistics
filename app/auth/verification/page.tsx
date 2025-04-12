import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export const metadata = {
  title: "Email Verification | MAFL Logistics",
  description: "Email verification status for your MAFL Logistics account",
}

interface VerificationPageProps {
  searchParams: { success?: string; error?: string }
}

export default function VerificationPage({ searchParams }: VerificationPageProps) {
  const success = searchParams.success === "true"
  const errorMessage = searchParams.error || "Verification failed. The link may be invalid or expired."

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {success ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">{success ? "Email Verified" : "Verification Failed"}</CardTitle>
            <CardDescription>{success ? "Your email has been successfully verified." : errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {success
                ? "You can now log in to your account with your credentials."
                : "Please try again or contact support if the problem persists."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant={success ? "default" : "outline"}>
              <Link href="/auth/login">{success ? "Log In Now" : "Back to Login"}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
