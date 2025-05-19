"use client"

import { useState, useRef, JSX } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  Truck,
  Warehouse,
  Globe,
  Shield,
  Package,
  Clock,
  Map,
  PenToolIcon as Tool,
  Play,
  ChevronRight,
  Building,
  Forklift,
  Anchor,
  Wrench,
  Briefcase,
  FileCheck,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, useInView } from "framer-motion"
import PageBanner from "@/components/page-banner"
import { useTheme } from "next-themes"
import FAQSection from "@/components/faq-section"
import { useSupportChat } from "@/components/support-chat-context"
import { VideoPlayer } from "@/components/video-player"

// Service categories and their services
const serviceCategories = [
  {
    id: "transport",
    name: "Transport & Logistics",
    icon: <Truck className="h-6 w-6" />,
    description: "Comprehensive transportation solutions for all your cargo needs",
    services: [
      {
        id: "heavy-machinery",
        title: "Heavy Machinery Transport",
        icon: <Truck />,
        shortDescription: "Specialized transport for construction equipment and industrial machinery",
        fullDescription:
          "Our heavy machinery transport service provides specialized solutions for moving construction equipment, industrial machinery, and heavy cargo. Our fleet is equipped with the latest technology to handle oversized and heavy loads with precision and care, ensuring safe and timely delivery to your destination.",
        image: "/semitruck.jpg",
        videoUrl: "https://example.com/videos/heavy-machinery-transport.mp4",
        features: [
          "Specialized equipment for oversized loads",
          "Experienced drivers trained in heavy machinery transport",
          "Route planning and permits management",
          "24/7 tracking and monitoring",
          "Insurance coverage for high-value equipment",
        ],
      },
      {
        id: "cross-border",
        title: "Cross-Border Logistics",
        icon: <Globe />,
        shortDescription: "Seamless transport solutions across East Africa with customs clearance",
        fullDescription:
          "Our cross-border logistics service provides seamless transportation solutions across East Africa, including Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and South Sudan. We handle all aspects of customs clearance and documentation, ensuring your cargo moves efficiently across borders without delays.",
        image: "/black-truck-moving-city-s-suburb.jpg",
        videoUrl: "https://example.com/videos/cross-border-logistics.mp4",
        features: [
          "Comprehensive customs clearance services",
          "Documentation preparation and management",
          "Border crossing facilitation",
          "Multi-country transport coordination",
          "Regulatory compliance expertise",
        ],
      },
      {
        id: "bulk-cargo",
        title: "Bulk Cargo Transport",
        icon: <Package />,
        shortDescription: "Efficient transport of bulk materials and industrial goods",
        fullDescription:
          "Our bulk cargo transport service specializes in the efficient movement of large quantities of materials including construction supplies, agricultural products, and industrial goods. We work with major clients like Softcare Limited, Malimount Limited, and Silvermon Limited to deliver reliable bulk transportation solutions.",
        image: "/truck-vehicle-with-trailers-background.jpg",
        videoUrl: "https://example.com/videos/bulk-cargo-transport.mp4",
        features: [
          "High-capacity vehicles for maximum efficiency",
          "Specialized handling equipment",
          "Bulk loading and unloading expertise",
          "Volume-based pricing options",
          "Regular scheduled services available",
        ],
      },
      {
        id: "last-mile",
        title: "Last-Mile Delivery",
        icon: <Clock />,
        shortDescription: "Efficient distribution of goods from warehouses to final destinations",
        fullDescription:
          "Our last-mile delivery service ensures the efficient distribution of goods from warehouses to their final destinations. Ideal for retailers, manufacturers, and wholesalers, we provide timely and reliable delivery to complete the supply chain journey.",
        image: "/urban-delivery.png",
        videoUrl: "https://example.com/videos/last-mile-delivery.mp4",
        features: [
          "Urban and rural delivery coverage",
          "Time-sensitive delivery options",
          "Real-time tracking and notifications",
          "Proof of delivery documentation",
          "Return logistics management",
        ],
      },
      {
        id: "customs-clearance",
        title: "Customs Clearance",
        icon: <FileCheck />,
        shortDescription: "Expert customs documentation and clearance services for smooth border crossings",
        fullDescription:
          "Our customs clearance service provides expert handling of all documentation and procedures required for importing and exporting goods across international borders. Our team of experienced customs brokers ensures compliance with all regulations, minimizing delays and avoiding penalties while facilitating smooth movement of your cargo.",
        image: "/east-africa-cross-border-flow.png",
        videoUrl: "https://example.com/videos/customs-clearance.mp4",
        features: [
          "Documentation preparation and verification",
          "Tariff classification and duty calculation",
          "Customs broker representation",
          "Regulatory compliance management",
          "Import/export license facilitation",
        ],
      },
    ],
  },
  {
    id: "storage",
    name: "Warehousing & Storage",
    icon: <Warehouse className="h-6 w-6" />,
    description: "Secure storage solutions with comprehensive inventory management",
    services: [
      {
        id: "warehousing",
        title: "Warehousing & Storage",
        icon: <Warehouse />,
        shortDescription: "Secure storage facilities with inventory management",
        fullDescription:
          "Our warehousing and storage services provide secure facilities for goods, equipment, and materials with comprehensive inventory management. Our warehouses are strategically located for efficient distribution, offering both short-term and long-term storage solutions to meet your business needs.",
        image: "/bustling-warehouse-operations.png",
        videoUrl: "https://example.com/videos/warehousing.mp4",
        features: [
          "Climate-controlled storage options",
          "24/7 security and surveillance",
          "Inventory management systems",
          "Barcode scanning and tracking",
          "Flexible storage terms",
        ],
      },
      {
        id: "distribution",
        title: "Distribution Center Services",
        icon: <Building />,
        shortDescription: "Centralized distribution services for efficient supply chain management",
        fullDescription:
          "Our distribution center services provide a centralized hub for receiving, storing, and distributing products. We offer comprehensive supply chain solutions that help businesses optimize their distribution networks and reduce logistics costs while improving delivery times.",
        image: "/bustling-distribution-hub.png",
        videoUrl: "https://example.com/videos/distribution-center.mp4",
        features: [
          "Cross-docking capabilities",
          "Order fulfillment services",
          "Kitting and assembly",
          "Returns processing",
          "Inventory optimization",
        ],
      },
      {
        id: "inventory",
        title: "Inventory Management",
        icon: <Forklift />,
        shortDescription: "Advanced inventory tracking and management systems",
        fullDescription:
          "Our inventory management service provides advanced tracking and control systems to help you maintain optimal stock levels. We use the latest technology to provide real-time visibility of your inventory, helping you reduce costs and improve customer satisfaction through better stock management.",
        image: "/modern-warehouse-inventory.png",
        videoUrl: "https://example.com/videos/inventory-management.mp4",
        features: [
          "Real-time inventory visibility",
          "Stock level optimization",
          "Batch and lot tracking",
          "Expiration date management",
          "Regular inventory reporting",
        ],
      },
    ],
  },
  {
    id: "specialized",
    name: "Specialized Services",
    icon: <Shield className="h-6 w-6" />,
    description: "Specialized logistics solutions for unique transportation needs",
    services: [
      {
        id: "project-cargo",
        title: "Project Cargo & Oversized Load Transport",
        icon: <Map />,
        shortDescription: "Heavy lift transportation for construction and industrial projects",
        fullDescription:
          "Our project cargo and oversized load transport service specializes in the movement of exceptionally large or heavy items that require special handling, equipment, and permits. We provide comprehensive solutions for construction, mining, and industrial projects, with specialized handling of oversized machinery and equipment.",
        image: "/oversized-mining-truck.jpg",
        videoUrl: "https://example.com/videos/project-cargo.mp4",
        features: [
          "Specialized equipment for extra-heavy loads",
          "Project planning and engineering support",
          "Route surveys and obstacle removal coordination",
          "Permit acquisition for oversized loads",
          "Escort vehicle arrangements",
        ],
      },
      {
        id: "hazardous",
        title: "Hazardous Goods Transportation",
        icon: <Shield />,
        shortDescription: "Safe and compliant transport of hazardous materials",
        fullDescription:
          "Our hazardous goods transportation service ensures the safe and compliant movement of chemicals, fuel, and industrial hazardous materials. Our specially trained drivers and equipped vehicles meet all regulatory requirements for the transport of dangerous goods, prioritizing safety and environmental protection.",
        image: "/hazmat-highway.jpg",
        videoUrl: "https://example.com/videos/hazardous-transport.mp4",
        features: [
          "ADR certified drivers and vehicles",
          "Hazardous materials handling expertise",
          "Regulatory compliance management",
          "Emergency response planning",
          "Environmental protection measures",
        ],
      },
      {
        id: "port",
        title: "Port Logistics Services",
        icon: <Anchor />,
        shortDescription: "Comprehensive port-related logistics and cargo handling",
        fullDescription:
          "Our port logistics services provide comprehensive solutions for the movement of goods through major ports in East Africa. We handle container loading and unloading, customs clearance, documentation, and transportation to and from ports, ensuring smooth flow of your cargo through maritime gateways.",
        image: "/bustling-port-cranes.jpg",
        videoUrl: "https://example.com/videos/port-logistics.mp4",
        features: [
          "Container handling and management",
          "Port-to-door transportation",
          "Customs brokerage services",
          "Container loading and unloading",
          "Port documentation processing",
        ],
      },
    ],
  },
  {
    id: "construction",
    name: "Construction Services",
    icon: <Tool className="h-6 w-6" />,
    description: "Comprehensive road construction and heavy machinery services",
    services: [
      {
        id: "road-construction",
        title: "Road Construction Services",
        icon: <Tool />,
        shortDescription: "Complete road construction services including grading and maintenance",
        fullDescription:
          "Our road construction services provide complete solutions including grading, excavation, surfacing, and maintenance. We have successfully completed projects for Makueni County and Amboseli National Park, delivering high-quality road infrastructure that meets international standards and local requirements.",
        image: "/kenyan-road-work.png",
        videoUrl: "https://example.com/videos/road-construction.mp4",
        features: [
          "Road grading and leveling",
          "Excavation and earthmoving",
          "Surface preparation and paving",
          "Drainage system installation",
          "Road maintenance programs",
        ],
      },
      {
        id: "machinery-hire",
        title: "Heavy Machinery Hire",
        icon: <Wrench />,
        shortDescription: "Diverse fleet of heavy machinery for construction and industrial use",
        fullDescription:
          "Our heavy machinery hire service provides a diverse fleet of equipment for construction, earthmoving, and industrial applications. We offer flexible rental terms for bulldozers, excavators, graders, loaders, and other specialized machinery, with maintenance and operator options available.",
        image: "/bustling-construction.png",
        videoUrl: "https://example.com/videos/machinery-hire.mp4",
        features: [
          "Wide range of construction equipment",
          "Short and long-term rental options",
          "Qualified operators available",
          "On-site delivery and pickup",
          "Maintenance and support services",
        ],
      },
      {
        id: "fleet-leasing",
        title: "Fleet Leasing & Contract Hauling",
        icon: <Briefcase />,
        shortDescription: "Long-term truck leasing services and dedicated fleet solutions",
        fullDescription:
          "Our fleet leasing and contract hauling services provide long-term truck leasing options for businesses that need dedicated transportation resources without the capital investment. We offer customized fleet solutions tailored to your specific operational requirements and volume needs.",
        image: "/modern-logistics-fleet.png",
        videoUrl: "https://example.com/videos/fleet-leasing.mp4",
        features: [
          "Customized fleet solutions",
          "Dedicated vehicles and drivers",
          "Fleet management services",
          "Maintenance and compliance handling",
          "Flexible contract terms",
        ],
      },
    ],
  },
]

