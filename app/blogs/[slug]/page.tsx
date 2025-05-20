"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlogs } from "@/hooks/use-blogs";
import { SharedLoading } from "@/components/shared-loading";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  published_at: string;
  featured_image?: string;
  category_id?: string;
  category?: { id: string; name: string };
  tags?: { id: string; name: string }[];
  employee?: { full_name: string };
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchBlogBySlug, fetchBlogs } = useBlogs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!slug || typeof slug !== "string") {
          setError("Invalid slug provided");
          console.error("Invalid slug provided:", slug);
          return;
        }

        const postData = await fetchBlogBySlug(slug);
        if (!postData) {
          setError("Blog post not found");
          console.error("Error fetching blog post: No data returned for slug:", slug);
          return;
        }

        const formattedPost: BlogPost = {
          ...postData,
          id: String(postData.id),
          category_id: postData.category?.id,
          category: postData.category
            ? { id: String(postData.category.id), name: postData.category.name }
            : undefined,
          tags: Array.isArray(postData.tags)
            ? postData.tags.map((tag: any) => ({
                id: String(tag.id),
                name: tag.name,
              }))
            : [],
          employee: postData.author_name ? { full_name: postData.author_name } : undefined,
        };

        setPost(formattedPost);

        // Fetch related posts based on category
        if (postData.category?.id) {
          const response = await fetchBlogs(1, 10, postData.category.id);
          const related = (response ?? [])
            .filter((blog: any) => String(blog.id) !== String(postData.id))
            .slice(0, 3)
            .map((blog: any) => ({
              ...blog,
              id: String(blog.id),
              category_id: blog.category?.id,
              category: blog.category
                ? { id: String(blog.category.id), name: blog.category.name }
                : undefined,
              tags: Array.isArray(blog.tags)
                ? blog.tags.map((tag: any) => ({
                    id: String(tag.id),
                    name: tag.name,
                  }))
                : [],
              employee: blog.author_name ? { full_name: blog.author_name } : undefined,
            }));
          setRelatedPosts(Array.isArray(related) ? related : []);
        }
      } catch (error: any) {
        const errorMessage = error.message || "Failed to load blog post";
        setError(errorMessage);
        console.error("Error loading blog post:", { error, message: errorMessage, stack: error.stack });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, fetchBlogBySlug, fetchBlogs]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blogs/${slug}`;
    const shareData = {
      title: post?.title || "MAFL Logistics Blog Post",
      text: post?.title || "Check out this blog post from MAFL Logistics!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share. Link copied to clipboard!");
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  if (isLoading) {
    return <SharedLoading />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{error ? "Error Loading Blog Post" : "Blog Post Not Found"}</h1>
        <p className="mb-8">{error || "The blog post you're looking for doesn't exist or has been removed."}</p>
        <Button onClick={() => router.push("/blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Button>
      </div>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const wordCount = post.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/blogs")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Button>

        <div className="flex flex-wrap gap-2 mb-4">
          {

post.category && (
            <Badge variant="outline" className="bg-primary/10">
              {post.category.name}
            </Badge>
          )}
          {Array.isArray(post.tags) &&
            post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.employee?.full_name || "MAFL Team"}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {publishedDate}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {readTime} min read
          </div>
        </div>
      </div>

      {post.featured_image && (
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featured_image || "/placeholder.svg?height=400&width=800"}
            alt={post.title || "Blog post image"}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Share this post:</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleShare}
                  aria-label="Share this blog post"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={() => router.push("/blogs")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
              {relatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link href={`/blogs/${relatedPost.slug}`} key={relatedPost.id}>
                      <div className="group">
                        <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                          <Image
                            src={relatedPost.featured_image || "/placeholder.svg?height=200&width=300"}
                            alt={relatedPost.title || "Related blog post image"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(relatedPost.published_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No related posts found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}