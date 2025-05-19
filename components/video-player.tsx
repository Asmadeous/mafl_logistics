"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Loader } from "lucide-react"
import Image from "next/image"

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl: string
  title: string
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "medium" | "fast">("medium")
  const videoRef = useRef<HTMLVideoElement>(null)

  // Detect connection speed
  useEffect(() => {
    const checkConnectionSpeed = async () => {
      try {
        const startTime = Date.now()
        const response = await fetch("/api/ping", { method: "GET" })
        const endTime = Date.now()
        const duration = endTime - startTime

        if (duration > 1000) {
          setConnectionSpeed("slow")
        } else if (duration > 500) {
          setConnectionSpeed("medium")
        } else {
          setConnectionSpeed("fast")
        }
      } catch (error) {
        console.error("Error checking connection speed:", error)
        setConnectionSpeed("medium") // Default to medium if check fails
      }
    }

    checkConnectionSpeed()
  }, [])

  // Handle video quality based on connection speed
  const getVideoQuality = () => {
    switch (connectionSpeed) {
      case "slow":
        return "low"
      case "medium":
        return "medium"
      case "fast":
        return "high"
      default:
        return "medium"
    }
  }

  // Modify video URL to include quality parameter (this would depend on your actual implementation)
  const getOptimizedVideoUrl = () => {
    const quality = getVideoQuality()
    // This is a placeholder - you would need to implement this based on your video hosting solution
    return `${videoUrl}?quality=${quality}`
  }

  const handlePlayClick = () => {
    if (!isLoaded) {
      setIsLoading(true)
      // Load the video
      if (videoRef.current) {
        videoRef.current.src = getOptimizedVideoUrl()
        videoRef.current.load()

        videoRef.current.onloadeddata = () => {
          setIsLoaded(true)
          setIsLoading(false)
          videoRef.current?.play()
          setIsPlaying(true)
        }

        videoRef.current.onerror = () => {
          setIsLoading(false)
          console.error("Error loading video")
        }
      }
    } else {
      if (isPlaying) {
        videoRef.current?.pause()
      } else {
        videoRef.current?.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      {/* Thumbnail or video */}
      <div className="aspect-video relative">
        {!isLoaded && <Image src={thumbnailUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${!isLoaded ? "hidden" : ""}`}
          muted={isMuted}
          playsInline
          preload="none"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="animate-spin">
              <Loader className="h-10 w-10 text-white" />
            </div>
          </div>
        )}

        {/* Play/pause button overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={handlePlayClick}
        >
          {!isPlaying && (
            <div className="bg-black/30 p-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
              <Play className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Video controls */}
        {isLoaded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <button onClick={handlePlayClick} className="mr-3 text-white">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={toggleMute} className="text-white">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <div className="ml-auto text-xs text-white">
              {connectionSpeed === "slow"
                ? "Low quality"
                : connectionSpeed === "medium"
                  ? "Medium quality"
                  : "High quality"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
