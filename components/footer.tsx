"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Send, MapPin, Mail, Phone } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send this to your backend
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
      variant: "success",
    })
    setEmail("")
  }

  const openGoogleMaps = () => {
    window.open("https://maps.google.com/?q=Malili,+Konza,+Rift+Valley,+Kenya", "_blank")
  }

  return (
    <footer className="bg-muted/50 dark:bg-muted/20 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-xl font-semibold">Logistics</span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <button
                onClick={openGoogleMaps}
                className="flex items-start text-left text-muted-foreground hover:text-mafl-orange transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Malili, Konza, Rift Valley, Kenya</span>
              </button>
              <div className="flex items-start text-muted-foreground">
                <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>+254 711 111 017</span>
              </div>
              <div className="flex items-start text-muted-foreground">
                <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>maishaagrofarmlimited@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for updates on our services and logistics industry news.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-[220px]"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/Mafl2018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-2 rounded-full"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/mafl_logistics_ke_ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-2 rounded-full"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=%2B254779403242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-2 rounded-full"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.5 13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-muted">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MAFL Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