// Service FAQs
const serviceFAQs = [
  {
    question: "What areas do you provide transportation services in?",
    answer:
      "We provide transportation services throughout Kenya and across East Africa, including Uganda, Tanzania, Rwanda, Ethiopia, and South Sudan. Our extensive network allows us to offer reliable logistics solutions across the region.",
  },
  {
    question: "How do you handle customs clearance for cross-border shipments?",
    answer:
      "Our customs clearance team handles all documentation, tariff classification, duty calculation, and regulatory compliance. We work with customs authorities at all major border crossings to ensure smooth and efficient clearance of your goods.",
  },
  {
    question: "What types of goods can you transport?",
    answer:
      "We transport a wide range of goods including general cargo, construction materials, agricultural products, industrial equipment, hazardous materials (with proper certification), and oversized loads requiring specialized handling.",
  },
  {
    question: "Do you offer warehousing services?",
    answer:
      "Yes, we offer comprehensive warehousing services with facilities strategically located across Kenya. Our warehouses feature 24/7 security, inventory management systems, and both short-term and long-term storage options.",
  },
  {
    question: "How do you ensure the safety of transported goods?",
    answer:
      "We ensure safety through rigorous driver training, regular vehicle maintenance, GPS tracking on all vehicles, proper cargo securing procedures, and comprehensive insurance coverage for all shipments.",
  },
]

