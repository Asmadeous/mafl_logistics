
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Subscription } from "@rails/actioncable";
import getConsumer, { resetConsumer } from "../lib/action-cable";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

export type Conversation = {
  id: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  userRole: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
};

export type Message = {
  id: string;
  senderId: string;
  senderType: string;
  receiverId: string;
  receiverType: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  conversationId: string;
};

export type Contact = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string | null;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  notifiableType: string;
  notifiableId: string;
  createdAt: string;
};

export interface UseMessagesReturn {
  conversations: Conversation[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversation: string | null;
  setCurrentConversation: (id: string | null) => void;
  unreadTotal: number;
  sendMessage: (conversationId: string, content: string, receiverId: string, receiverType: string) => Promise<void>;
  markMessageAsRead: (conversationId: string, messageId: string) => Promise<void>;
  addConversation: (conversation: Conversation) => void;
  contacts: Contact[];
  createConversation: (contactId: string) => Promise<string | null>;
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMessages(): UseMessagesReturn {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const notificationSubscriptionRef = useRef<Subscription | null>(null);
  const conversationSubscriptionRef = useRef<Subscription | null>(null);

  // Load token
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt_token");
    console.log("Loading JWT token", { token: jwtToken ? "present" : "missing" });
    setToken(jwtToken);
  }, []);

  // Sync with user changes
  useEffect(() => {
    console.log("User changed in useMessages", { user: user ? { id: user.id, type: user.type } : null });
    if (!user) {
      setToken(null);
      localStorage.removeItem("jwt_token");
      setConversations([]);
      setMessages([]);
      setNotifications([]);
      router.push("/auth/login");
    }
  }, [user, router]);

