"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CompanyInfoBar } from "@/components/company-info-bar"
import { BrandDisplay } from "@/components/brand-display"
import { ArrowRight, CheckCircle, TrendingUp, Shield, Globe } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { useAuth } from "@/hooks/use-auth"
import { useSupportChat } from "@/components/support-chat-context"

// Simple animation component
const SimpleMotion = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 100)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const { isAuthenticated, userType } = useAuth()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const videoRef = useRef<HTMLVideoElement>(null)
  const { openChat } = useSupportChat()
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Handle video playback
  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement) {
      const handleCanPlay = () => {
        setVideoLoaded(true)
      }

      videoElement.addEventListener("canplay", handleCanPlay)

      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [])

  // Play video when loaded
  useEffect(() => {
    if (videoLoaded && videoRef.current) {
      const playPromise = videoRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Video autoplay was prevented:", error)
        })
      }
    }
  }, [videoLoaded])

  const handleGetQuote = () => {
    openChat()
  }

  const handleContactSupport = () => {
    openChat()
  }

  // Determine dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!isAuthenticated) return "#"

    switch (userType) {
      case "employee":
        return "/dashboard/admin"
      case "client":
        return "/dashboard/client"
      case "user":
      default:
        return "/dashboard/user"
    }
  }

  const partners = [
    {
      name: "Softcare Limited",
      type: "Bulk Cargo Client",
      imageSrc: "/partners/softcare-logo.jpg",
      lightImageSrc: "/partners/softcare-logo.jpg",
      link: "#",
    },
    {
      name: "Malimount Limited",
      type: "Bulk Cargo Client",
      imageSrc: "/partners/malimount-logo.jpg",
      lightImageSrc: "/partners/malimount-logo.jpg",
      link: "#",
    },
    {
      name: "Silvermon Limited",
      type: "Bulk Cargo Client",
      imageSrc: "/partners/silvermon-logo.jpg",
      lightImageSrc: "/partners/silvermon-logo.jpg",
      link: "#",
    },
    {
      name: "Makueni County",
      type: "Government Partner",
      imageSrc: "/partners/makueni-county-logo.jpg",
      lightImageSrc: "/partners/makueni-county-logo.jpg",
      link: "#",
    },
    {
      name: "Amboseli National Park",
      type: "Conservation Partner",
      imageSrc: "/partners/amboseli-logo.jpg",
      lightImageSrc: "/partners/amboseli-logo.jpg",
      link: "#",
    },
    {
      name: "Kenya Revenue Authority",
      type: "Regulatory Partner",
      imageSrc: "/partners/kra-logo.jpg",
      lightImageSrc: "/partners/kra-logo.jpg",
      link: "#",
    },
  ]

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Reliable Service",
      description: "Consistent, on-time deliveries with real-time tracking and dedicated support.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Operational Excellence",
      description: "Optimized routes, efficient fleet management, and cost-effective solutions.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Safety First",
      description: "Rigorous safety protocols, trained drivers, and well-maintained vehicles.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Regional Expertise",
      description: "Specialized knowledge of East African logistics and cross-border operations.",
    },
  ]

  return (
    // <div className="flex min-h-screen flex-col">
    <>
      <Navbar />

      {/* Hero Section with background video */}
      <section className="relative min-h-[600px] flex items-center bg-black">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
        >
          <source src="/videos/logistics-background.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Enhanced orange light overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-300/10 z-0 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-orange-400/15 to-transparent z-0 animate-pulse-slower"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent z-0"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 text-primary rounded-full text-sm font-medium mb-4">
              East Africa's Premier Logistics Partner
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 text-white">
              <span className="block">Logistics</span>
              <span className="block">Solutions</span>
              <span className="block text-primary">Delivered</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-white font-light max-w-2xl">
              Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto text-base px-6 py-3 bg-primary hover:bg-primary/90"
                >
                  About Company
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link href={getDashboardUrl()}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base px-6 py-3 border-white text-white hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/services">
                  <Button variant="default" size="lg" className="w-full sm:w-auto text-base px-6 py-3">
                    Services
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Bar - Added right after hero section */}
      <CompanyInfoBar />

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <SimpleMotion>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                Why Choose <span className="text-primary">MAFL Logistics</span>
              </h2>
              <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We combine industry expertise with innovative solutions to deliver exceptional logistics services
              </p>
            </div>
          </SimpleMotion>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <SimpleMotion key={index} delay={index + 1}>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all h-full">
                  <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </SimpleMotion>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-navy">
        <div className="container mx-auto px-4 md:px-6">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Partners Section - Updated with brand display */}
      <section className="py-12 md:py-16 bg-white dark:bg-navy/90">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <SimpleMotion>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                Strategic Partnerships
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                Our Trusted Partners
              </h2>
              <div className="w-16 md:w-24 h-1 bg-primary mx-auto mb-4"></div>
              <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                MAFL Logistics delivers major projects across Kenya & East Africa, specializing in diverse logistics
                solutions
              </p>
            </SimpleMotion>
          </div>

          {/* New Brand Display Component */}
          <BrandDisplay partners={partners} />

          <div className="text-center mt-8 md:mt-12">
            <SimpleMotion delay={7}>
              <p className="text-base md:text-xl mb-6 text-gray-600 dark:text-gray-300">
                Join our growing list of satisfied clients and experience the MAFL Logistics difference
              </p>
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto text-base md:text-lg px-6 py-5 md:px-8 md:py-6"
                onClick={handleGetQuote}
              >
                Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SimpleMotion>
          </div>
        </div>
      </section>

      <Footer />
    {/* </div> */}
    </>
  )
}
