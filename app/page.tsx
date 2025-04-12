"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { urls } from "@/config/urls"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7 // Slow down the video slightly
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Text animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const testimonials = [
    {
      name: "John Kamau",
      company: "Nairobi Construction Ltd",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "MAFL Logistics has been instrumental in our success. Their reliable heavy machinery transport services have ensured our projects stay on schedule.",
      rating: 5,
    },
    {
      name: "Sarah Omondi",
      company: "Fresh Foods Kenya",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "The cold chain logistics service from MAFL is exceptional. Our perishable goods always arrive in perfect condition, even on long-distance routes.",
      rating: 5,
    },
    {
      name: "Michael Wanjiku",
      company: "East Africa Mining Co.",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "We've trusted MAFL with our oversized equipment transport for years. Their attention to detail and safety protocols are unmatched in the industry.",
      rating: 4,
    },
  ]

  // Update the partners array to use the centralized image URLs
  const partners = [
    {
      name: "Softcare Limited",
      logo: urls.images.partnerLogos.softcare,
      category: "Bulk Cargo Client",
    },
    {
      name: "Malimount Limited",
      logo: urls.images.partnerLogos.malimount,
      category: "Bulk Cargo Client",
    },
    {
      name: "Silvermon Limited",
      logo: urls.images.partnerLogos.silvermon,
      category: "Bulk Cargo Client",
    },
    {
      name: "Makueni County",
      logo: urls.images.partnerLogos.makueniCounty,
      category: "Government",
    },
    {
      name: "Amboseli National Park",
      logo: urls.images.partnerLogos.amboseli,
      category: "Conservation",
    },
    {
      name: "Kenya Ports Authority",
      logo: urls.images.partnerLogos.kpa,
      category: "Government",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video ref={videoRef} autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
            <source src={urls.videos.landingPage || "/placeholder.svg"} type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src={urls.images.logisticsHero || "/placeholder.svg"}
              alt="MAFL Logistics - Kenya & East Africa Transport"
              className="absolute w-full h-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
            <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold text-white mb-6">
              <motion.span variants={item} className="block">
                Logistics
              </motion.span>
              <motion.span variants={item} className="block">
                Solutions
              </motion.span>
              <motion.span variants={item} className="block">
                Delivered
              </motion.span>
            </motion.h1>
            <motion.p variants={item} className="text-xl text-white/90 mb-8 max-w-xl">
              Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from businesses across East Africa who trust MAFL Logistics for their transportation needs.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="border-none shadow-lg dark:bg-mafl-dark/50">
                      <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-6 relative">
                            <div className="absolute -top-3 -left-3 text-mafl-orange">
                              <Quote className="h-8 w-8 rotate-180" />
                            </div>
                            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-mafl-orange">
                              <Image
                                src={testimonial.image || "/placeholder.svg"}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <p className="text-lg italic mb-6">{testimonial.quote}</p>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < testimonial.rating ? "text-mafl-orange fill-mafl-orange" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <h4 className="text-xl font-bold">{testimonial.name}</h4>
                          <p className="text-muted-foreground">{testimonial.company}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    activeTestimonial === index ? "bg-mafl-orange" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Trusted Partners</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're proud to collaborate with leading organizations across various industries in East Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-white dark:bg-mafl-dark/30 p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center mb-2 hover:shadow-md transition-shadow">
                  <div className="relative h-16 w-full">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={`${partner.name} - MAFL Logistics Partner`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">{partner.name}</span>
                <span className="text-xs text-muted-foreground">{partner.category}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Join our growing list of satisfied clients and experience the MAFL Logistics difference.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
