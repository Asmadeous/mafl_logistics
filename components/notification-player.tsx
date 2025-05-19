"use client"

import { useEffect, useRef } from "react"

export type NotificationType = "blog" | "message" | "appointment" | "career" | "general"

interface NotificationPlayerProps {
  type: NotificationType
  play?: boolean
  onEnded?: () => void
  isAuthenticated?: boolean
}

const soundMap: Record<NotificationType, string> = {
  blog: "/sounds/blog-notification.mp3",
  message: "/sounds/message.mp3",
  appointment: "/sounds/appointment-notification.mp3",
  career: "/sounds/career-notification.mp3",
  general: "/sounds/notification.mp3",
}

export function NotificationPlayer({ type, play = true, onEnded, isAuthenticated }: NotificationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    // Create audio element
    if (!audioRef.current) {
      const soundPath = soundMap[type] || soundMap.general
      audioRef.current = new Audio(soundPath)

      // Set up event listeners
      if (onEnded) {
        audioRef.current.addEventListener("ended", onEnded)
      }

      // Preload the audio
      audioRef.current.preload = "auto"
      audioRef.current.load()

      // Cleanup function
      return () => {
        if (audioRef.current) {
          // Remove event listeners before destroying
          if (onEnded) {
            audioRef.current.removeEventListener("ended", onEnded)
          }

          // Pause audio before destroying
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [type, onEnded, isAuthenticated])

  // Play sound when requested
  useEffect(() => {
    if (play && audioRef.current) {
      // Use promise handling for play()
      const playPromise = audioRef.current.play()

      // Handle potential promise rejection
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio playback was prevented:", error)
          // Don't throw error, just log it
        })
      }
    }
  }, [play])

  // This component doesn't render anything visible
  return null
}

export default NotificationPlayer
