// "use client"

// import { useState, useEffect } from "react"
// import { useMessages } from "../../hooks/use-messages"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { CheckCheck, Send, Search, Wifi, WifiOff } from "lucide-react"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export default function MessagesTab() {
//   const { conversations, messages, currentConversation, setCurrentConversation, sendMessage, refetch, loading } =
//     useMessages()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [messageContent, setMessageContent] = useState("")
//   const [isOffline, setIsOffline] = useState(false)

//   // Handle offline status
//   useEffect(() => {
//     console.log("Initial offline status:", isOffline)
//     const handleOffline = () => setIsOffline(true)
//     const handleOnline = () => setIsOffline(false)
//     window.addEventListener("offline", handleOffline)
//     window.addEventListener("online", handleOnline)
//     return () => {
//       window.removeEventListener("offline", handleOffline)
//       window.removeEventListener("online", handleOnline)
//     }
//   }, [])

//   // Refetch data on mount
//   useEffect(() => {
//     console.log("Refetching data...")
//     refetch()
//   }, [refetch])

//   // Log latest message
//   useEffect(() => {
//     console.log("Latest message:", messages[messages.length - 1])
//   }, [messages])

//   // Handle search input
//   const handleSearch = (value: string) => {
//     console.log("Searching contacts with query:", value)
//     setSearchQuery(value)
//     // Implement search logic (e.g., filter contacts)
//   }

//   // Handle message sending
//   const handleSendMessage = async () => {
//     if (!currentConversation || !messageContent.trim()) return
//     try {
//       await sendMessage(
//         currentConversation,
//         messageContent,
//         "receiver_id_placeholder", // Replace with actual receiver ID
//         "User", // Replace with actual receiver type
//       )
//       setMessageContent("")
//     } catch (error) {
//       console.error("Failed to send message:", error)
//     }
//   }

//   // Get current conversation details
//   const currentConversationDetails = conversations.find((c) => c.id === currentConversation)

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
//       </div>
//     )

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar with conversations */}
//       <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
//         <div className="p-4 border-b border-gray-200 dark:border-gray-800">
//           <h1 className="text-xl font-bold mb-4">Messages</h1>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search contacts"
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
//             />
//           </div>
//         </div>

//         <ScrollArea className="flex-1">
//           <div className="space-y-1 p-2">
//             {conversations.map((conv) => (
//               <div
//                 key={conv.id}
//                 onClick={() => setCurrentConversation(conv.id)}
//                 className={cn(
//                   "flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
//                   conv.id === currentConversation ? "bg-gray-100 dark:bg-gray-800" : "",
//                 )}
//               >
//                 <Avatar className="h-10 w-10 mr-3">
//                   <AvatarImage
//                     src={`/placeholder.svg?height=40&width=40&text=${conv.userName ? conv.userName.charAt(0) : "U"}`}
//                   />
//                   <AvatarFallback>{conv.userName ? conv.userName.charAt(0) : "U"}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">{conv.userName}</span>
//                     {conv.unreadCount > 0 && (
//                       <span className="bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                         {conv.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Last message preview...</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         {/* Offline indicator in sidebar */}
//         {isOffline && (
//           <div className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex items-center justify-center">
//             <WifiOff className="h-4 w-4 mr-2" />
//             <span className="text-sm">You're offline</span>
//           </div>
//         )}
//       </div>

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col">
//         {/* Chat header */}
//         <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
//           <div className="flex items-center">
//             {currentConversationDetails && (
//               <>
//                 <Avatar className="h-10 w-10 mr-3">
//                   <AvatarImage
//                     src={`/placeholder.svg?height=40&width=40&text=${currentConversationDetails?.userName ? currentConversationDetails.userName.charAt(0) : "U"}`}
//                   />
//                   <AvatarFallback>
//                     {currentConversationDetails?.userName ? currentConversationDetails.userName.charAt(0) : "U"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className="font-medium">{currentConversationDetails.userName}</h2>
//                   <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                     {isOffline ? (
//                       <>
//                         <WifiOff className="h-3 w-3 mr-1" />
//                         <span>Offline</span>
//                       </>
//                     ) : (
//                       <>
//                         <Wifi className="h-3 w-3 mr-1" />
//                         <span>Online</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//             {!currentConversationDetails && (
//               <div>
//                 <h2 className="font-medium">Select a conversation</h2>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Messages */}
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-6">
//             {/* Sort messages to ensure oldest first */}
//             {[...messages]
//               .sort((a, b) => (a.id < b.id ? -1 : 1))
//               .map((msg, index, array) => {
//                 // Determine if this is a sent message (assuming isRead=true means it's sent by current user)
//                 const isSentByMe = msg.isRead

