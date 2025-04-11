"use client"

import { useState, useEffect } from "react"

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
      setIsScrolled(position > 10)
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Call handler right away to update scroll position
    handleScroll()

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { scrollPosition, isScrolled }
}
