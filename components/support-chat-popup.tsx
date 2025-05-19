"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupportChat } from "./support-chat-context";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInTimeZone } from "date-fns-tz";

export function SupportChatPopup() {
  const {
    isOpen,
    openChat,
    closeChat,
    conversationId,
    initialMessage,
    setInitialMessage,
    messages,
    addMessage,
    sendMessage,
    isLoading,
    registerGuest,
    isGuestRegistering,
    guestToken, // Use guestToken from context
  } = useSupportChat();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isAuthenticated } = useAuth();

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestFormError, setGuestFormError] = useState("");
  const isGuest = !!guestToken; // Derive isGuest directly from guestToken

  // Add welcome message if chat is empty and no initial message
  useEffect(() => {
    if (isOpen && messages.length === 0 && !initialMessage) {
      addMessage({
        id: `welcome-${Date.now()}`,
        content: "Hello! How can we help you today?",
        sender: "support",
        timestamp: new Date(),
      });
    }
  }, [isOpen, messages.length, initialMessage, addMessage]);

  // Set initial message and send it if provided
  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      const initialMsg = {
        id: `init-${Date.now()}`,
        content: initialMessage,
        sender: "user" as const,
        timestamp: new Date(),
      };
      addMessage(initialMsg);
      sendMessage(initialMessage);
      setInitialMessage("");
    }
  }, [isOpen, initialMessage, messages.length, addMessage, sendMessage, setInitialMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleGuestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestFormError("");

    if (!guestName.trim()) {
      setGuestFormError("Name is required");
      return;
    }

    const success = await registerGuest(guestName, guestEmail);
    if (success) {
      setShowGuestForm(false);
      addMessage({
        id: `welcome-${Date.now()}`,
        content: `Welcome, ${guestName}! You're now registered as a guest. How can we help you today?`,
        sender: "support",
        timestamp: new Date(),
      });
    } else {
      setGuestFormError("Failed to register. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!isAuthenticated && !isGuest) return;

    await sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={openChat} className="h-14 w-14 rounded-full shadow-lg" aria-label="Open support chat">
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 shadow-xl transition-all duration-300 ease-in-out">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary text-primary-foreground p-3 flex flex-row justify-between items-center">
              <div className="font-semibold flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/friendly-support.png" alt="Support" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                MAFL Support
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 max-h-80 overflow-y-auto bg-background">
              <div className="space-y-4">
                {!isAuthenticated && !isGuest && (
                  <Alert className="mb-4 border-primary/20">
                    <UserPlus className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-medium">Chat with Support</AlertTitle>
                    <AlertDescription>
                      {showGuestForm ? (
                        <form onSubmit={handleGuestRegistration} className="mt-2 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="guestName">Name (required)</Label>
                            <Input
                              id="guestName"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Your name"
                              disabled={isGuestRegistering}
                              className="border-primary/20 focus-visible:ring-primary/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="guestEmail">Email (optional)</Label>
                            <Input
                              id="guestEmail"
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder="Your email"
                              disabled={isGuestRegistering}
                              className="border-primary/20 focus-visible:ring-primary/50"
                            />
                          </div>
                          {guestFormError && <p className="text-destructive text-sm">{guestFormError}</p>}
                          <div className="flex space-x-2">
                            <Button
                              type="submit"
                              size="sm"
                              disabled={isGuestRegistering}
                              className="flex-1 bg-primary hover:bg-primary/90"
                            >
                              {isGuestRegistering ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Registering...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Continue as Guest
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowGuestForm(false)}
                              disabled={isGuestRegistering}
                              className="flex-1 border-primary/20 text-primary hover:bg-primary/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="text-muted-foreground">
                            Please continue as a guest to chat with our support team.
                          </p>
                          <div className="mt-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setShowGuestForm(true)}
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Continue as Guest
                            </Button>
                          </div>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatInTimeZone(msg.timestamp, "Africa/Nairobi", "HH:mm")} EAT
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t border-primary/10 bg-background">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  ref={textareaRef}
                  placeholder={
                    isAuthenticated || isGuest ? "Type your message..." : "Continue as guest to send messages"
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-10 flex-1 resize-none border-primary/20 focus-visible:ring-primary/50"
                  rows={2}
                  disabled={!isAuthenticated && !isGuest}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={isLoading || !message.trim() || (!isAuthenticated && !isGuest)}
                  className="h-10 w-10 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}