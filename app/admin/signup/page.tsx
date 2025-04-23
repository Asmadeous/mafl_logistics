
import dynamic from "next/dynamic"

// Use dynamic import to avoid SSR issues
const AdminSignupFormSimple = dynamic(() => import("@/components/auth/admin-signup-form-simple"), {
  // ssr: false,
  loading: () => <p>Loading form...</p>,
})

export const metadata = {
  title: "Admin Sign Up | MAFL Logistics",
  description: "Create a new admin account for MAFL Logistics",
}

export default function AdminSignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create Admin Account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create a new admin account</p>
        </div>
        <AdminSignupFormSimple />
      </div>
    </div>
  )
}