// Define the type for a service
type Service = {
  id: string
  title: string
  icon: JSX.Element
  shortDescription: string
  fullDescription: string
  image: string
  videoUrl: string
  features: string[]
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const servicesRef = useRef(null)
  const caseStudiesRef = useRef(null)
  const faqRef = useRef(null)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const { openChat } = useSupportChat()

  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 })
  const caseStudiesInView = useInView(caseStudiesRef, { once: true, amount: 0.2 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 })

  // Function to handle requesting a quote for a specific service
  const handleRequestQuote = (service:any) => {
    const quoteMessage = `I'm interested in getting a quote for your "${service.title}" service. Can you provide more information about pricing and availability?`
    openChat()
  }

  function setInitialMessage(message: string) {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <PageBanner
        title="Our Services"
        subtitle="Tailored logistics solutions designed to meet your specific business needs. Providing efficient, reliable, & safe logistics services across Kenya, East Africa, & beyond."
        backgroundImage="/services-background.jpg"
        imageAlt="Logistics Services Background"
      />

      {/* Services Categories */}
      <section ref={servicesRef} className="py-12 md:py-16 bg-white dark:bg-navy">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="transport" className="w-full">
            {/* Mobile-optimized TabsList */}
            <div className="mb-8">
              <TabsList className="flex justify-start md:justify-center bg-transparent w-max min-w-full md:w-auto">
                {serviceCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-full whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-navy hover:text-primary transition-all min-w-[150px] md:min-w-0"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {serviceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-8">
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-3xl font-bold text-navy dark:text-white mb-3">{category.name}</h3>
                  <p className="text-navy/80 dark:text-gray-300 max-w-3xl mx-auto">{category.description}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card
                        className="overflow-hidden hover:shadow-xl transition-all cursor-pointer border-gray-200 dark:border-gray-700 h-full hover:border-primary group"
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="rounded-full bg-primary p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform">
                              <Play className="h-6 w-6 text-navy" />
                            </div>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-primary/20 dark:bg-primary/30 rounded-full">{service.icon}</div>
                            <CardTitle className="text-xl text-navy dark:text-white">{service.title}</CardTitle>
                          </div>
                          <CardDescription className="text-navy/80 dark:text-gray-300 text-base">
                            {service.shortDescription}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full bg-primary hover:bg-primary/90 text-navy font-medium">
                                Learn More <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl flex items-center gap-3 text-navy dark:text-white">
                                  <div className="p-3 bg-primary/20 dark:bg-primary/30 rounded-full">
                                    {service.icon}
                                  </div>
                                  {service.title}
                                </DialogTitle>
                                <DialogDescription className="text-navy/80 dark:text-gray-300 text-base">
                                  {service.shortDescription}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="mt-6 space-y-6">
                                <div className="relative rounded-xl overflow-hidden">
                                  {showVideo ? (
                                    <VideoPlayer
                                      videoUrl={service.videoUrl}
                                      thumbnailUrl={service.image}
                                      title={service.title}
                                    />
                                  ) : (
                                    <div className="relative h-[350px] w-full">
                                      <Image
                                        src={service.image || "/placeholder.svg"}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Button
                                          className="bg-primary hover:bg-primary/90 text-navy"
                                          onClick={() => setShowVideo(true)}
                                        >
                                          <Play className="mr-2 h-4 w-4" /> Watch Video
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Overview</h3>
                                  <p className="text-navy/80 dark:text-gray-300 leading-relaxed">
                                    {service.fullDescription}
                                  </p>
                                </div>

                                <div>
                                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Key Features</h3>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.features.map((feature, index) => (
                                      <li key={index} className="flex items-start">
                                        <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-full mr-3 mt-0.5">
                                          <ChevronRight className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-navy/80 dark:text-gray-300">{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="flex justify-end">
                                  <DialogClose asChild>
                                    <Button
                                      className="bg-primary hover:bg-primary/90 text-navy font-medium"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRequestQuote(service)
                                      }}
                                    >
                                      Request Quote
                                    </Button>
                                  </DialogClose>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Case Studies - Enhanced styling */}
      <section ref={caseStudiesRef} className="py-12 md:py-16 bg-gray-50 dark:bg-navy">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={caseStudiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              Client Projects
            </span>
            <h2 className="text-4xl font-bold mb-3 text-navy dark:text-white">Our Success Stories</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              See how we've helped our clients overcome logistics challenges
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Makueni County Road Project",
                description:
                  "Provided road construction services, material transport, and grading services for Makueni County.",
                image: "/kenyan-road-work.png",
              },
              {
                title: "Amboseli National Park",
                description:
                  "Completed road grading and maintenance to improve park accessibility for tourists and staff.",
                image: "/amboseli-elephants-kilimanjaro.png",
              },
              {
                title: "Regional Logistics Network",
                description:
                  "Established seamless freight services to Kenya, Rwanda, Ethiopia, Uganda, and Tanzania with customs clearance support.",
                image: "/east-africa-cross-border-flow.png",
              },
            ].map((study, index) => (
              <motion.div
                key={study.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={caseStudiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-white dark:bg-navy/50 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all h-full">
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={study.image || "/placeholder.svg"}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-navy/80 dark:text-gray-300 leading-relaxed">{study.description}</p>
                    <Button
                      variant="link"
                      className="text-primary p-0 mt-4 font-medium"
                      onClick={() => {
                        const message = `I'm interested in learning more about your "${study.title}" case study. Can you provide more details about similar services?`
                        setInitialMessage(message)
                        openChat()
                      }}
                    >
                      Request Similar Service <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Only keeping one FAQ section */}
      <section ref={faqRef} className="py-12 md:py-16 bg-white dark:bg-navy">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              Common Questions
            </span>
            <h2 className="text-4xl font-bold mb-3 text-navy dark:text-white">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="max-w-3xl mx-auto text-lg text-navy/80 dark:text-gray-300">
              Find answers to common questions about our logistics and transportation services
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={serviceFAQs} className="bg-transparent" />
          </div>
        </div>
      </section>

      {/* Add Footer */}
      <Footer />
    </div>
  )
}
