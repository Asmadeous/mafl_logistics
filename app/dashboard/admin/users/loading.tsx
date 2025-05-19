import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Skeleton className="h-10 w-[300px] mb-4" />

        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-4 w-[180px] mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <Skeleton className="h-5 w-[150px]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
