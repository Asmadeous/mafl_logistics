"use client"

import { useState } from "react"
import { Phone, Calendar, MapPin, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { MapModal } from "./map-modal"

export function CompanyInfoBar() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  return (
    <>
      <section className="w-full py-6 bg-white dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Call Center */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mr-3 md:mr-4 flex-shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900 dark:text-white">
                  CALL CENTER
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-0.5 md:mb-1">Give us a call</p>
                <a
                  href="tel:+254711111017"
                  className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  +254 711 111 017
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mr-3 md:mr-4 flex-shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900 dark:text-white">
                  WORKING HOURS
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-0.5 md:mb-1">Mon-Sat: 7AM-5PM</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Sunday: 9AM-3PM</p>
              </div>
            </div>

            {/* Our Location */}
            <div className="flex items-start">
              <div
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mr-3 md:mr-4 flex-shrink-0 cursor-pointer"
                onClick={() => setIsMapModalOpen(true)}
              >
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900 dark:text-white">
                  OUR LOCATION
                </h3>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-left text-xs md:text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none"
                >
                  Malili, Konza, Rift Valley, Kenya
                </button>
              </div>
            </div>

            {/* Branch Offices */}
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mr-3 md:mr-4 flex-shrink-0">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900 dark:text-white">
                  BRANCH OFFICES
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Kenya, Uganda, Tanzania, Rwanda, Ethiopia, South Sudan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MapModal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />
    </>
  )
}
