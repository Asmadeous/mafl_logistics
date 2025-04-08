"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7 // Slow down the video slightly
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video ref={videoRef} autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
            <source src="/videos/logistics-background.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/images/logistics-hero.jpg"
              alt="MAFL Logistics - Kenya & East Africa Transport"
              className="absolute w-full h-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Logistics
              <br />
              Solutions
              <br />
              Delivered
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