//                 // Check if this message is from a different sender than the previous one
//                 const isNewSender = index === 0 || isSentByMe !== array[index - 1].isRead

//                 return (
//                   <div key={msg.id} className={cn("flex flex-col", isSentByMe ? "items-end" : "items-start")}>
//                     {/* Show sender info if this is the first message from this sender or after a switch */}
//                     {isNewSender && (
//                       <div className="flex items-center mb-2">
//                         {!isSentByMe && currentConversationDetails && (
//                           <>
//                             <Avatar className="h-6 w-6 mr-2">
//                               <AvatarImage
//                                 src={`/placeholder.svg?height=24&width=24&text=${currentConversationDetails?.userName ? currentConversationDetails.userName.charAt(0) : "U"}`}
//                               />
//                               <AvatarFallback>
//                                 {currentConversationDetails?.userName
//                                   ? currentConversationDetails.userName.charAt(0)
//                                   : "U"}
//                               </AvatarFallback>
//                             </Avatar>
//                             <span className="text-sm text-gray-500">
//                               {currentConversationDetails?.userName || "User"}
//                             </span>
//                           </>
//                         )}
//                         {isSentByMe && (
//                           <>
//                             <span className="text-sm text-gray-500 mr-2">You</span>
//                             <Avatar className="h-6 w-6">
//                               <AvatarImage src="/placeholder.svg?height=24&width=24&text=Y" />
//                               <AvatarFallback>Y</AvatarFallback>
//                             </Avatar>
//                           </>
//                         )}
//                       </div>
//                     )}

//                     <div
//                       className={cn(
//                         "max-w-[70%] rounded-lg p-3 relative",
//                         isSentByMe
//                           ? "bg-yellow-100 dark:bg-yellow-900 text-gray-800 dark:text-gray-100 rounded-tr-none"
//                           : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none",
//                       )}
//                     >
//                       <p>{msg.content}</p>
//                       <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
//                         <span>12:34 PM</span>
//                         {isSentByMe && <CheckCheck className="h-4 w-4 ml-1 text-yellow-500" />}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//           </div>
//         </ScrollArea>

//         {/* Message input */}
//         <div className="p-4 border-t border-gray-200 dark:border-gray-800">
//           <div className="flex items-center">
//             <Input
//               placeholder="Type a message"
//               value={messageContent}
//               onChange={(e) => setMessageContent(e.target.value)}
//               className="flex-1 bg-gray-100 dark:bg-gray-800 border-none"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault()
//                   handleSendMessage()
//                 }
//               }}
//             />
//             <Button
//               onClick={handleSendMessage}
//               className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white"
//               size="icon"
//             >
//               <Send className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useMessages } from "../../hooks/use-messages"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCheck, Send, Search, Wifi, WifiOff } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define message type based on the provided sample
interface Message {
  id: string
  senderId: string
  senderType: string
  receiverId: string
  receiverType: string
  content: string
  isRead: boolean
  createdAt: string
  conversationId: string
}