  // Handle errors with toast notifications
  const handleError = useCallback((source: string, error: unknown) => {
    const message = error instanceof Error ? error.message : "An error occurred";
    console.error(`Error in ${source}`, { message, error });
    setError(message);
    toast({
      title: `${source} Error`,
      description: message,
      variant: "destructive",
    });
  }, []);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (token === null || !user?.type) {
      console.log("Skipping fetchContacts", { token: token !== null, userType: user?.type });
      return;
    }
    console.log("Fetching contacts");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch contacts: ${response.status}`);
      const data = await response.json();
      console.log("Fetched contacts", { count: data.length });
      setContacts(
        data.map((item: any) => ({
          id: item.id,
          fullName: item.full_name ?? null,
          avatarUrl: item.avatar_url ?? null,
          role: item.role ?? null,
        }))
      );
    } catch (error) {
      handleError("Fetch Contacts", error);
    }
  }, [user?.type, token, handleError]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.type || token === null) {
      console.log("Skipping fetchConversations", { userType: user?.type, token: token !== null });
      return;
    }
    console.log("Fetching conversations");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.status}`);
      const data = await response.json();
      const mappedConvs: Conversation[] = data.map((conv: any) => ({
        id: conv.id,
        userId: user.type === "Employee" ? conv.user_id : conv.employee_id,
        userName: conv.user?.full_name ?? conv.employee?.full_name ?? null,
        userAvatar: conv.user?.avatar_url ?? conv.employee?.avatar_url ?? null,
        userRole: user.type === "Employee" ? "user" : "employee",
        lastMessage: conv.last_message?.content ?? null,
        lastMessageTime: conv.last_message?.created_at ?? null,
        unreadCount: conv.unread_count || 0,
      }));
      console.log("Fetched conversations", {
        count: mappedConvs.length,
        unreadTotal: mappedConvs.reduce((sum, conv) => sum + conv.unreadCount, 0),
      });
      setConversations(mappedConvs);
      setUnreadTotal(mappedConvs.reduce((sum, conv) => sum + conv.unreadCount, 0));
    } catch (error) {
      handleError("Fetch Conversations", error);
    }
  }, [user?.type, token, handleError]);

  // Fetch messages for a conversation with pagination
  const fetchMessages = useCallback(
    async (conversationId: string, page = 1) => {
      if (token === null) {
        console.log("Skipping fetchMessages", { token: token !== null });
        return;
      }
      console.log("Fetching messages", { conversationId, page });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/conversations/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);
        const data = await response.json();
        console.log("Fetched messages", { conversationId, messageCount: data.messages.length });
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderType: msg.sender_type,
            receiverId: msg.receiver_id,
            receiverType: msg.receiver_type,
            content: msg.content,
            isRead: msg.read,
            createdAt: msg.created_at,
            conversationId: data.id,
          }))
        );
      } catch (error) {
        handleError("Fetch Messages", error);
      }
    },
    [token, handleError]
  );

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (token === null || !user) {
      console.log("Skipping fetchNotifications", { token: token !== null, user: !!user });
      return;
    }
    console.log("Fetching notifications");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch notifications: ${response.status}`);
      const data = await response.json();
      console.log("Fetched notifications", { count: data.length });
      setNotifications(
        data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          link: n.link ?? null,
          read: n.read,
          notifiableType: n.notifiable_type,
          notifiableId: n.notifiable_id,
          createdAt: n.created_at,
        }))
      );
    } catch (error) {
      handleError("Fetch Notifications", error);
    }
  }, [user, token, handleError]);

  // Add or update a conversation
  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.id === conversation.id);
      const updated = existing
        ? prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c))
        : [...prev, conversation];
      console.log("Added/Updated conversation", { conversationId: conversation.id, isNew: !existing });
      setUnreadTotal(updated.reduce((sum, conv) => sum + conv.unreadCount, 0));
      return updated;
    });
  }, []);

  // Create a new conversation
  const createConversation = useCallback(
    async (contactId: string) => {
      if (token === null || !user?.id || !user?.type) {
        console.log("Skipping createConversation", { token: token !== null, userId: user?.id, userType: user?.type });
        return null;
      }
      console.log("Creating conversation", { contactId });
      try {
        const body = user.type === "Employee" ? { user_id: contactId } : { employee_id: contactId };
        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/conversations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`Failed to create conversation: ${response.status}`);
        const data = await response.json();
        const newConv: Conversation = {
          id: data.id,
          userId: user.type === "Employee" ? contactId : user.id,
          userName: data.user?.full_name ?? data.employee?.full_name ?? "Unknown",
          userAvatar: data.user?.avatar_url ?? data.employee?.avatar_url ?? null,
          userRole: user.type === "Employee" ? "user" : "employee",
          lastMessage: null,
          lastMessageTime: null,
          unreadCount: 0,
        };
        console.log("Created conversation", { conversationId: data.id });
        addConversation(newConv);
        return data.id;
      } catch (error) {
        handleError("Create Conversation", error);
        return null;
      }
    },
    [user?.id, user?.type, token, addConversation, handleError]
  );

  // Mark a message as read
  const markMessageAsRead = useCallback(
    async (conversationId: string, messageId: string) => {
      if (token === null) {
        console.log("Skipping markMessageAsRead", { token: token !== null });
        return;
      }
      console.log("Marking message as read", { conversationId, messageId });
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_RAILS_API_URL}/conversations/${conversationId}/messages/${messageId}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(`Failed to mark message as read: ${response.status}`);
        console.log("Message marked as read", { conversationId, messageId });
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)));
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: Math.max(0, conv.unreadCount - 1) } : conv
          )
        );
        setUnreadTotal((prev) => Math.max(0, prev - 1));
      } catch (error) {
        handleError("Mark Message as Read", error);
      }
    },
    [token, handleError]
  );

  // Mark a notification as read
  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      if (token === null) {
        console.log("Skipping markNotificationAsRead", { token: token !== null });
        return;
      }
      console.log("Marking notification as read", { notificationId });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/notifications/${notificationId}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Failed to mark notification as read: ${response.status}`);
        console.log("Notification marked as read", { notificationId });
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
      } catch (error) {
        handleError("Mark Notification as Read", error);
      }
    },
    [token, handleError]
  );

  // Send a message via HTTP
  const sendMessage = useCallback(
    async (conversationId: string, content: string, receiverId: string, receiverType: string) => {
      if (token === null || !user || !content.trim()) {
        console.log("Skipping sendMessage", {
          token: token !== null,
          user: !!user,
          content: !!content.trim(),
        });
        return;
      }
      console.log("Sending message", { conversationId, receiverId, receiverType });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: { content, receiver_id: receiverId, receiver_type: receiverType } }),
        });
        if (!response.ok) throw new Error(`Failed to send message: ${response.status}`);
        const data = await response.json();
        console.log("Message sent", { messageId: data.id, conversationId });
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            senderId: user.id,
            senderType: user.type,
            receiverId,
            receiverType,
            content: data.content,
            isRead: data.read,
            createdAt: data.created_at,
            conversationId: conversationId,
          },
        ]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, lastMessage: content, lastMessageTime: data.created_at } : c
          )
        );
      } catch (error) {
        handleError("Send Message", error);
      }
    },
    [user, token, handleError]
  );

  // WebSocket setup for notifications
  const setupNotificationSubscription = useCallback(() => {
    if (!user?.id || !user?.type || token === null) {
      console.log("Skipping setupNotificationSubscription", {
        userId: user?.id,
        userType: user?.type,
        token: token !== null,
      });
      return;
    }
    console.log("Setting up NotificationsChannel subscription", { userId: user.id, userType: user.type });
    const consumer = getConsumer(token);
    notificationSubscriptionRef.current = consumer.subscriptions.create(
      {
        channel: "NotificationsChannel",
        user_id: user.id,
        user_type: user.type.toLowerCase(),
      },
      {
        received: (data: any) => {
          console.log("Received notification", { notificationId: data.notification?.id });
          if (data.notification) {
            const notification: Notification = {
              id: data.notification.id,
              title: data.notification.title,
              message: data.notification.message,
              type: data.notification.type,
              link: data.notification.link ?? null,
              read: data.notification.read,
              notifiableType: data.notification.notifiable_type,
              notifiableId: data.notification.notifiable_id,
              createdAt: data.notification.created_at,
            };
            setNotifications((prev) => {
              if (prev.some((n) => n.id === notification.id)) return prev;
              console.log("Adding new notification", { notificationId: notification.id });
              return [notification, ...prev];
            });
            if (notification.notifiableType === "Message") {
              const conversationId = data.notification.link?.split("/").pop();
              const conversation = conversations.find((c) => c.id === conversationId);
              if (conversation && !notification.read) {
                console.log("Updating unread count for conversation", { conversationId });
                setConversations((prev) =>
                  prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c))
                );
                setUnreadTotal((prev) => prev + 1);
                if (currentConversation === conversationId) {
                  console.log("Auto-marking notification and message as read", {
                    conversationId,
                    notificationId: notification.id,
                  });
                  markNotificationAsRead(notification.id);
                  markMessageAsRead(conversationId, notification.notifiableId);
                }
              }
            }
          }
        },
        rejected: () => {
          console.error("NotificationsChannel subscription rejected");
          handleError("NotificationsChannel", new Error("Failed to connect to notifications"));
          setTimeout(() => {
            notificationSubscriptionRef.current?.unsubscribe();
            setupNotificationSubscription();
          }, 5000);
        },
      }
    );
  }, [user?.id, user?.type, token, conversations, currentConversation, markNotificationAsRead, markMessageAsRead, handleError]);

  useEffect(() => {
    if (!user?.id || !user?.type || token === null) return;
    setupNotificationSubscription();
    return () => {
      console.log("Cleaning up NotificationsChannel subscription");
      notificationSubscriptionRef.current?.unsubscribe();
    };
  }, [user?.id, user?.type, token, setupNotificationSubscription]);

  // WebSocket setup for conversation messages
  const setupConversationSubscription = useCallback(() => {
    if (!user?.id || !currentConversation || token === null) {
      console.log("Skipping ConversationsChannel subscription", {
        userId: user?.id,
        currentConversation,
        token: token !== null,
      });
      return;
    }
    console.log("Setting up ConversationsChannel subscription", { conversationId: currentConversation });
    const consumer = getConsumer(token);
    conversationSubscriptionRef.current = consumer.subscriptions.create(
      { channel: "ConversationsChannel", conversation_id: currentConversation },
      {
        received: (data: any) => {
          console.log("Received message from ConversationsChannel", { messageId: data.message?.id });
          if (data.message) {
            const newMessage: Message = {
              id: data.message.id,
              senderId: data.message.sender_id,
              senderType: data.message.sender_type,
              receiverId: data.message.receiver_id,
              receiverType: data.message.receiver_type,
              content: data.message.content,
              isRead: data.message.read,
              createdAt: data.message.created_at,
              conversationId: currentConversation,
            };
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              console.log("Adding new message", { messageId: newMessage.id, conversationId: currentConversation });
              return [...prev, newMessage];
            });
            setConversations((prev) =>
              prev.map((c) =>
                c.id === currentConversation
                  ? {
                      ...c,
                      lastMessage: newMessage.content,
                      lastMessageTime: newMessage.createdAt,
                    }
                  : c
              )
            );
          }
        },
        connected: () => {
          console.log("ConversationsChannel subscription confirmed", { conversationId: currentConversation });
        },
        rejected: () => {
          console.error("ConversationsChannel subscription rejected", { conversationId: currentConversation });
          handleError("ConversationsChannel", new Error("Failed to connect to conversation channel"));
          setTimeout(() => {
            conversationSubscriptionRef.current?.unsubscribe();
            setupConversationSubscription();
          }, 5000);
        },
      }
    );
  }, [user?.id, currentConversation, token, handleError]);

  useEffect(() => {
    if (!user?.id || !currentConversation || token === null) return;
    setupConversationSubscription();
    return () => {
      console.log("Cleaning up ConversationsChannel subscription", { conversationId: currentConversation });
      conversationSubscriptionRef.current?.unsubscribe();
    };
  }, [user?.id, currentConversation, token, setupConversationSubscription]);

  // Select first conversation if none is set
  useEffect(() => {
    if (!currentConversation && conversations.length > 0) {
      console.log("Setting default conversation", { conversationId: conversations[0].id });
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations, currentConversation]);

  // Refetch all data
  const refetch = useCallback(async () => {
    console.log("Refetching all data");
    setLoading(true);
    try {
      await Promise.all([
        fetchConversations(),
        fetchContacts(),
        fetchNotifications(),
        currentConversation ? fetchMessages(currentConversation) : Promise.resolve(),
      ]);
      console.log("Refetch completed");
    } catch (error) {
      handleError("Refetch Data", error);
    } finally {
      setLoading(false);
    }
  }, [fetchConversations, fetchContacts, fetchNotifications, currentConversation, fetchMessages, handleError]);

  // Initial data load
  useEffect(() => {
    if (user?.type && token !== null) {
      console.log("Initiating initial data load");
      refetch();
    } else {
      console.log("Skipping initial data load", { userType: user?.type, token: token !== null });
      setLoading(false);
    }
  }, [user?.type, token, refetch]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation && token !== null) {
      console.log("Conversation changed, fetching messages", { conversationId: currentConversation });
      fetchMessages(currentConversation);
    } else {
      console.log("Clearing messages", { currentConversation, token: token !== null });
      setMessages([]);
    }
  }, [currentConversation, token, fetchMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("Cleaning up on unmount");
      notificationSubscriptionRef.current?.unsubscribe();
      conversationSubscriptionRef.current?.unsubscribe();
      resetConsumer();
    };
  }, []);

  return {
    conversations,
    messages,
    setMessages,
    currentConversation,
    setCurrentConversation,
    unreadTotal,
    sendMessage,
    markMessageAsRead,
    addConversation,
    contacts,
    createConversation,
    notifications,
    markNotificationAsRead,
    loading,
    error,
    refetch,
  };
}