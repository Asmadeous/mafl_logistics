"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";

interface NotificationDropdownProps {
  iconClassName?: string;
  triggerClassName?: string;
}

export function NotificationDropdown({ iconClassName = "h-5 w-5", triggerClassName = "" }: NotificationDropdownProps) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading, refreshNotifications } = useNotifications();
  const router = useRouter();

  // Debugging log
  console.log("NotificationDropdown rendered, notifications:", notifications.length, "unreadCount:", unreadCount);

  if (!user) {
    return null;
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    if (notification.link) {
      // Handle different notification types
      switch (notification.notifiableType) {
        case "Message":
          // Extract conversation ID from the link
          const conversationId = notification.link.split("/").pop();
          if (conversationId) {
            router.push(`/messages?conversation=${conversationId}`);
          } else {
            router.push("/messages");
          }
          break;
          
        case "BlogPost":
          router.push(notification.link);
          break;
          
        default:
          // If there's a link but no specific handling, just use the link
          if (notification.link.startsWith('/') || notification.link.startsWith(window.location.origin)) {
            router.push(notification.link);
          } else {
            // For external links, open in new tab
            window.open(notification.link, '_blank');
          }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${triggerClassName}`}>
          <Bell className={iconClassName} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={refreshNotifications}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted cursor-pointer ${
                  !notification.read ? "bg-muted/20" : ""
                } ${notification.notifiableType === "BlogPost" ? "border-l-4 border-primary" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {notification.link && notification.notifiableType === "BlogPost" && (
                    <Link href={notification.link} className="text-xs text-primary hover:underline">
                      View Post
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          )}
        </div>
        <div className="p-2 text-center">
          <Link href="/notifications" className="text-xs text-primary hover:underline">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}