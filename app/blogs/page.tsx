"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useBlogs } from "@/hooks/use-blogs"
import { PageBanner } from "@/components/page-banner"
import { SharedLoading } from "@/components/shared-loading"
import { CalendarIcon, User } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  published_at: string
  category?: { id: string; name: string }
  tags?: { id: string; name: string }[]
  author?: { name: string }
}

type Category = { id: string; name: string }
type Tag = { id: string; name: string }

export default function BlogsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [activeTags, setActiveTags] = useState<string[]>([])
  const { fetchBlogs, fetchCategories, fetchTags } = useBlogs()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Fetch all data in parallel
        const [postsData, categoriesData, tagsData] = await Promise.all([fetchBlogs(), fetchCategories(), fetchTags()])

        console.log("Posts data:", postsData)
        console.log("Categories data:", categoriesData)
        console.log("Tags data:", tagsData)

        // Set posts with fallback to empty array, mapping id fields to string
        setPosts(
          Array.isArray(postsData)
            ? postsData.map((post: any) => ({
                ...post,
                id: String(post.id),
                category: post.category
                  ? { ...post.category, id: String(post.category.id) }
                  : undefined,
                tags: Array.isArray(post.tags)
                  ? post.tags.map((tag: any) => ({
                      ...tag,
                      id: String(tag.id),
                    }))
                  : [],
              }))
            : []
        )

        // Set categories with fallback to empty array, mapping id fields to string
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData.map((cat: any) => ({
                ...cat,
                id: String(cat.id),
              }))
            : []
        )

        // Set tags with fallback to empty array, mapping id fields to string
        setTags(
          Array.isArray(tagsData)
            ? tagsData.map((tag: any) => ({
                ...tag,
                id: String(tag.id),
              }))
            : []
        )
      } catch (error) {
        console.error("Error loading blog data:", error)
        // Set fallbacks in case of error
        setPosts([])
        setCategories([])
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fetchBlogs, fetchCategories, fetchTags])

  const toggleTag = (tagId:any) => {
    if (activeTags.includes(tagId)) {
      setActiveTags(activeTags.filter((id) => id !== tagId))
    } else {
      setActiveTags([...activeTags, tagId])
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category?.id === activeCategory
    const matchesTags = activeTags.length === 0 || post.tags?.some((tag) => activeTags.includes(tag.id))
    return matchesCategory && matchesTags
  })

  if (isLoading) {
    return <SharedLoading />
  }

  // Create safe versions of arrays for rendering
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeTags = Array.isArray(tags) ? tags : []
  const safeFilteredPosts = Array.isArray(filteredPosts) ? filteredPosts : []

  return (
    <div className="container mx-auto px-4 py-8">
       <Navbar />
      <PageBanner
        title="Our Blog"
        subtitle="Latest news, insights, and updates from MAFL Logistics"
        backgroundImage="/blog-banner.jpg"
        imageAlt="MAFL Logistics Blog Banner"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant={activeCategory === "all" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("all")}
                >
                  All Categories
                </Button>

                {safeCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {safeTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={activeTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {safeFilteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try changing your filters or check back later for new content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safeFilteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featured_image || "/placeholder.svg?height=400&width=600"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {post.category?.name || "Uncategorized"}
                      </Badge>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/blogs/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4 mr-1" />
                      {post.author?.name || "MAFL Team"}
                    </div>
                    <Link href={`/blogs/${post.slug}`}>
                      <Button variant="link" className="p-0 h-auto font-medium">
                        Read More
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
       <Footer />
    </div>
  )
}
