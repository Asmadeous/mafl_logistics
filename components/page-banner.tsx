"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface PageBannerProps {
  title: string
  subtitle?: string
  backgroundImage: string
  imageAlt: string
}

export function PageBanner({ title, subtitle, backgroundImage, imageAlt }: PageBannerProps) {
  return (
    <section className="relative py-10 md:py-20">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={imageAlt}
          fill
          className="object-cover opacity-10 dark:opacity-20"
        />
      </div>
      {/* <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3">
            <div className="h-1 w-20 bg-primary mx-auto"></div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black dark:text-white">
              {title}
            </h1>
            {subtitle && <p className="max-w-[700px] md:text-xl text-black dark:text-gray-200">{subtitle}</p>}
          </div>
        </motion.div> */}
      {/* </div> */}
    </section>
  )
}

export default PageBanner