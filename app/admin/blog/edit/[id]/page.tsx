"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { getSupabaseClient } from "@/lib/supabase-client"

// Dynamically import TipTap editor to avoid SSR issues
const TipTapEditor = dynamic(() => import("@/components/tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 min-h-[200px] bg-muted/20">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  ),
})

type Category = {
  id: string
  name: string
}

type Tag = {
  id: string
  name: string
}

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author_name: string
  author_image: string
  category_id: string
  status: string
  published_at: string | null
  is_featured: boolean
  meta_title: string
  meta_description: string
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifySubscribers, setNotifySubscribers] = useState(false)
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load the post
        const supabase = getSupabaseClient()
        const { data: postData, error: postError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", params.id)
          .single()

        if (postError) throw postError
        setPost(postData)
        setEditorContent(postData.content || "")

        // Load categories
        const supabase = getSupabaseClient()
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("id, name")
          .order("name")

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // Load tags
        const supabase = getSupabaseClient()
        const { data: tagsData, error: tagsError } = await supabase.from("blog_tags").select("id, name").order("name")

        if (tagsError) throw tagsError
        setTags(tagsData || [])

        // Load selected tags for this post
        const supabase = getSupabaseClient()
        const { data: selectedTagsData, error: selectedTagsError } = await supabase
          .from("blog_posts_tags")
          .select("tag_id")
          .eq("post_id", params.id)

        if (selectedTagsError) throw selectedTagsError
        setSelectedTags((selectedTagsData || []).map((item) => item.tag_id))
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPost((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setPost((prev) => (prev ? { ...prev, [name]: checked } : null))
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags((prev) => [...prev, tagId])
    } else {
      setSelectedTags((prev) => prev.filter((id) => id !== tagId))
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPost((prev) => {
      if (!prev) return null

      // Only auto-generate slug if it hasn't been manually edited
      const newSlug = prev.slug === generateSlug(prev.title) ? generateSlug(value) : prev.slug

      return {
        ...prev,
        title: value,
        slug: newSlug,
      }
    })
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPost((prev) => (prev ? { ...prev, slug: generateSlug(value) } : null))
  }

  const handleNotifySubscribersChange = (checked: boolean) => {
    setNotifySubscribers(checked)
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    if (!post) return

    setSaving(true)
    try {
      // Prepare post data with the editor content
      const postData = {
        ...post,
        content: editorContent,
        status: publish ? "published" : post.status,
        published_at: publish && !post.published_at ? new Date().toISOString() : post.published_at,
      }

      // Update the post
      const supabase = getSupabaseClient()
      const { error: updateError } = await supabase.from("blog_posts").update(postData).eq("id", post.id)

      if (updateError) throw updateError

      // Handle tags (delete existing and insert new)
      const supabaseClient = getSupabaseClient()
      const { error: deleteTagsError } = await supabaseClient.from("blog_posts_tags").delete().eq("post_id", post.id)

      if (deleteTagsError) throw deleteTagsError

      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map((tagId) => ({
          post_id: post.id,
          tag_id: tagId,
        }))

        const supabaseClient = getSupabaseClient()
        const { error: insertTagsError } = await supabaseClient.from("blog_posts_tags").insert(tagInserts)

        if (insertTagsError) throw insertTagsError
      }

      toast({
        title: "Success",
        description: publish ? "Blog post published successfully!" : "Blog post saved successfully!",
      })

      // If publishing and notification is enabled, send email notifications to subscribers
      if (publish && notifySubscribers) {
        try {
          // Add to notification queue
          const supabaseClient = getSupabaseClient()
          await supabaseClient.from("blog_notification_queue").insert([
            {
              post_id: post.id,
              processed: false,
            },
          ])

          toast({
            title: "Notification Queued",
            description: "Subscribers will be notified about this post.",
          })
        } catch (notifyError) {
          console.error("Error queuing notification:", notifyError)
          // Don't fail the whole operation if notification fails
        }
      }

      // Redirect back to admin blog page
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Loading blog post data...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Blog post not found.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/blog" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={(e) => handleSubmit(e)} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={(e) => handleSubmit(e, true)} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {post.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={post.title} onChange={handleTitleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={post.slug} onChange={handleSlugChange} required />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" name="excerpt" value={post.excerpt || ""} onChange={handleChange} rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <div className="mt-1">
                      <TipTapEditor
                        value={editorContent}
                        onChange={handleEditorChange}
                        placeholder="Write your blog post content here..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={post.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={post.category_id || ""}
                    onValueChange={(value) => handleSelectChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="mt-2 space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    name="featured_image"
                    value={post.featured_image || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={post.is_featured}
                    onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Feature this post
                  </Label>
                </div>
                {post.status !== "published" && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-subscribers"
                        checked={notifySubscribers}
                        onCheckedChange={handleNotifySubscribersChange}
                      />
                      <Label htmlFor="notify-subscribers" className="cursor-pointer">
                        Notify subscribers when publishing
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      An email will be sent to all active subscribers when you publish this post.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    name="author_name"
                    value={post.author_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author_image">Author Image URL</Label>
                  <Input
                    id="author_image"
                    name="author_image"
                    value={post.author_image || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/author.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={post.meta_title || ""}
                    onChange={handleChange}
                    placeholder="SEO Title (defaults to post title)"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={post.meta_description || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="SEO Description (defaults to excerpt)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
