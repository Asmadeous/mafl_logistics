import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getSupabaseClient } from "@/lib/supabase-client"

// Initialize Supabase client with client-side credentials
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getBlogPosts() {
  const supabase = getSupabaseClient()
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories(name, slug),
      blog_posts_tags(
        tag_id,
        blog_tags(name, slug)
      )
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return posts
}

async function getFeaturedPost() {
  const supabase = getSupabaseClient()
  const { data: featuredPosts, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories(name, slug),
      blog_posts_tags(
        tag_id,
        blog_tags(name, slug)
      )
    `)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("Error fetching featured post:", error)
    return null
  }

  // Return the first featured post or null if none exists
  return featuredPosts && featuredPosts.length > 0 ? featuredPosts[0] : null
}

export default async function BlogPage() {
  const [posts, featuredPost] = await Promise.all([getBlogPosts(), getFeaturedPost()])

  // Format the date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">MAFL Logistics Blog</h1>
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-20 bg-mafl-orange rounded-full"></div>
            </div>
            <p className="text-xl text-muted-foreground">
              Insights, news, and updates from the logistics industry and our company.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white dark:bg-mafl-dark/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Article</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={featuredPost.featured_image || "/placeholder.svg?height=400&width=600"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <h3 className="text-2xl font-bold mb-3 hover:text-mafl-orange transition-colors">
                    {featuredPost.title}
                  </h3>
                </Link>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{featuredPost.author_name}</span>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(featuredPost.published_at)}</span>
                </div>
                <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.blog_posts_tags.map((tag: any) => (
                    <Badge key={tag.tag_id} variant="outline" className="bg-muted/50">
                      {tag.blog_tags.name}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-mafl-orange hover:text-mafl-orange/80 font-medium flex items-center"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 bg-gray-50 dark:bg-mafl-dark/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Badge variant="outline" className="bg-muted/50 mr-2">
                      {post.blog_categories?.name || "Uncategorized"}
                    </Badge>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <CardTitle className="text-xl hover:text-mafl-orange transition-colors">{post.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                      <Image
                        src={post.author_image || "/placeholder.svg?height=50&width=50"}
                        alt={post.author_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs">{post.author_name}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs text-mafl-orange hover:text-mafl-orange/80 font-medium"
                  >
                    Read More
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found. Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
