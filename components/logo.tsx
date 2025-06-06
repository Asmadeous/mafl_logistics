"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Logo({
  className,
  width = 50,
  height = 50,
  showText = false,
  rounded = true,
}: {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  rounded?: boolean
}) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Link href="/" className={cn("flex items-center", className)}>
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
          <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
        </div>
        {showText && (
          <span className="ml-2 text-xl font-bold tracking-tight">
            <span style={{ color: "#FF6600" }}>MAFL</span>{" "}
            <span className="text-black">Logistics</span>
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: rounded ? "50%" : "0",
        }}
      >
        <Image
          src={theme === "dark" ? "/logo-white.png" : "/logo-dark.jpeg"}
          alt="MAFL Logistics Logo"
          width={100}
          height={100}
          sizes="120px"
          className="object-cover"
        />
      </div>
      {showText && (
        <span className="ml-2 text-xl font-bold tracking-tight">
          <span style={{ color: "#FF6600" }}>MAFL</span>{" "}
          <span>Logistics</span>
        </span>
      )}
    </Link>
  )
}
