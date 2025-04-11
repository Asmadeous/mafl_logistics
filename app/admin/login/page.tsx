import { AdminLoginForm } from "@/components/auth/admin-login-form"

export const metadata = {
  title: "Admin Login - MAFL Logistics",
  description: "Sign in to the MAFL Logistics admin panel",
}

export default function AdminLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Sign in with your admin credentials</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
