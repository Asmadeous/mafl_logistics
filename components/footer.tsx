"use client"
import Link from "next/link"
import { Facebook, Instagram, MapPin, Mail, Phone, Globe } from "lucide-react"
import { urls } from "@/config/urls"
import { NewsletterSignup } from "@/components/newsletter-signup"

export default function Footer() {
  const openGoogleMaps = () => {
    window.open(urls.contact.location, "_blank")
  }

  return (
    <footer className="bg-muted/50 dark:bg-muted/20 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-4">
          {/* Company Info & Social */}
          <div className="flex flex-col md:w-1/3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-mafl-orange">MAFL</span>
              <span className="text-lg font-semibold">Logistics</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Reliable logistics solutions across Kenya & East Africa.
            </p>

            <div className="flex items-center mt-3 space-x-3">
              <span className="text-sm font-medium">Follow Us:</span>
              <div className="flex space-x-2">
                <a
                  href={urls.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-1.5 rounded-full"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={urls.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-1.5 rounded-full"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={urls.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mafl-dark/10 dark:bg-white/10 hover:bg-mafl-orange hover:text-white transition-colors p-1.5 rounded-full"
                  aria-label="WhatsApp Primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
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

          {/* Divider for mobile */}
          <div className="block md:hidden w-full h-px bg-border/50"></div>

          {/* Contact Info */}
          <div className="md:w-1/3 md:border-x border-border/50 md:px-6">
            <h3 className="text-base font-medium mb-2">Contact</h3>
            <div className="space-y-2">
              <button
                onClick={openGoogleMaps}
                className="flex items-center text-left text-muted-foreground hover:text-mafl-orange transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Malili, Konza, Kenya</span>
              </button>
              <a
                href={`tel:${urls.contact.phone}`}
                className="flex items-center text-muted-foreground hover:text-mafl-orange transition-colors"
              >
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{urls.contact.phone}</span>
              </a>
              <a
                href={`mailto:${urls.contact.email}`}
                className="flex items-center text-muted-foreground hover:text-mafl-orange transition-colors"
              >
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{urls.contact.email}</span>
              </a>
              <a
                href={urls.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-mafl-orange transition-colors"
              >
                <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">www.mafllogistics.com</span>
              </a>
            </div>
          </div>

          {/* Divider for mobile */}
          <div className="block md:hidden w-full h-px bg-border/50"></div>

          {/* Newsletter */}
          <div className="md:w-1/3">
            <h3 className="text-base font-medium mb-2">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-2">Subscribe for updates on our services.</p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="w-full h-px bg-border/50 my-4"></div>

        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MAFL Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
