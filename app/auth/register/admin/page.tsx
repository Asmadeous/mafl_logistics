"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import UnifiedRegisterPage from "../page"

export default function AdminRegisterPage() {
  const router = useRouter()

  // Add a special query parameter to indicate admin access
  useEffect(() => {
    // Add admin_access query parameter to the URL
    const url = new URL(window.location.href)
    url.searchParams.set("admin_access", "true")
    window.history.replaceState({}, "", url.toString())
  }, [])

  return <UnifiedRegisterPage defaultUserType="employee" />
}
