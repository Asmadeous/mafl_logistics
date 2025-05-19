"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UserRegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auth/register")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to unified registration page...</p>
    </div>
  )
}
