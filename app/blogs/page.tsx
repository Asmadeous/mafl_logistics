"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBlogs } from "@/hooks/use-blogs";
import { PageBanner } from "@/components/page-banner";
import { SharedLoading } from "@/components/shared-loading";
import { CalendarIcon, User } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BlogsPage() {
  const { blogs, categories, tags, pagination, isLoading, error, fetchBlogs, fetchCategories, fetchTags } = useBlogs();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    console.log("BlogsPage state:", { blogs, categories, tags, pagination, error });
  }, [blogs, categories, tags, pagination, error]);

  const toggleTag = (tagId: string) => {
    setActiveTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const filteredPosts = useMemo(() => {
    const filtered = blogs.filter((post) => {
      const matchesCategory =
        activeCategory === "all" ||
        (post.category && post.category.id === activeCategory);
      const matchesTags =
        activeTags.length === 0 ||
        (post.tags && post.tags.some((tag) => activeTags.includes(tag.id)));
      return matchesCategory && matchesTags;
    });
    console.log("Filtered posts:", filtered, { activeCategory, activeTags });
    return filtered;
  }, [blogs, activeCategory, activeTags]);

  if (isLoading) return <SharedLoading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-10 text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Error loading blog data</h3>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const safeFilteredPosts = Array.isArray(filteredPosts) ? filteredPosts : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <>
      <Navbar />
      <PageBanner
        title="Our Blog"
        subtitle="Latest news, insights, and updates from MAFL Logistics"
        backgroundImage="/blogs-banner.jpg"
        imageAlt="MAFL Logistics Blog Banner"
      />

      <div className="container mx-auto px-4 mt-10">
        {/* Hero Section */}
        {safeFilteredPosts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 relative h-96 rounded-lg overflow-hidden shadow-md">
              <Image
                src={safeFilteredPosts[0].featured_image || "/placeholder.svg"}
                alt={safeFilteredPosts[0].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-white">
                <Badge variant="outline" className="bg-white text-black w-fit mb-2">
                  {safeFilteredPosts[0].category?.name || "Uncategorized"}
                </Badge>
                <h2 className="text-2xl font-bold line-clamp-2">
                  <Link href={`/blogs/${safeFilteredPosts[0].slug}`}>
                    {safeFilteredPosts[0].title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-sm">{safeFilteredPosts[0].excerpt}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {safeFilteredPosts.slice(1, 5).map((post) => (
                  <div key={post.id} className="flex gap-3 border-b pb-3">
                    <div className="relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <Link href={`/blogs/${post.slug}`} className="font-semibold line-clamp-2">
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            {safeFilteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try changing your filters or check back later for new content.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveTags([]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeFilteredPosts.slice(safeFilteredPosts.length > 5 ? 5 : 0).map((post) => (
                  <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.featured_image || "/placeholder.svg?height=400&width=600"}
                        alt={post.title || "Blog post image"}
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
                        {post.author_name || "MAFL Team"}
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
      </div>

      <Footer />
    </>
  );
}