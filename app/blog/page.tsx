import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock blog posts data
const mockPosts = [
  {
    id: "1",
    title: "The Future of Logistics in East Africa",
    slug: "future-of-logistics-east-africa",
    excerpt: "Exploring the emerging trends and technologies shaping the logistics industry across East Africa.",
    featured_image: "/placeholder.svg?height=200&width=400",
    author_name: "John Doe",
    author_image: "/placeholder.svg?height=50&width=50",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    blog_categories: { name: "Industry Insights", slug: "industry-insights" },
    blog_posts_tags: [
      { tag_id: "1", blog_tags: { name: "Logistics", slug: "logistics" } },
      { tag_id: "2", blog_tags: { name: "Technology", slug: "technology" } },
    ],
  },
  {
    id: "2",
    title: "Cross-Border Transportation: Challenges and Solutions",
    slug: "cross-border-transportation-challenges-solutions",
    excerpt: "Navigating the complexities of cross-border logistics in the East African region.",
    featured_image: "/placeholder.svg?height=200&width=400",
    author_name: "Jane Smith",
    author_image: "/placeholder.svg?height=50&width=50",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    blog_categories: { name: "Operations", slug: "operations" },
    blog_posts_tags: [
      { tag_id: "3", blog_tags: { name: "Cross-Border", slug: "cross-border" } },
      { tag_id: "4", blog_tags: { name: "Regulations", slug: "regulations" } },
    ],
  },
  {
    id: "3",
    title: "Sustainable Logistics Practices for a Greener Future",
    slug: "sustainable-logistics-practices",
    excerpt: "How logistics companies can reduce their environmental impact while maintaining efficiency.",
    featured_image: "/placeholder.svg?height=200&width=400",
    author_name: "David Mwangi",
    author_image: "/placeholder.svg?height=50&width=50",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    blog_categories: { name: "Sustainability", slug: "sustainability" },
    blog_posts_tags: [
      { tag_id: "5", blog_tags: { name: "Environment", slug: "environment" } },
      { tag_id: "6", blog_tags: { name: "Green Logistics", slug: "green-logistics" } },
    ],
  },
]

// Mock featured post
const mockFeaturedPost = {
  id: "4",
  title: "Revolutionizing Heavy Machinery Transport in Kenya",
  slug: "revolutionizing-heavy-machinery-transport",
  excerpt:
    "How MAFL Logistics is setting new standards in the transportation of heavy machinery across Kenya and beyond.",
  featured_image: "/placeholder.svg?height=400&width=600",
  author_name: "Mahdi M. Issack",
  author_image: "/placeholder.svg?height=50&width=50",
  published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  blog_categories: { name: "Company News", slug: "company-news" },
  blog_posts_tags: [
    { tag_id: "7", blog_tags: { name: "Heavy Machinery", slug: "heavy-machinery" } },
    { tag_id: "8", blog_tags: { name: "Innovation", slug: "innovation" } },
  ],
  is_featured: true,
}

async function getBlogPosts() {
  // Return mock posts instead of querying Supabase
  return mockPosts
}

async function getFeaturedPost() {
  // Return mock featured post instead of querying Supabase
  return mockFeaturedPost
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
