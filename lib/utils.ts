import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility functions for the application
 */

// Function to format a date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Function to format currency
export function formatCurrency(amount: number, currency = "KES"): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
  }).format(amount)
}

// Function to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Function to generate a random ID
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

// Function to get initials from a name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Function to debounce a function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Function to throttle a function
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Function to get CSS variable value
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

// Function to set CSS variable
export function setCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value)
}

// Function to get HSL color from CSS variable
export function getHslColor(variable: string): string {
  return `hsl(var(--${variable}))`
}

// Function to check if an element is in viewport
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Function to check if device is mobile
export function isMobile(): boolean {
  return window.innerWidth < 768
}

// Function to check if device is tablet
export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

// Function to check if device is desktop
export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}

// Function to get browser name
export function getBrowserName(): string {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf("Chrome") > -1) return "Chrome"
  if (userAgent.indexOf("Safari") > -1) return "Safari"
  if (userAgent.indexOf("Firefox") > -1) return "Firefox"
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "IE"
  if (userAgent.indexOf("Edge") > -1) return "Edge"
  return "Unknown"
}

// Function to get operating system
export function getOS(): string {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf("Win") > -1) return "Windows"
  if (userAgent.indexOf("Mac") > -1) return "MacOS"
  if (userAgent.indexOf("Linux") > -1) return "Linux"
  if (userAgent.indexOf("Android") > -1) return "Android"
  if (userAgent.indexOf("iOS") > -1) return "iOS"
  return "Unknown"
}

// Function to copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy text: ", error)
    return false
  }
}

// Function to download a file
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Function to scroll to element
export function scrollToElement(elementId: string, behavior: ScrollBehavior = "smooth"): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior, block: "start" })
  }
}

// Function to get contrast color (black or white) based on background
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  hexColor = hexColor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(hexColor.substr(0, 2), 16)
  const g = Number.parseInt(hexColor.substr(2, 2), 16)
  const b = Number.parseInt(hexColor.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
