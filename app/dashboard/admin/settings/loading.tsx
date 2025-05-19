import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px] mt-2" />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-8">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px] mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="grid gap-4 flex-1">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="grid gap-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                </div>
              </div>

              <Skeleton className="h-[1px] w-full" />

              <div className="grid gap-4">
                {Array(2)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="grid gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[120px]" />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
