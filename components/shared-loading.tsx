"use client"

import type React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export { Skeleton }

export function TableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1" />
            </div>
            <div className="rounded-md border">
              <div className="h-10 border-b px-4 flex items-center">
                <Skeleton className="h-4 w-1/6 mr-4" />
                <Skeleton className="h-4 w-1/6 mr-4" />
                <Skeleton className="h-4 w-1/6 mr-4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 border-b px-4 flex items-center">
                  <Skeleton className="h-4 w-1/6 mr-4" />
                  <Skeleton className="h-4 w-1/6 mr-4" />
                  <Skeleton className="h-4 w-1/6 mr-4" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader } from "@/components/ui/card"

const SharedLoading = () => {
  return <TableSkeleton />
}

export { SharedLoading }
