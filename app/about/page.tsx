"use client"

import type React from "react"

import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Award, Target, Users, TrendingUp, CheckCircle, Star, Clock, Flag, Zap, BarChart } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const stats = [
    { label: "Years of Experience", value: "3+", icon: <Calendar className="h-6 w-6 text-mafl-orange" /> },
    { label: "Countries Served", value: "5+", icon: <Globe className="h-6 w-6 text-mafl-orange" /> },
    { label: "Satisfied Clients", value: "100+", icon: <Users className="h-6 w-6 text-mafl-orange" /> },
    { label: "Successful Deliveries", value: "1000+", icon: <TrendingUp className="h-6 w-6 text-mafl-orange" /> },
  ]

  const values = [
    { title: "Integrity", description: "We conduct our business with honesty, transparency, and ethical standards." },
    { title: "Reliability", description: "We deliver on our promises, ensuring timely and consistent service." },
    { title: "Excellence", description: "We strive for the highest standards in all aspects of our operations." },
    { title: "Innovation", description: "We embrace new technologies and methods to improve our services." },
    {
      title: "Customer Focus",
      description: "We prioritize our customers' needs and satisfaction in everything we do.",
    },
    { title: "Safety", description: "We maintain the highest safety standards for our team, cargo, and environment." },
  ]

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description:
        "MAFL Logistics was established in Malili, Kenya by Mahdi M. Issack with a vision to provide reliable logistics solutions across East Africa.",
      icon: <Flag className="h-6 w-6 text-white" />,
    },
    {
      year: "2019",
      title: "Fleet Expansion",
      description:
        "Expanded our fleet with specialized vehicles for heavy machinery transport and cross-border logistics.",
      icon: <Truck className="h-6 w-6 text-white" />,
    },
    {
      year: "2020",
      title: "Regional Expansion",
      description: "Extended operations to neighboring countries including Uganda, Tanzania, and Rwanda.",
      icon: <Globe className="h-6 w-6 text-white" />,
    },
    {
      year: "2021",
      title: "Warehousing Services",
      description:
        "Launched comprehensive warehousing and storage solutions to complement our transportation services.",
      icon: <Warehouse className="h-6 w-6 text-white" />,
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description:
        "Implemented advanced tracking and management systems to enhance operational efficiency and customer experience.",
      icon: <Zap className="h-6 w-6 text-white" />,
    },
    {
      year: "2023",
      title: "100+ Client Milestone",
      description: "Celebrated serving over 100 satisfied clients across various industries in East Africa.",
      icon: <Users className="h-6 w-6 text-white" />,
    },
  ]

  const achievements = [
    {
      title: "Makueni County Road Contracts",
      year: "2022",
      description: "Successfully completed material transport and grading services for Makueni County road projects.",
      icon: <Award className="h-10 w-10 text-mafl-orange" />,
    },
    {
      title: "Amboseli National Park Roads",
      year: "2021",
      description: "Provided road grading and maintenance services to improve accessibility in Amboseli National Park.",
      icon: <Shield className="h-10 w-10 text-mafl-orange" />,
    },
    {
      title: "Cross-Border Logistics Excellence",
      year: "2023",
      description: "Established seamless freight services to Kenya, Rwanda, Ethiopia, Uganda, and Tanzania.",
      icon: <Star className="h-10 w-10 text-mafl-orange" />,
    },
  ]

  const highlights = [
    {
      title: "Tech-Driven Efficiency",
      description: "Advanced tracking systems ensuring seamless deliveries across East Africa.",
      icon: <Clock className="h-8 w-8 text-mafl-orange" />,
    },
    {
      title: "Customer Focus",
      description: "Tailored logistics solutions creating lasting partnerships with clients.",
      icon: <Shield className="h-8 w-8 text-mafl-orange" />,
    },
    {
      title: "Regional & Cross-Border Reach",
      description: "Extensive network covering Kenya and neighboring East African countries.",
      icon: <Lightbulb className="h-8 w-8 text-mafl-orange" />,
    },
    {
      title: "Diverse Logistics Services",
      description: "Comprehensive solutions from heavy machinery transport to road construction.",
      icon: <BarChart className="h-8 w-8 text-mafl-orange" />,
    },
  ]

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About MAFL Logistics</h1>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-20 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-xl text-muted-foreground">
              Your Trusted Partner for Reliable, Efficient, Innovative Logistics Solutions Across Kenya & East Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src="/images/about-company.jpg"
                alt="MAFL Logistics - Kenyan Logistics Company"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="h-1 w-12 bg-mafl-orange rounded-full mb-6"></div>
              <p className="text-lg mb-4">
                MAFL Logistics specializes in providing efficient & reliable transportation solutions across Kenya.
                Founded by Mahdi M. Issack, we focus on heavy machinery transport, warehousing & storage, containerized
                & bulk cargo, & hauling services.
              </p>
              <p className="text-lg mb-6">
                With a dedicated fleet, we ensure safe, timely, & hassle-free deliveries for industrial equipment,
                construction materials, & bulk shipments.
              </p>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-mafl-orange mr-2" />
                <span>Delivering Efficiency & Reliability Across East Africa</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            Our Journey
          </motion.h2>
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-mafl-orange/30"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-mafl-orange flex items-center justify-center z-10">
                    {milestone.icon}
                  </div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "pl-8"}`}>
                    <div className="bg-white dark:bg-mafl-dark/70 p-6 rounded-lg shadow-md">
                      <div className="text-mafl-orange font-bold text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            Key Achievements
          </motion.h2>
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-mafl-dark/50 rounded-xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="mb-4">{achievement.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <div className="text-mafl-orange font-medium mb-3">{achievement.year}</div>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            Our Impact
          </motion.h2>
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardHeader className="pb-2">
                    <div className="mx-auto mb-2">{stat.icon}</div>
                    <CardTitle className="text-4xl font-bold">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Highlights */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            Company Highlights
          </motion.h2>
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full border-t-4 border-mafl-orange">
                  <CardHeader>
                    <div className="mb-2">{highlight.icon}</div>
                    <CardTitle>{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="bg-mafl-orange text-white p-8 rounded-xl"
            >
              <div className="mb-4">
                <Target className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-4">
                To offer seamless, secure, & cost-effective logistics solutions that help businesses grow while ensuring
                timely & safe delivery of goods.
              </p>
              <p className="text-lg">
                Delivering reliable, efficient, & innovative logistics solutions while building lasting partnerships.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-mafl-dark text-white p-8 rounded-xl"
            >
              <div className="mb-4">
                <Award className="h-10 w-10 text-mafl-orange" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg mb-4">
                To be East Africa's leading logistics provider through innovation, service excellence, & regional
                expansion.
              </p>
              <p className="text-lg">
                To become Kenya's leading logistics provider, setting new standards in efficiency, innovation, &
                customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company History Tabs */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-center"
          >
            Our History
          </motion.h2>
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
          </div>

          <Tabs defaultValue="foundation" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="foundation">Foundation</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="present">Present Day</TabsTrigger>
            </TabsList>

            <TabsContent value="foundation" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/history-foundation.jpg"
                    alt="MAFL Logistics Foundation - Kenyan Logistics Company"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">The Beginning (2018)</h3>
                  <p className="text-muted-foreground mb-4">
                    MAFL Logistics was founded in 2018 by Mahdi M. Issack with a vision to address the logistics
                    challenges in Kenya and East Africa. Starting with just two trucks, the company focused on providing
                    reliable transportation for construction materials and equipment.
                  </p>
                  <p className="text-muted-foreground">
                    The early days were marked by determination and a commitment to excellence, laying the foundation
                    for what would become one of the region's most trusted logistics providers.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="growth" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Expansion Years (2019-2021)</h3>
                  <p className="text-muted-foreground mb-4">
                    Between 2019 and 2021, MAFL Logistics experienced significant growth, expanding its fleet and
                    service offerings. The company ventured into cross-border logistics, connecting businesses across
                    East Africa with efficient transportation solutions.
                  </p>
                  <p className="text-muted-foreground">
                    During this period, we also established our warehousing division, providing comprehensive logistics
                    solutions that went beyond transportation. Our client base grew steadily as our reputation for
                    reliability and excellence spread throughout the region.
                  </p>
                </div>
                <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/history-growth.jpg"
                    alt="MAFL Logistics Growth - Kenyan Logistics Company"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="present" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/history-present.jpg"
                    alt="MAFL Logistics Today - Kenyan Logistics Company"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">MAFL Today (2022-Present)</h3>
                  <p className="text-muted-foreground mb-4">
                    Today, MAFL Logistics stands as a prominent player in the East African logistics industry. With a
                    modern fleet, state-of-the-art tracking systems, and a team of experienced professionals, we
                    continue to set new standards in the industry.
                  </p>
                  <p className="text-muted-foreground">
                    We've embraced digital transformation to enhance our operations and customer experience, while
                    maintaining our core values of reliability, integrity, and excellence. As we look to the future, we
                    remain committed to innovation and expansion, always with our customers' needs at the center of
                    everything we do.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We prioritize integrity, professionalism, & customer-focused service in every delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our logistics services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What areas do you serve?</AccordionTrigger>
                <AccordionContent>
                  We provide logistics services throughout Kenya and across East Africa, including Rwanda, Uganda,
                  Tanzania, Ethiopia, and South Sudan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do you ensure the safety of transported goods?</AccordionTrigger>
                <AccordionContent>
                  We implement strict safety protocols, use appropriate equipment for different cargo types, and provide
                  comprehensive insurance coverage for all shipments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can you handle oversized or specialized cargo?</AccordionTrigger>
                <AccordionContent>
                  Yes, we specialize in transporting heavy machinery, oversized loads, and specialized equipment with
                  our purpose-built fleet and experienced team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What makes MAFL Logistics different from other providers?</AccordionTrigger>
                <AccordionContent>
                  Our commitment to reliability, customer-focused approach, regional expertise, and comprehensive
                  service offerings set us apart in the logistics industry.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function Truck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L16 6h-4v11h3" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}

function Warehouse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <rect width="12" height="2" x="6" y="10" />
    </svg>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

