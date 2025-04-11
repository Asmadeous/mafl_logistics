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
import { getSupabaseClient } from "@/lib/supabase-client"
import dynamic from "next/dynamic"

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

export default function NewBlogPostPage() {
  const router = useRouter()
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author_name: "",
    author_image: "",
    category_id: "",
    status: "draft",
    is_featured: false,
    meta_title: "",
    meta_description: "",
  })
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
        const supabase = getSupabaseClient()

        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("id, name")
          .order("name")

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // Load tags
        const { data: tagsData, error: tagsError } = await supabase.from("blog_tags").select("id, name").order("name")

        if (tagsError) throw tagsError
        setTags(tagsData || [])
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setPost((prev) => ({ ...prev, [name]: checked }))
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
    setPost((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPost((prev) => ({ ...prev, slug: generateSlug(value) }))
  }

  const handleNotifySubscribersChange = (checked: boolean) => {
    setNotifySubscribers(checked)
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    if (!post.title || !post.slug) {
      toast({
        title: "Error",
        description: "Title and slug are required.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const supabase = getSupabaseClient()

      // Prepare post data with the editor content
      const postData = {
        ...post,
        content: editorContent,
        status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      }

      // Insert the post
      const { data: newPost, error: insertError } = await supabase.from("blog_posts").insert(postData).select().single()

      if (insertError) throw insertError

      // If publishing and notification is enabled, send email notifications to subscribers
      if (publish && notifySubscribers && newPost) {
        try {
          // Add to notification queue
          await supabase.from("blog_notification_queue").insert([
            {
              post_id: newPost.id,
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

      // Handle tags
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map((tagId) => ({
          post_id: newPost.id,
          tag_id: tagId,
        }))

        const { error: insertTagsError } = await supabase.from("blog_posts_tags").insert(tagInserts)

        if (insertTagsError) throw insertTagsError
      }

      toast({
        title: "Success",
        description: publish ? "Blog post published successfully!" : "Blog post saved as draft!",
      })

      // Redirect back to admin blog page
      router.push("/admin/blog")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/blog" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Blog Post</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={(e) => handleSubmit(e)} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={(e) => handleSubmit(e, true)} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Publish
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
                    <Textarea id="excerpt" name="excerpt" value={post.excerpt} onChange={handleChange} rows={3} />
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
                  <Label htmlFor="category_id">Category</Label>
                  <Select value={post.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
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
                    value={post.featured_image}
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
              </div>
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
                    value={post.author_image}
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
                    value={post.meta_title}
                    onChange={handleChange}
                    placeholder="SEO Title (defaults to post title)"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={post.meta_description}
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
