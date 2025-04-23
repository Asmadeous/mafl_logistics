"use client"

import MessagesTab from "@/components/messaging/messages-tab"

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <MessagesTab />
    </div>
  )
}
