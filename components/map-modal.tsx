"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MapModal({ isOpen, onClose }: MapModalProps) {
  // Google Maps embed URL for MAFL Logistics
  const mapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.0104336456398!2d37.16535797486921!3d-1.7248966362625755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f8d48c97cf1bd%3A0x96b45f2214b364d8!2sMAFL%20Logistics!5e0!3m2!1sen!2ske!4v1746472734200!5m2!1sen!2ske"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <div>
            <DialogTitle>MAFL Logistics Location</DialogTitle>
            <DialogDescription>Malili, Konza, Rift Valley, Kenya</DialogDescription>
          </div>
        </DialogHeader>

        <div className="w-full h-[400px]">
          <iframe
            src={mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MAFL Logistics Location"
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <p className="text-sm">
              <span className="font-medium">Address:</span> Malili, Konza, Rift Valley, Kenya
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span>{" "}
              <a href="tel:+254711111017" className="text-primary hover:underline">
                +254 711 111 017
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
