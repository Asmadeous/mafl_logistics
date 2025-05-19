"use client"

import { useState, useCallback } from "react"

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options?: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<{ data?: R; error?: string; status: number }>,
      customOptions?: UseApiOptions<R>,
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiCall()

        if (response.error) {
          setError(response.error)
          customOptions?.onError?.(response.error)
          options?.onError?.(response.error)
          return { success: false, data: null, error: response.error }
        }

        setData(response.data as unknown as T)
        customOptions?.onSuccess?.(response.data as R)
        options?.onSuccess?.(response.data as unknown as T)
        return { success: true, data: response.data, error: null }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        customOptions?.onError?.(errorMessage)
        options?.onError?.(errorMessage)
        return { success: false, data: null, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  return {
    data,
    isLoading,
    error,
    execute,
  }
}
