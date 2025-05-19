"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Search, Send, Filter, Clock, User, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Message, User as UserType, Employee, Client, Guest, Conversation } from "@/types"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define user types for filtering
type UserCategory = "all" | "client" | "user" | "guest"

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [userTypeFilter, setUserTypeFilter] = useState<UserCategory>("all")
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)

  // Fetch conversations and current employee data
  useEffect(() => {
    // In a real app, these would be API calls
    // Mock data for now
    const mockEmployee: Employee = {
      id: "1",
      full_name: "Mahdi M. Issack",
      email: "mahdi@maishalogistics.com",
      role: "admin",
      jti: "abc123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setCurrentEmployee(mockEmployee)

    // Mock users
    const mockUsers: UserType[] = [
      {
        id: "1",
        full_name: "Jane Wanjiku",
        email: "jane.wanjiku@gmail.com",
        phone_number: "+254745678901",
        jti: "user1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        full_name: "Michael Otieno",
        email: "michael.o@yahoo.com",
        phone_number: "+254756789012",
        jti: "user2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        full_name: "Grace Njeri",
        email: "grace.njeri@outlook.com",
        phone_number: "+254767890123",
        jti: "user3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Mock clients
    const mockClients: Client[] = [
      {
        id: "4",
        company_name: "Softcare Ltd",
        email: "john@softcare.co.ke",
        phone_number: "+254712345678",
        employee_id: "1",
        service_type: "standard",
        jti: "client1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "5",
        company_name: "Malimount Enterprises",
        email: "sarah@malimount.com",
        phone_number: "+254723456789",
        employee_id: "1",
        service_type: "premium",
        jti: "client2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "6",
        company_name: "Silvermon Solutions",
        email: "david@silvermon.co.ke",
        phone_number: "+254734567890",
        employee_id: "1",
        service_type: "standard",
        jti: "client3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Mock guests
    const mockGuests: Guest[] = [
      {
        id: "7",
        name: "Guest Visitor",
        email: "visitor@example.com",
        token: "guest1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // User conversations
    const userConversations: Conversation[] = [
      {
        id: "1",
        user_id: "1",
        employee_id: "1",
        last_message_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        user: mockUsers[0],
        employee: mockEmployee,
        messages: [
          {
            id: "1",
            conversation_id: "1",
            sender_id: "1",
            sender_type: "User",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "Hello, I'm having an issue with tracking my delivery.",
            read: true,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "2",
            conversation_id: "1",
            sender_id: "1",
            sender_type: "Employee",
            receiver_id: "1",
            receiver_type: "User",
            content: "I'll help you track your delivery. Could you provide the tracking number?",
            read: true,
            created_at: new Date(Date.now() - 3500000).toISOString(),
            updated_at: new Date(Date.now() - 3500000).toISOString(),
          },
          {
            id: "3",
            conversation_id: "1",
            sender_id: "1",
            sender_type: "User",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "The tracking number is MAFL-2023-7890.",
            read: false,
            created_at: new Date(Date.now() - 120000).toISOString(),
            updated_at: new Date(Date.now() - 120000).toISOString(),
          },
        ],
      },
      {
        id: "2",
        user_id: "2",
        employee_id: "1",
        last_message_at: new Date(Date.now() - 7000000).toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 7000000).toISOString(),
        user: mockUsers[1],
        employee: mockEmployee,
        messages: [
          {
            id: "4",
            conversation_id: "2",
            sender_id: "2",
            sender_type: "User",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "I need information about your international shipping rates.",
            read: true,
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "5",
            conversation_id: "2",
            sender_id: "1",
            sender_type: "Employee",
            receiver_id: "2",
            receiver_type: "User",
            content: "I'd be happy to provide that information. Which countries are you interested in?",
            read: true,
            created_at: new Date(Date.now() - 7000000).toISOString(),
            updated_at: new Date(Date.now() - 7000000).toISOString(),
          },
          {
            id: "6",
            conversation_id: "2",
            sender_id: "2",
            sender_type: "User",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "I'm looking for rates to the UK and Germany.",
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      },
    ]

    // Client conversations
    const clientConversations: Conversation[] = [
      {
        id: "4",
        client_id: "4",
        employee_id: "1",
        last_message_at: new Date(Date.now() - 5000000).toISOString(),
        created_at: new Date(Date.now() - 100000000).toISOString(),
        updated_at: new Date(Date.now() - 5000000).toISOString(),
        client: mockClients[0],
        employee: mockEmployee,
        messages: [
          {
            id: "10",
            conversation_id: "4",
            sender_id: "4",
            sender_type: "Client",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "We need to discuss our contract renewal terms.",
            read: true,
            created_at: new Date(Date.now() - 100000000).toISOString(),
            updated_at: new Date(Date.now() - 100000000).toISOString(),
          },
          {
            id: "11",
            conversation_id: "4",
            sender_id: "1",
            sender_type: "Employee",
            receiver_id: "4",
            receiver_type: "Client",
            content: "I'd be happy to discuss that. What specific aspects would you like to review?",
            read: true,
            created_at: new Date(Date.now() - 95000000).toISOString(),
            updated_at: new Date(Date.now() - 95000000).toISOString(),
          },
          {
            id: "12",
            conversation_id: "4",
            sender_id: "4",
            sender_type: "Client",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "We'd like to increase our monthly shipment volume and discuss volume discounts.",
            read: false,
            created_at: new Date(Date.now() - 5000000).toISOString(),
            updated_at: new Date(Date.now() - 5000000).toISOString(),
          },
        ],
      },
    ]

    // Guest conversations
    const guestConversations: Conversation[] = [
      {
        id: "7",
        guest_id: "7",
        employee_id: "1",
        last_message_at: new Date(Date.now() - 1000000).toISOString(),
        created_at: new Date(Date.now() - 30000000).toISOString(),
        updated_at: new Date(Date.now() - 1000000).toISOString(),
        guest: mockGuests[0],
        employee: mockEmployee,
        messages: [
          {
            id: "16",
            conversation_id: "7",
            sender_id: "7",
            sender_type: "Guest",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "Hello, I'm interested in your logistics services.",
            read: true,
            created_at: new Date(Date.now() - 30000000).toISOString(),
            updated_at: new Date(Date.now() - 30000000).toISOString(),
          },
          {
            id: "17",
            conversation_id: "7",
            sender_id: "1",
            sender_type: "Employee",
            receiver_id: "7",
            receiver_type: "Guest",
            content: "Thank you for your interest! How can I help you today?",
            read: true,
            created_at: new Date(Date.now() - 25000000).toISOString(),
            updated_at: new Date(Date.now() - 25000000).toISOString(),
          },
          {
            id: "18",
            conversation_id: "7",
            sender_id: "7",
            sender_type: "Guest",
            receiver_id: "1",
            receiver_type: "Employee",
            content: "I need information about your shipping rates to Tanzania.",
            read: false,
            created_at: new Date(Date.now() - 1000000).toISOString(),
            updated_at: new Date(Date.now() - 1000000).toISOString(),
          },
        ],
      },
    ]

    // Combine all conversations
    const allConversations = [...userConversations, ...clientConversations, ...guestConversations]
    setConversations(allConversations)

    // Calculate total unread count
    const unreadCount = allConversations.reduce((total, conv) => {
      return (
        total +
        (conv.messages?.filter(
          (msg) =>
            !msg.read && (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest"),
        ).length || 0)
      )
    }, 0)

    setTotalUnreadCount(unreadCount)
  }, [])

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation])

  // Update the filteredConversations function to handle all conversation types
  const filteredConversations = conversations.filter((conversation) => {
    // Get the name and email based on the conversation type
    const name = conversation.user?.full_name || conversation.client?.company_name || conversation.guest?.name || ""
    const email = conversation.user?.email || conversation.client?.email || conversation.guest?.email || ""

    // Filter by search term
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.messages?.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by read/unread status
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" &&
        conversation.messages?.some(
          (msg) =>
            !msg.read && (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest"),
        )) ||
      (activeTab === "read" && conversation.messages?.every((msg) => msg.read || msg.sender_type === "Employee"))

    // Filter by user type
    const matchesUserType =
      userTypeFilter === "all" ||
      (userTypeFilter === "user" && conversation.user) ||
      (userTypeFilter === "client" && conversation.client) ||
      (userTypeFilter === "guest" && conversation.guest)

    return matchesSearch && matchesTab && matchesUserType
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation || !currentEmployee) return

    const receiverId =
      selectedConversation.user_id || selectedConversation.client_id || selectedConversation.guest_id || ""

    const receiverType = selectedConversation.user_id ? "User" : selectedConversation.client_id ? "Client" : "Guest"

    const newMessageObj: Message = {
      id: Date.now().toString(),
      conversation_id: selectedConversation.id,
      sender_id: currentEmployee.id,
      sender_type: "Employee",
      receiver_id: receiverId,
      receiver_type: receiverType,
      content: newMessage,
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Update conversations with new message
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...(conv.messages || []), newMessageObj],
              last_message_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : conv,
      ),
    )

    // Update selected conversation
    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...(prev.messages || []), newMessageObj],
            last_message_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : null,
    )

    setNewMessage("")
  }

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages?.map((msg) =>
                (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest") && !msg.read
                  ? { ...msg, read: true, updated_at: new Date().toISOString() }
                  : msg,
              ),
            }
          : conv,
      )

      // Recalculate total unread count
      const newUnreadCount = updatedConversations.reduce((total, conv) => {
        return (
          total +
          (conv.messages?.filter(
            (msg) =>
              !msg.read && (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest"),
          ).length || 0)
        )
      }, 0)

      setTotalUnreadCount(newUnreadCount)

      return updatedConversations
    })

    // Update selected conversation if it's the one being marked as read
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: prev.messages?.map((msg) =>
                (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest") && !msg.read
                  ? { ...msg, read: true, updated_at: new Date().toISOString() }
                  : msg,
              ),
            }
          : null,
      )
    }
  }

  // Update the getUnreadCount function to handle all message types
  const getUnreadCount = (conversation: Conversation) => {
    return (
      conversation.messages?.filter(
        (msg) =>
          !msg.read && (msg.sender_type === "User" || msg.sender_type === "Client" || msg.sender_type === "Guest"),
      ).length || 0
    )
  }

  // Add functions to get unread counts by type
  const getUserUnreadCount = () => {
    return conversations
      .filter((conv) => conv.user)
      .reduce((total, conv) => {
        return total + (conv.messages?.filter((msg) => !msg.read && msg.sender_type === "User").length || 0)
      }, 0)
  }

  const getClientUnreadCount = () => {
    return conversations
      .filter((conv) => conv.client)
      .reduce((total, conv) => {
        return total + (conv.messages?.filter((msg) => !msg.read && msg.sender_type === "Client").length || 0)
      }, 0)
  }

  const getGuestUnreadCount = () => {
    return conversations
      .filter((conv) => conv.guest)
      .reduce((total, conv) => {
        return total + (conv.messages?.filter((msg) => !msg.read && msg.sender_type === "Guest").length || 0)
      }, 0)
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "h:mm a")
  }

  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return format(date, "h:mm a")
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return format(date, "EEEE") // Day name
    } else {
      return format(date, "MMM d") // Month and day
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Support Conversations</h1>
        <Badge variant={totalUnreadCount > 0 ? "destructive" : "outline"} className="text-sm">
          {totalUnreadCount} unread
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversation List */}
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="px-4 pb-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Select value={userTypeFilter} onValueChange={(value) => setUserTypeFilter(value as UserCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conversations</SelectItem>
                  <SelectItem value="user">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Users
                      {getUserUnreadCount() > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {getUserUnreadCount()}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                  <SelectItem value="client">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Clients
                      {getClientUnreadCount() > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {getClientUnreadCount()}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                  <SelectItem value="guest">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Guests
                      {getGuestUnreadCount() > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {getGuestUnreadCount()}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                  Unread
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalUnreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Most Messages</DropdownMenuItem>
                  <DropdownMenuItem>Least Messages</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border border-primary/20"
                        : getUnreadCount(conversation) > 0
                          ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/20"
                          : "hover:bg-muted border border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      markConversationAsRead(conversation.id)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`/generic-placeholder-image.png?key=rcvwu&text=${
                            conversation.user?.full_name?.charAt(0) ||
                            conversation.client?.company_name?.charAt(0) ||
                            conversation.guest?.name?.charAt(0) ||
                            "?"
                          }`}
                          alt={
                            conversation.user?.full_name ||
                            conversation.client?.company_name ||
                            conversation.guest?.name ||
                            "Unknown"
                          }
                        />
                        <AvatarFallback>
                          {conversation.user
                            ? conversation.user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : conversation.client
                              ? conversation.client.company_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : conversation.guest
                                ? conversation.guest.name.charAt(0)
                                : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.user?.full_name ||
                              conversation.client?.company_name ||
                              conversation.guest?.name ||
                              "Unknown"}
                          </h4>
                          <div className="flex items-center">
                            {getUnreadCount(conversation) > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {getUnreadCount(conversation)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {conversation.client ? (
                            <Badge variant="outline" className="mr-1">
                              <Building2 className="h-3 w-3 mr-1" />
                              Client
                            </Badge>
                          ) : conversation.user ? (
                            <Badge variant="outline" className="mr-1">
                              <User className="h-3 w-3 mr-1" />
                              User
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="mr-1">
                              <User className="h-3 w-3 mr-1" />
                              Guest
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.user?.email || conversation.client?.email || conversation.guest?.email || ""}
                          </p>
                        </div>
                        <p className="text-sm truncate mt-1">
                          {conversation.messages && conversation.messages.length > 0
                            ? conversation.messages[conversation.messages.length - 1].content
                            : "No messages"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatConversationTime(conversation.last_message_at || conversation.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation View */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder-with-text.png?key=9gqvo&text=${
                          selectedConversation.user?.full_name?.charAt(0) ||
                          selectedConversation.client?.company_name?.charAt(0) ||
                          selectedConversation.guest?.name?.charAt(0) ||
                          "?"
                        }`}
                        alt={
                          selectedConversation.user?.full_name ||
                          selectedConversation.client?.company_name ||
                          selectedConversation.guest?.name ||
                          "Unknown"
                        }
                      />
                      <AvatarFallback>
                        {selectedConversation.user
                          ? selectedConversation.user.full_name.split(" ").map((n) => n[0])
                          : selectedConversation.client
                            ? selectedConversation.client.company_name.split(" ").map((n) => n[0])
                            : selectedConversation.guest
                              ? selectedConversation.guest.name.charAt(0)
                              : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {selectedConversation.user?.full_name ||
                            selectedConversation.client?.company_name ||
                            selectedConversation.guest?.name ||
                            "Unknown"}
                        </CardTitle>
                        {selectedConversation.client ? (
                          <Badge variant="outline">
                            <Building2 className="h-3 w-3 mr-1" />
                            Client
                          </Badge>
                        ) : selectedConversation.user ? (
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            User
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            Guest
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.user?.email ||
                          selectedConversation.client?.email ||
                          selectedConversation.guest?.email ||
                          ""}
                      </p>
                      {(selectedConversation.user?.phone_number || selectedConversation.client?.phone_number) && (
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.user?.phone_number || selectedConversation.client?.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                  {getUnreadCount(selectedConversation) > 0 && (
                    <Badge variant="destructive">{getUnreadCount(selectedConversation)} unread</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === "Employee" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender_type !== "Employee" && (
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          <AvatarFallback>
                            {message.sender_type === "User" && selectedConversation.user
                              ? selectedConversation.user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : message.sender_type === "Client" && selectedConversation.client
                                ? selectedConversation.client.company_name.split(" ").map((n) => n[0])
                                : message.sender_type === "Guest" && selectedConversation.guest
                                  ? selectedConversation.guest.name.charAt(0)
                                  : "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender_type === "Employee"
                            ? "bg-primary text-primary-foreground"
                            : message.read
                              ? "bg-muted"
                              : "bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm">{message.content}</p>
                          {!message.read && message.sender_type !== "Employee" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs mt-1 opacity-70 text-right">{formatMessageTime(message.created_at)}</p>
                      </div>
                      {message.sender_type === "Employee" && (
                        <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                          <AvatarFallback>
                            {currentEmployee?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[60px] flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" className="self-end">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <User className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-medium">Select a conversation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
