// "use client"

// import Link from "next/link"
// import { MessageSquare, User } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { useAuth } from "@/hooks/use-auth"
// import { useMessages } from "@/hooks/use-messages"
// import { formatDistanceToNow } from "date-fns"
// import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

// interface MessageDropdownProps {
//   iconClassName?: string
//   triggerClassName?: string
// }

// export function MessageDropdown({ iconClassName = "", triggerClassName = "" }: MessageDropdownProps) {
//   const { user, isAdmin } = useAuth()
//   const { conversations, unreadTotal, loading } = useMessages()

//   if (!user) {
//     return null
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className={`relative ${triggerClassName}`}>
//           <MessageSquare className={iconClassName} />
//           {unreadTotal > 0 && (
//             <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-mafl-orange text-white rounded-full">
//               {unreadTotal > 99 ? "99+" : unreadTotal}
//             </Badge>
//           )}
//           <span className="sr-only">Messages</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="font-medium">Messages</h3>
//         </div>
//         <div className="max-h-80 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center">Loading...</div>
//           ) : conversations.length > 0 ? (
//             conversations.slice(0, 5).map((conversation) => {
//               const partner = isAdmin ? conversation.user : conversation.employee

//               return (
//                 <Link
//                   key={conversation.id}
//                   href={isAdmin ? `/admin/messages` : `/dashboard/messages`}
//                   className={`block p-4 border-b hover:bg-muted/50 ${conversation.unread_count > 0 ? "bg-muted/20" : ""}`}
//                 >
//                   <div className="flex items-center">
//                     <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
//                       {partner?.avatar_url ? (
//                         <img
//                           src={partner.avatar_url || "/placeholder.svg"}
//                           alt={partner.name}
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <User className="h-5 w-5" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <p className="font-medium text-sm truncate">{partner?.name || "Unknown"}</p>
//                         {conversation.unread_count > 0 && (
//                           <Badge className="ml-2 bg-mafl-orange">{conversation.unread_count}</Badge>
//                         )}
//                       </div>
//                       <p className="text-xs text-muted-foreground truncate">
//                         {conversation.last_message || "No messages"}
//                       </p>
//                       {conversation.last_message_time && (
//                         <p className="text-xs text-muted-foreground mt-1">
//                           {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               )
//             })
//           ) : (
//             <div className="p-4 text-center text-sm text-muted-foreground">No messages</div>
//           )}
//         </div>
//         <div className="p-2 text-center">
//           <Link
//             href={isAdmin ? "/admin/messages" : "/dashboard/messages"}
//             className="text-xs text-primary hover:underline"
//           >
//             View all messages
//           </Link>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
