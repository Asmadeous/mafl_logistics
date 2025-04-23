"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Truck, Globe, Warehouse, TruckIcon, Thermometer, Package, AlertTriangle, ChevronRight, MapPin } from 'lucide-react'
import { FileContract } from "@/components/icons/file-contract"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
 DialogClose,
} from "@/components/ui/dialog"
import type { JSX } from "react/jsx-runtime"
import { urls } from "@/config/urls"

export default function ServicesPage() {
 const [currentSlide, setCurrentSlide] = useState(0)
 const [selectedService, setSelectedService] = useState<null | {
   title: string
   description: string
   icon: JSX.Element
   longDescription?: string
   features?: string[]
   image?: string
   videoUrl?: string
 }>(null)

 const services = [
   {
     title: "Heavy Machinery Transport",
     description: "Specialized transport for construction equipment, industrial machinery, and heavy cargo.",
     icon: <Truck className="h-10 w-10 text-mafl-orange" />,
     image: urls.images.heavyMachineryTransport,
   },
   {
     title: "Cross-Border Logistics",
     description: "Seamless transport solutions across East Africa with customs clearance assistance.",
     icon: <Globe className="h-10 w-10 text-mafl-orange" />,
     image: urls.images.crossBorderLogistics,
   },
   {
     title: "Road Construction Services",
     description: "Complete road construction services, including grading, excavation, surfacing, & maintenance.",
     icon: <Warehouse className="h-10 w-10 text-mafl-orange" />,
     image: urls.images.roadConstruction,
   },
 ]

 const additionalServices = [
   {
     title: "Heavy Machinery Hire",
     description: "Providing a diverse fleet of heavy machinery for construction, earthmoving, & industrial use.",
     icon: <TruckIcon className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our heavy machinery hire service provides clients with access to a diverse fleet of construction and industrial equipment. From excavators and bulldozers to cranes and loaders, we offer flexible rental options to meet your project needs.",
     features: [
       "Wide range of construction and earthmoving equipment",
       "Flexible rental terms - daily, weekly, or monthly",
       "Qualified operators available",
       "Maintenance and support included",
     ],
     image: urls.images.heavyMachineryHire,
     videoUrl: urls.videos.heavyMachinery,
   },
   {
     title: "Cold Chain Logistics",
     description: "Transportation of perishable goods under temperature-controlled conditions.",
     icon: <Thermometer className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our cold chain logistics service maintains the integrity of temperature-sensitive products throughout the entire supply chain. We use state-of-the-art refrigerated vehicles and monitoring systems to ensure your perishable goods arrive in perfect condition.",
     features: [
       "Temperature-controlled vehicles for food products, pharmaceuticals, & chemicals",
       "Real-time temperature monitoring and alerts",
       "Compliance with international cold chain standards",
       "Specialized handling for sensitive products",
     ],
     image: urls.images.coldChainLogistics,
     videoUrl: urls.videos.coldChainLogistics,
   },
   {
     title: "Project Cargo & Oversized Load",
     description: "Heavy lift transportation for construction, mining, & industrial projects.",
     icon: <Package className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our project cargo and oversized load service specializes in the transportation of exceptionally large and heavy items that exceed standard shipping dimensions. We handle everything from industrial equipment to construction materials with precision and care.",
     features: [
       "Specialized equipment for heavy and oversized cargo",
       "Route surveys and planning for safe transport",
       "Permits and escort arrangements",
       "Experienced team for complex loading and unloading",
     ],
     image: urls.images.projectCargo,
     videoUrl: urls.videos.projectCargo,
   },
   {
     title: "Hazardous Goods Transportation",
     description: "Safe & compliant transport of chemicals, fuel, and industrial hazardous materials.",
     icon: <AlertTriangle className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our hazardous goods transportation service ensures the safe and compliant movement of dangerous materials. We follow strict international and local regulations, using specialized equipment and trained personnel to handle these sensitive shipments.",
     features: [
       "ADR-certified drivers and vehicles",
       "Compliance with international hazardous materials regulations",
       "Specialized containment and safety equipment",
       "Emergency response planning and support",
     ],
     image: urls.images.hazardousGoods,
     videoUrl: urls.videos.hazardousGoods,
   },
   {
     title: "Last-Mile Delivery",
     description: "Efficient distribution of goods from warehouses to final destinations.",
     icon: <MapPin className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our last-mile delivery service ensures your products reach their final destination efficiently and on time. Ideal for retailers, manufacturers, and wholesalers, we handle the critical final leg of the supply chain with precision and care.",
     features: [
       "Efficient distribution from warehouses to final destinations",
       "Real-time tracking and delivery confirmation",
       "Flexible scheduling options",
       "Specialized handling for fragile or high-value items",
     ],
     image: urls.images.lastMileDelivery,
     videoUrl: null,
   },
   {
     title: "Fleet Leasing & Contract Hauling",
     description: "Long-term truck leasing services and dedicated fleet solutions for businesses.",
     icon: <FileContract className="h-6 w-6 text-mafl-orange" />,
     longDescription:
       "Our fleet leasing and contract hauling services provide businesses with dedicated transportation solutions without the overhead of maintaining their own fleet. We offer flexible terms and customized arrangements to meet your specific logistics needs.",
     features: [
       "Long-term truck leasing services for businesses",
       "Dedicated fleet solutions tailored to client needs",
       "Reduced capital expenditure and maintenance costs",
       "Scalable capacity to meet changing business demands",
     ],
     image: urls.images.fleetLeasing,
     videoUrl: null,
   },
 ]

 // Auto-rotate carousel every 3 seconds
 useEffect(() => {
   const interval = setInterval(() => {
     setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1))
   }, 3000)

   return () => clearInterval(interval)
 }, [services.length])

 const openServiceModal = (service: (typeof additionalServices)[0]) => {
   setSelectedService(service)
 }

 return (
   <div className="pt-24 pb-16">
     {/* Hero Section */}
     <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="text-center max-w-3xl mx-auto"
         >
           <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
           <div className="flex items-center justify-center mb-6">
             <div className="h-1 w-20 bg-mafl-orange rounded-full"></div>
           </div>
           <p className="text-xl text-muted-foreground">
             Providing efficient, reliable, & safe logistics solutions across Kenya, East Africa, & beyond.
           </p>
         </motion.div>
       </div>
     </section>

     {/* Services Carousel */}
     <section className="py-16 bg-white dark:bg-mafl-dark/30">
       <div className="container mx-auto px-4">
         <motion.h2
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-3xl font-bold mb-4 text-center"
         >
           Core Services
         </motion.h2>
         <div className="flex items-center justify-center mb-12">
           <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
         </div>

         <div className="relative">
           <div className="overflow-hidden">
             <div
               className="flex transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
             >
               {services.map((service, index) => (
                 <div key={index} className="w-full flex-shrink-0 px-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <motion.div
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.5 }}
                     >
                       <div className="mb-4">{service.icon}</div>
                       <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                       <p className="text-muted-foreground mb-6">{service.description}</p>
                       <ul className="space-y-2">
                         <li className="flex items-start">
                           <span className="text-mafl-orange mr-2">•</span>
                           <span>Professional handling of specialized equipment</span>
                         </li>
                         <li className="flex items-start">
                           <span className="text-mafl-orange mr-2">•</span>
                           <span>Experienced drivers and logistics coordinators</span>
                         </li>
                         <li className="flex items-start">
                           <span className="text-mafl-orange mr-2">•</span>
                           <span>Comprehensive insurance coverage</span>
                         </li>
                       </ul>
                     </motion.div>
                     <motion.div
                       initial={{ opacity: 0, x: 30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.5 }}
                       className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg"
                     >
                       <Image
                         src={service.image || "/placeholder.svg"}
                         alt={`${service.title} - MAFL Logistics Kenya`}
                         fill
                         className="object-cover"
                       />
                     </motion.div>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="flex justify-center mt-6 space-x-2">
             {services.map((_, index) => (
               <button
                 key={index}
                 className={`h-2 w-2 rounded-full transition-colors ${
                   currentSlide === index ? "bg-mafl-orange" : "bg-gray-300 dark:bg-gray-600"
                 }`}
                 onClick={() => setCurrentSlide(index)}
                 aria-label={`Go to slide ${index + 1}`}
               />
             ))}
           </div>
         </div>
       </div>
     </section>

     {/* Additional Services */}
     <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
       <div className="container mx-auto px-4">
         <motion.h2
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="text-3xl font-bold mb-4 text-center"
         >
           Additional Services
         </motion.h2>
         <div className="flex items-center justify-center mb-12">
           <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
         </div>

         <Tabs defaultValue="all" className="w-full">
           <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
             <TabsTrigger value="all">All Services</TabsTrigger>
             <TabsTrigger value="specialized">Specialized</TabsTrigger>
           </TabsList>

           <TabsContent value="all" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {additionalServices.map((service, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.3, delay: index * 0.1 }}
                   onClick={() => openServiceModal(service)}
                   className="cursor-pointer transform transition-transform hover:scale-105"
                 >
                   <Card className="h-full overflow-hidden">
                     <div className="relative h-40 w-full">
                       <Image
                         src={service.image || "/placeholder.svg"}
                         alt={`${service.title} - MAFL Logistics Kenya`}
                         fill
                         className="object-cover"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-3 left-3 bg-mafl-orange p-2 rounded-full">{service.icon}</div>
                     </div>
                     <CardHeader>
                       <CardTitle>{service.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <CardDescription>{service.description}</CardDescription>
                       <div className="mt-4 text-sm text-mafl-orange font-medium flex items-center">
                         <span>View details</span>
                         <ChevronRight className="h-4 w-4 ml-1" />
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
           </TabsContent>

           <TabsContent value="specialized" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {additionalServices.slice(1, 3).map((service, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.3, delay: index * 0.1 }}
                   onClick={() => openServiceModal(service)}
                   className="cursor-pointer transform transition-transform hover:scale-105"
                 >
                   <Card className="h-full overflow-hidden">
                     <div className="relative h-48 w-full">
                       <Image
                         src={service.image || "/placeholder.svg"}
                         alt={`${service.title} - MAFL Logistics Kenya`}
                         fill
                         className="object-cover"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-3 left-3 bg-mafl-orange p-2 rounded-full">{service.icon}</div>
                     </div>
                     <CardHeader>
                       <CardTitle>{service.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <CardDescription>{service.description}</CardDescription>
                       <div className="mt-4 text-sm text-mafl-orange font-medium flex items-center">
                         <span>View details</span>
                         <ChevronRight className="h-4 w-4 ml-1" />
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
           </TabsContent>
         </Tabs>
       </div>
     </section>

     {/* Service Detail Modal */}
     <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
       <DialogContent className="sm:max-w-3xl">
         <DialogHeader>
           <DialogTitle className="flex items-center text-2xl">
             {selectedService?.icon && <span className="mr-2">{selectedService.icon}</span>}
             {selectedService?.title}
           </DialogTitle>
           <DialogDescription className="text-base mt-2">{selectedService?.description}</DialogDescription>
         </DialogHeader>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
           <div>
             <div className="prose dark:prose-invert">
               <p>{selectedService?.longDescription}</p>

               {selectedService?.features && (
                 <>
                   <h4 className="text-lg font-semibold mt-4 mb-2">Key Features</h4>
                   <ul className="space-y-1">
                     {selectedService?.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start">
                         <span className="text-mafl-orange mr-2">•</span>
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </>
               )}
             </div>
           </div>

           <div className="space-y-4">
             {selectedService?.image && (
               <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                 <Image
                   src={selectedService.image || "/placeholder.svg"}
                   alt={`${selectedService.title} - MAFL Logistics Kenya`}
                   fill
                   className="object-cover"
                 />
               </div>
             )}

             {selectedService?.videoUrl && (
               <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                 <video className="w-full h-full object-cover" controls poster={selectedService.image}>
                   <source src={selectedService.videoUrl} type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>
               </div>
             )}
           </div>
         </div>

         <div className="mt-6 flex justify-end">
           <DialogClose asChild>
             <Button variant="outline">Close</Button>
           </DialogClose>
         </div>
       </DialogContent>
     </Dialog>
   </div>
 )
}
