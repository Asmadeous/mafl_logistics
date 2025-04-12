"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminLoginForm from "@/components/auth/admin-login-form"
import { useSearchParams } from "next/navigation"

export default function AdminAuthPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "login"
  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">MAFL Logistics Admin</h1>
          <p className="text-sm text-muted-foreground">
            {activeTab === "login" ? "Sign in to access the admin dashboard" : "Admin access only"}
          </p>
        </div>

        <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="login">Admin Login</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AdminLoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
