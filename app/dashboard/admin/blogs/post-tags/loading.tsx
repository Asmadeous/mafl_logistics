import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PostTagsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1" />
            </div>

            <div className="rounded-md border">
              <div className="h-10 border-b px-6 py-3 flex items-center">
                <Skeleton className="h-4 w-32 mr-12" />
                <Skeleton className="h-4 w-24 mr-12" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>

              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b last:border-0 flex items-center">
                  <Skeleton className="h-4 w-64 mr-12" />
                  <Skeleton className="h-4 w-24 mr-12" />
                  <Skeleton className="h-8 w-20 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
