"use client"

import { useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Flag, Globe, Lightbulb, Building, Clock, CheckCircle, Shield } from "lucide-react"
import PageBanner from "@/components/page-banner"
import { useTheme } from "next-themes"
import FAQSection from "@/components/faq-section"

export default function AboutPage() {
  const valuesRef = useRef(null)
  const journeyRef = useRef(null)
  const teamRef = useRef(null)
  const ceoRef = useRef(null)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 })
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.2 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 })
  const ceoInView = useInView(ceoRef, { once: true, amount: 0.2 })

  // For example:
  const faqs = [
    {
      question: "What areas does MAFL Logistics operate in?",
      answer:
        "MAFL Logistics operates throughout Kenya and East Africa, with a focus on major transport corridors and cross-border routes.",
    },
    {
      question: "What types of cargo does MAFL transport?",
      answer:
        "We specialize in bulk cargo, oversized equipment, construction materials, and general freight across various industries.",
    },
    {
      question: "How does MAFL ensure cargo safety?",
      answer:
        "We implement rigorous safety protocols, use modern tracking technology, and employ experienced drivers trained in cargo security.",
    },
    {
      question: "Does MAFL handle customs clearance for cross-border shipments?",
      answer:
        "Yes, we provide comprehensive customs clearance services to ensure smooth cross-border operations for our clients.",
    },
    {
      question: "What makes MAFL different from other logistics providers?",
      answer:
        "Our deep local knowledge, dedicated customer service, modern fleet, and commitment to reliability set us apart in the East African logistics market.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <PageBanner
        title="About MAFL Logistics"
        subtitle="Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa."
        backgroundImage="/kenyan-logistics-team.jpg"
        imageAlt="About MAFL Logistics"
      />

      {/* About Company - Enhanced styling */}
      <section className="py-20 bg-white dark:bg-navy">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image src="/kenyan-logistics-team.jpg" alt="About MAFL Logistics" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-4 py-1.5 bg-primary text-navy rounded-full text-sm font-medium mb-2">
                  Est. 2021
                </span>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  Our Story
                </span>
                <h2 className="text-4xl font-bold tracking-tight mb-6 text-navy dark:text-white">About Our Company</h2>
              </div>
              <p className="text-lg text-navy dark:text-gray-300 leading-relaxed">
                MAFL Logistics specializes in providing efficient & reliable transportation solutions across Kenya.
                Founded by Mahdi M. Issack, we focus on heavy machinery transport, warehousing & storage, containerized
                & bulk cargo, & hauling services.
              </p>
              <p className="text-lg text-navy dark:text-gray-300 leading-relaxed">
                With a dedicated fleet, we ensure safe, timely, & hassle-free deliveries for industrial equipment,
                construction materials, & bulk shipments. Our commitment to excellence has made us a trusted partner for
                businesses across East Africa.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Reliable</h4>
                    <p className="text-sm text-navy/70 dark:text-gray-400">Consistent service</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white">Secure</h4>
                    <p className="text-sm text-navy/70 dark:text-gray-400">Safe transport</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline - Enhanced styling with mobile responsiveness */}
      <section ref={journeyRef} className="py-20 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Our History
            </span>
            <h2 className="text-4xl font-bold mb-4 text-navy dark:text-white">Our Journey</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              From humble beginnings to becoming a leading logistics provider in East Africa
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on md screens and up */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/30"></div>

            {/* 2021 */}
            <motion.div
              className="relative mb-16 md:mb-32"
              initial={{ opacity: 0, y: 30 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Year icon - centered on mobile, positioned on timeline for desktop */}
              <div className="flex justify-center md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:-top-6 mb-6 md:mb-0">
                <div className="bg-primary text-navy font-bold text-xl rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
                  <Flag className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right md:pr-12">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                    2021
                  </span>
                  <h3 className="text-2xl font-bold mb-4 text-navy dark:text-white">Humble Beginnings</h3>
                  <p className="text-navy dark:text-white leading-relaxed">
                    Founded in 2021, MAFL Logistics started with local freight operations, focusing on delivering
                    reliable & efficient logistics solutions across Kenya. The early days were marked by determination
                    and a commitment to excellence, laying the foundation for what would become one of the region's most
                    trusted logistics providers.
                  </p>
                </div>
                <div className="block">
                  <div className="relative h-[250px] w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/logistics-team-planning.jpg"
                      alt="MAFL Logistics Foundation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2022 */}
            <motion.div
              className="relative mb-16 md:mb-32"
              initial={{ opacity: 0, y: 30 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Year icon - centered on mobile, positioned on timeline for desktop */}
              <div className="flex justify-center md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:-top-6 mb-6 md:mb-0">
                <div className="bg-primary text-navy font-bold text-xl rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="block md:order-1 order-2">
                  <div className="relative h-[250px] w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/mafl-truck.jpeg"
                      alt="MAFL Logistics Growth"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:text-left md:pl-12 md:order-2 order-1">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                    2022
                  </span>
                  <h3 className="text-2xl font-bold mb-4 text-navy dark:text-white">Expanding Horizons</h3>
                  <p className="text-navy dark:text-white leading-relaxed">
                    Through investment in technology & strong partnerships, we expanded into regional & cross-border
                    logistics, serving Kenya, Rwanda, & Ethiopia. This period marked significant growth in our fleet
                    size and service capabilities, establishing key partnerships with major clients and government
                    entities.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2023 */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={journeyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Year icon - centered on mobile, positioned on timeline for desktop */}
              <div className="flex justify-center md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:-top-6 mb-6 md:mb-0">
                <div className="bg-primary text-navy font-bold text-xl rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right md:pr-12">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                    2023
                  </span>
                  <h3 className="text-2xl font-bold mb-4 text-navy dark:text-white">Innovation & Excellence</h3>
                  <p className="text-navy dark:text-white leading-relaxed">
                    MAFL Logistics continues to grow by specializing in heavy machinery transport, warehousing, & bulk
                    cargo handling while innovating to meet future logistics needs. Today, we're recognized as a leader
                    in specialized logistics solutions across East Africa, with a reputation for reliability, safety,
                    and customer satisfaction.
                  </p>
                </div>
                <div className="block">
                  <div className="relative h-[250px] w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/fleet.jpg"
                      alt="MAFL Logistics Present Day"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values - Enhanced styling */}
      <section ref={valuesRef} className="py-20 bg-white dark:bg-navy text-navy dark:text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              What Drives Us
            </span>
            <h2 className="text-4xl font-bold mb-4 text-navy dark:text-white">Our Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              We prioritize integrity, professionalism, & customer-focused service in every delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                icon: <CheckCircle className="h-10 w-10 text-primary mb-4" />,
                description: "We conduct our business with honesty, transparency, and ethical standards.",
              },
              {
                title: "Reliability",
                icon: <Clock className="h-10 w-10 text-primary mb-4" />,
                description: "We deliver on our promises, ensuring timely and consistent service.",
              },
              {
                title: "Excellence",
                icon: <Building className="h-10 w-10 text-primary mb-4" />,
                description: "We strive for the highest standards in all aspects of our operations.",
              },
              {
                title: "Innovation",
                icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />,
                description: "We embrace new technologies and methods to improve our services.",
              },
              {
                title: "Customer Focus",
                icon: <Globe className="h-10 w-10 text-primary mb-4" />,
                description: "We prioritize our customers' needs and satisfaction in everything we do.",
              },
              {
                title: "Safety",
                icon: <Shield className="h-10 w-10 text-primary mb-4" />,
                description: "We maintain the highest safety standards for our team, cargo, and environment.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-gray-50 dark:bg-navy/50 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-primary/10 p-4 rounded-full mb-2">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-navy dark:text-white">{value.title}</h3>
                <p className="text-navy/80 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Statement - Enhanced styling */}
      <section ref={ceoRef} className="py-20 bg-gray-50 dark:bg-navy/90">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-6 order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={ceoInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  Leadership
                </span>
                <h2 className="text-4xl font-bold mb-6 text-navy dark:text-white">CEO Statement</h2>
              </div>
              <div className="bg-white dark:bg-navy/50 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xl text-navy dark:text-gray-300 italic leading-relaxed mb-6">
                  "At MAFL Logistics, we go beyond moving goods, we deliver trust, precision, & value. Committed to
                  timely & secure deliveries, we continue to invest in technology, expand our fleet, & build strong
                  partnerships. From heavy machinery transport to warehousing & bulk cargo handling, we are your
                  reliable logistics partner."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image src="/ceo-mahdi-issack.jpg" alt="CEO" width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-navy dark:text-white font-bold">Mahdi M. Issack</p>
                    <p className="text-navy/70 dark:text-gray-400 text-sm">CEO & Founder</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[400px] order-1 md:order-2 rounded-xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={ceoInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Image src="/ceo-mahdi-issack.jpg" alt="Mahdi M. Issack, CEO" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team - Enhanced styling */}
      <section ref={teamRef} className="py-20 bg-white dark:bg-navy">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Our People
            </span>
            <h2 className="text-4xl font-bold mb-4 text-navy dark:text-white">Meet Our Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              The dedicated professionals behind MAFL Logistics' success
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: "Mahdi M. Issack", role: "CEO & Founder", image: "/ceo-mahdi-issack.jpg" },
              { name: "Sarah Kimani", role: "Operations Manager", image: "/focused-logistics-professional.png" },
              { name: "David Ochieng", role: "Logistics Coordinator", image: "/head-of-operations.jpg" },
              { name: "James Mwangi", role: "Fleet Manager", image: "/confident-fleet-manager.png" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="relative h-[300px] overflow-hidden rounded-xl shadow-lg mb-6">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm opacity-80">
                      Dedicated to excellence in logistics and transportation solutions across East Africa.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-navy dark:text-white">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced styling */}
      <section className="py-20 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Common Questions
            </span>
            <h2 className="text-4xl font-bold mb-4 text-navy dark:text-white">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              Find answers to common questions about our logistics services
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} className="bg-transparent" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
