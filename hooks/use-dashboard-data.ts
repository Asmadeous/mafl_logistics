"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export interface DashboardStats {
  users_count: number
  users_growth: number
  active_shipments: number
  shipments_growth: number
  inventory_count: number
  inventory_growth: number
  revenue: number
  revenue_growth: number
}

export interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  date: string
  status?: string
  amount?: number
}

export interface PerformanceData {
  labels: string[]
  shipments: number[]
  revenue: number[]
}

export function useDashboardData(userType: "admin" | "client" | "user") {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch dashboard stats
        const statsResponse = await api.dashboard.getStats(userType)
        if (statsResponse.error) {
          throw new Error(statsResponse.error)
        }
        setStats(statsResponse.data)

        // Fetch recent activity
        const activityResponse = await api.dashboard.getRecentActivity(userType)
        if (activityResponse.error) {
          throw new Error(activityResponse.error)
        }
        setRecentActivity(activityResponse.data)

        // Fetch performance data (for charts)
        if (userType === "admin" || userType === "client") {
          const performanceResponse = await api.dashboard.getPerformanceData(userType)
          if (performanceResponse.error) {
            throw new Error(performanceResponse.error)
          }
          setPerformanceData(performanceResponse.data)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userType, toast])

  return {
    stats,
    recentActivity,
    performanceData,
    loading,
    error,
  }
}
