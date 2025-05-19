"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EmployeeLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auth/login")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to unified login page...</p>
    </div>
  )
}
