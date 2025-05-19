"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

type Partner = {
  name: string
  type: string
  imageSrc: string
  lightImageSrc?: string
  link: string
}

type BrandDisplayProps = {
  partners: Partner[]
}

export function BrandDisplay({ partners }: BrandDisplayProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Check if component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {partners.map((partner, index) => (
        <Link
          key={index}
          href={partner.link}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md border border-gray-100 dark:border-gray-700 h-full"
        >
          <div className="relative w-full h-16 md:h-20">
            <Image
              src={isDark && partner.lightImageSrc ? partner.lightImageSrc : partner.imageSrc}
              alt={partner.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="mt-3 text-sm md:text-base font-semibold text-gray-900 dark:text-white">{partner.name}</h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{partner.type}</p>
        </Link>
      ))}
    </div>
  )
}
