"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: string
  onChange: (value: string | null) => void
  onFileChange?: (file: File | null) => void
  className?: string
  variant?: "avatar" | "cover"
  placeholder?: string
}

export function FileUpload({
  value,
  onChange,
  onFileChange,
  className,
  variant = "avatar",
  placeholder,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Update the parent component with the file
    if (onFileChange) {
      onFileChange(file)
    }

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (onFileChange) {
      onFileChange(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div className="relative">
          <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
            <AvatarImage src={preview || undefined} alt="Avatar" />
            <AvatarFallback className="bg-muted">
              {placeholder ? placeholder.charAt(0).toUpperCase() : <Upload className="h-8 w-8 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
          {preview && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload avatar"
        />
        <Button variant="outline" size="sm" type="button" onClick={triggerFileInput}>
          {preview ? "Change Avatar" : "Upload Avatar"}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative rounded-md overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Uploaded image" className="w-full h-48 object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />
    </div>
  )
}
