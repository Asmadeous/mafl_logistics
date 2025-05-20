"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { useTheme } from "next-themes";
import { MapModal } from "./map-modal";

export default function Footer() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <div className="w-full h-px bg-border dark:bg-border" />
      <footer className="bg-background dark:bg-navy border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <Logo width={50} height={50} />
                  <span className="ml-2 text-base sm:text-lg md:text-xl font-bold tracking-tight flex">
                    <span style={{ color: "#FF6600" }}>MAFL</span>&nbsp;
                    <span className="text-black dark:text-white">
                      Logistics
                    </span>
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Your Trusted Partner for Reliable, Efficient, Innovative
                  Logistics Solutions
                </p>
              </div>
              <div className="flex space-x-4 mt-3">
                <Link
                  href="https://www.facebook.com/Mafl2018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground dark:text-white hover:text-orange-500 transition-colors"
                >
                  <Facebook size={18} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/mafl_logistics_ke_ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground dark:text-white hover:text-orange-500 transition-colors"
                >
                  <Instagram size={18} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://api.whatsapp.com/send?phone=%2B254779 Tie this to the bottom section403242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground dark:text-white hover:text-orange-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.5 13.5c.5 1.5 2.5 2 4 1" />
                  </svg>
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold mb-2 text-foreground dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-2 text-foreground dark:text-white">
                Services
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Cross-Border Logistics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Project Cargo Transport
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Heavy Machinery Hire
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Road Construction
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    Bulk Cargo Transport
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-2 text-foreground dark:text-white">
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-start text-left text-foreground dark:text-white hover:text-orange-500 transition-colors focus:outline-none"
                  >
                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">
                      Malili, Konza, Rift Valley, Kenya
                    </span>
                  </button>
                </li>
                <li className="flex items-center">
                  <a
                    href="tel:+254711111017"
                    className="flex items-center text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    <Phone size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-xs">+254 711 111 017</span>
                  </a>
                </li>
                <li className="flex items-center">
                  <a
                    href="mailto:info@mafllogistics.com"
                    className="flex items-center text-foreground dark:text-white hover:text-orange-500 transition-colors"
                  >
                    <Mail size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-xs">info@mafllogistics.com</span>
                  </a>
                </li>
                <li className="flex items-center">
                  <a
                    href="https://www.mafllogistics.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground dark:text-white hover:text-orange-500 transition-colors"
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
                      className="mr-2 flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className="text-xs">www.mafllogistics.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-4 pt-4">
            <div className="flex flex-row items-center justify-between space-x-4 min-w-0">
              <div className="flex space-x-4 shrink-0">
                <Link
                  href="/privacy-policy"
                  className="text-xs text-muted-foreground dark:text-gray-400 hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-xs text-muted-foreground dark:text-gray-400 hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  Terms of Service
                </Link>
              </div>
              <p className="text-xs text-muted-foreground dark:text-gray-400 text-right min-w-0 truncate">
                <span>MAFL Logistics Ltd</span>© {new Date().getFullYear()}. All
                rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  );
}