export default function MessagesTab() {
  const { conversations, messages, currentConversation, setCurrentConversation, sendMessage, refetch, loading } =
    useMessages()
  const [searchQuery, setSearchQuery] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [isOffline, setIsOffline] = useState(false)

  // For demo purposes, we'll assume these values would come from authentication context
  // In a real app, these would be derived from the user's token
  const currentUserId = "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
  const currentUserType = "Employee" // This would come from the token

  // Handle offline status
  useEffect(() => {
    console.log("Initial offline status:", isOffline)
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  // Refetch data on mount
  useEffect(() => {
    console.log("Refetching data...")
    refetch()
  }, [refetch])

  // Log latest message
  useEffect(() => {
    console.log("Latest message:", messages[messages.length - 1])
  }, [messages])

  // Handle search input
  const handleSearch = (value: string) => {
    console.log("Searching contacts with query:", value)
    setSearchQuery(value)
    // Implement search logic (e.g., filter contacts)
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!currentConversation || !messageContent.trim()) return
    try {
      await sendMessage(
        currentConversation,
        messageContent,
        "receiver_id_placeholder", // Replace with actual receiver ID
        currentUserType === "Employee" ? "User" : "Employee", // Set receiver type based on current user type
      )
      setMessageContent("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  // Format date to readable time
  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      return "12:00 PM" // Fallback time
    }
  }

  // Get current conversation details
  const currentConversationDetails = conversations.find((c) => c.id === currentConversation)

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      </div>
    )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with conversations */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className={cn(
                  "flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  conv.id === currentConversation ? "bg-gray-100 dark:bg-gray-800" : "",
                )}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=${conv.userName ? conv.userName.charAt(0) : "U"}`}
                  />
                  <AvatarFallback>{conv.userName ? conv.userName.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{conv.userName || "Unknown"}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Last message preview...</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Offline indicator in sidebar */}
        {isOffline && (
          <div className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex items-center justify-center">
            <WifiOff className="h-4 w-4 mr-2" />
            <span className="text-sm">You're offline</span>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            {currentConversationDetails && (
              <>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=${currentConversationDetails?.userName ? currentConversationDetails.userName.charAt(0) : "U"}`}
                  />
                  <AvatarFallback>
                    {currentConversationDetails?.userName ? currentConversationDetails.userName.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{currentConversationDetails.userName || "Unknown"}</h2>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {isOffline ? (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" />
                        <span>Offline</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        <span>Online</span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            {!currentConversationDetails && (
              <div>
                <h2 className="font-medium">Select a conversation</h2>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Sort messages to ensure oldest first */}
            {[...messages]
              .sort((a, b) => {
                // Sort by createdAt if available, otherwise fall back to id
                if (a.createdAt && b.createdAt) {
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                }
                return a.id < b.id ? -1 : 1
              })
              .map((msg: any, index, array) => {
                // Determine if this message was sent by the current user
                // by comparing senderType with currentUserType
                const isSentByMe = msg.senderType === currentUserType

                // Check if this message is from a different sender than the previous one
                const isNewSender = index === 0 || msg.senderType !== array[index - 1].senderType

                // Get the other party's type (opposite of current user)
                const otherPartyType = currentUserType === "Employee" ? "User" : "Employee"

                return (
                  <div key={msg.id} className={cn("flex flex-col", isSentByMe ? "items-end" : "items-start")}>
                    {/* Show sender info if this is the first message from this sender or after a switch */}
                    {isNewSender && (
                      <div className="flex items-center mb-2">
                        {!isSentByMe && (
                          <>
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage
                                src={`/placeholder.svg?height=24&width=24&text=${
                                  msg.senderType === "User" ? "U" : "E"
                                }`}
                              />
                              <AvatarFallback>{msg.senderType === "User" ? "U" : "E"}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500">
                              {msg.senderType === otherPartyType && currentConversationDetails?.userName
                                ? currentConversationDetails.userName
                                : msg.senderType}
                            </span>
                          </>
                        )}
                        {isSentByMe && (
                          <>
                            <span className="text-sm text-gray-500 mr-2">You</span>
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/placeholder.svg?height=24&width=24&text=${currentUserType === "Employee" ? "E" : "U"}`}
                              />
                              <AvatarFallback>{currentUserType === "Employee" ? "E" : "U"}</AvatarFallback>
                            </Avatar>
                          </>
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3 relative",
                        isSentByMe
                          ? "bg-yellow-100 dark:bg-yellow-900 text-gray-800 dark:text-gray-100 rounded-tr-none"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none",
                      )}
                    >
                      <p>{msg.content}</p>
                      <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{msg.createdAt ? formatMessageTime(msg.createdAt) : "12:00 PM"}</span>
                        {isSentByMe && <CheckCheck className="h-4 w-4 ml-1 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Input
              placeholder="Type a message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

