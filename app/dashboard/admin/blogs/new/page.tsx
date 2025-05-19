"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { BlogCategory, BlogTag, Employee } from "@/types"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import api from "@/lib/api"

export default function NewBlogPost() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    employee_id: "",
    category_id: "",
    status: "draft",
    is_featured: false,
    published_at: null as string | null,
  })

  // Fetch categories, tags, and employees
  useEffect(() => {
    // In a real app, these would be API calls
    // Mock data for now
    setCategories([
      {
        id: "1",
        name: "Logistics",
        slug: "logistics",
        description: "Logistics related posts",
        created_at: "",
        updated_at: "",
      },
      {
        id: "2",
        name: "Transportation",
        slug: "transportation",
        description: "Transportation related posts",
        created_at: "",
        updated_at: "",
      },
      {
        id: "3",
        name: "Warehousing",
        slug: "warehousing",
        description: "Warehousing related posts",
        created_at: "",
        updated_at: "",
      },
      {
        id: "4",
        name: "Road Construction",
        slug: "road-construction",
        description: "Road construction related posts",
        created_at: "",
        updated_at: "",
      },
      {
        id: "5",
        name: "Industry News",
        slug: "industry-news",
        description: "Industry news and updates",
        created_at: "",
        updated_at: "",
      },
    ])

    setTags([
      { id: "1", name: "Logistics", slug: "logistics", created_at: "", updated_at: "" },
      { id: "2", name: "Transportation", slug: "transportation", created_at: "", updated_at: "" },
      { id: "3", name: "Warehousing", slug: "warehousing", created_at: "", updated_at: "" },
      { id: "4", name: "Road Construction", slug: "road-construction", created_at: "", updated_at: "" },
      { id: "5", name: "Industry News", slug: "industry-news", created_at: "", updated_at: "" },
      { id: "6", name: "Supply Chain", slug: "supply-chain", created_at: "", updated_at: "" },
      { id: "7", name: "Cross-Border", slug: "cross-border", created_at: "", updated_at: "" },
      { id: "8", name: "Technology", slug: "technology", created_at: "", updated_at: "" },
      { id: "9", name: "Sustainability", slug: "sustainability", created_at: "", updated_at: "" },
    ])

    setEmployees([
      { id: "1", full_name: "Mahdi M. Issack", email: "mahdi@mafl.com", role: "admin", created_at: "", updated_at: "" },
      { id: "2", full_name: "Sarah Kimani", email: "sarah@mafl.com", role: "staff", created_at: "", updated_at: "" },
      { id: "3", full_name: "David Ochieng", email: "david@mafl.com", role: "manager", created_at: "", updated_at: "" },
      { id: "4", full_name: "James Mwangi", email: "james@mafl.com", role: "staff", created_at: "", updated_at: "" },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "title" && !formData.slug) {
      // Auto-generate slug from title
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData({
        ...formData,
        title: value,
        slug,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const handleFeaturedChange = (checked: boolean) => {
    setIsFeatured(checked)
    setFormData({
      ...formData,
      is_featured: checked,
    })
  }

  const handlePublishDateChange = (date: Date | undefined) => {
    setPublishDate(date)
    setFormData({
      ...formData,
      published_at: date ? date.toISOString() : null,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare data for submission according to the schema
    const postData = {
      blog_post: {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        employee_id: formData.employee_id,
        category_id: formData.category_id,
        status: formData.status,
        is_featured: formData.is_featured,
        published_at: formData.published_at,
        tag_ids: selectedTags,
      },
    }

    // Submit to API
    api.blogs
      .create(postData)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error)
        }

        toast({
          title: "Blog post created",
          description: "Your blog post has been created successfully.",
        })

        // Redirect or reset form
      })
      .catch((error) => {
        toast({
          title: "Error creating blog post",
          description: error.message || "An error occurred while creating the blog post.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/admin/blogs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create New Blog Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSelectChange("status", "draft")}>
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              handleSelectChange("status", "published")
              handleSubmit(new Event("submit") as unknown as React.FormEvent)
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
              <CardDescription>Enter the details of your new blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="enter-blog-post-slug"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The slug is used in the URL of your blog post. It should be unique and contain only lowercase letters,
                  numbers, and hyphens.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Author</Label>
                  <Select
                    value={formData.employee_id}
                    onValueChange={(value) => handleSelectChange("employee_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Enter a brief summary of the blog post"
                  className="resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  className="min-h-[300px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured-image">Featured Image</Label>
                <div className="flex items-center gap-4">
                  <Input id="featured-image" type="file" accept="image/*" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {publishDate ? format(publishDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={publishDate}
                        onSelect={handlePublishDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => handleFeaturedChange(checked as boolean)}
                />
                <label
                  htmlFor="is-featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Feature this post
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard/admin/blogs">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
