import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Reset Password | MAFL Logistics Admin",
  description: "Reset your MAFL Logistics admin account password",
}

interface ResetPasswordPageProps {
  searchParams: { token?: string }
}

export default function AdminResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams.token || ""

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Invalid Reset Link</h1>
            <p className="text-sm text-muted-foreground">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Admin Password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password</p>
        </div>
        <ResetPasswordForm token={token} isEmployee={true} />
      </div>
    </div>
  )
}
