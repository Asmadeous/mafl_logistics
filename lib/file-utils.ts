/**
 * Utility functions for handling file uploads
 */

/**
 * Creates a preview URL for an image file
 * @param file The file to create a preview for
 * @returns A promise that resolves to the preview URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to create image preview"))
      }
    }
    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Validates an image file
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns An error message if validation fails, null otherwise
 */
export function validateImageFile(file: File, maxSizeMB = 5): string | null {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return "File must be an image"
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `Image must be smaller than ${maxSizeMB}MB`
  }

  return null
}

/**
 * Adds a file to FormData with proper handling
 * @param formData The FormData object
 * @param name The name of the file field
 * @param file The file to add
 * @param prefix Optional prefix for the field name (e.g., 'user[avatar]')
 */
export function addFileToFormData(formData: FormData, name: string, file: File | null, prefix?: string): void {
  if (!file) return

  const fieldName = prefix ? `${prefix}[${name}]` : name
  formData.append(fieldName, file)
}
