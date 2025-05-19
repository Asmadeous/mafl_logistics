"use client"

import { useEffect, useRef, useState } from "react"

interface NotificationSoundProps {
  src?: string
  onEnded?: () => void
}

export function NotificationSound({ src = "/sounds/notification.mp3", onEnded }: NotificationSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio(src)

      // Set up event listeners
      const handleCanPlayThrough = () => {
        setIsLoaded(true)
      }

      audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough)

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

          audioRef.current.removeEventListener("canplaythrough", handleCanPlayThrough)

          // Pause audio before destroying
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [src, onEnded])

  // Play sound when loaded
  useEffect(() => {
    if (isLoaded && audioRef.current) {
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
  }, [isLoaded])

  // This component doesn't render anything visible
  return null
}

export default NotificationSound
