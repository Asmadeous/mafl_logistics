"use client"

import { MessagesTab } from "@/components/messaging/messages-tab"

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      <MessagesTab isAdmin={false} />
    </div>
  )
}
