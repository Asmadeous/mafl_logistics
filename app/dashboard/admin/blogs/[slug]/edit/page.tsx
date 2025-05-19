"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"

export default function EditBlogPostPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const { slug } = params
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableTags, setAvailableTags] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [employees, setEmployees] = useState([])

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    employee_id: "",
    category_id: "",
    tags: [],
    status: "draft",
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch blog post
        const postResponse = await api.blogs.getBySlug(slug)
        if (postResponse.error) {
          throw new Error(postResponse.error)
        }

        // Fetch tags, categories, and employees in parallel
        const [tagsResponse, categoriesResponse, employeesResponse] = await Promise.all([
          api.blogs.getTags(),
          api.blogs.getCategories(),
          api.staff.getAll(),
        ])

        setAvailableTags(tagsResponse.data || [])
        setAvailableCategories(categoriesResponse.data || [])
        setEmployees(employeesResponse.data || [])

        // Set post data
        const postData = postResponse.data
        setPost({
          ...postData,
          tags: postData.tags?.map((tag) => tag.id) || [],
          category_id: postData.category?.id || "",
          employee_id: postData.employee?.id || "",
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load blog post")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPost({ ...post, [name]: value })
  }

  const handleTagChange = (tagId) => {
    if (post.tags.includes(tagId)) {
      setPost({ ...post, tags: post.tags.filter((id) => id !== tagId) })
    } else {
      setPost({ ...post, tags: [...post.tags, tagId] })
    }
  }

  const handleStatusChange = (status) => {
    setPost({ ...post, status })
  }

  const handleCategoryChange = (categoryId) => {
    setPost({ ...post, category_id: categoryId })
  }

  const handleEmployeeChange = (employeeId) => {
    setPost({ ...post, employee_id: employeeId })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.blogs.update(post.slug, {
        ...post,
        published_at: post.status === "published" ? new Date().toISOString() : post.published_at,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      toast({
        title: "Blog post updated",
        description: "Your changes have been saved successfully.",
      })

      router.push(`/dashboard/admin/blogs/${post.slug}`)
    } catch (err) {
      console.error("Error updating blog post:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to update blog post",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-72 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-20 w-full bg-muted animate-pulse rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-64 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Error</h1>
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Posts
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
        <Button asChild variant="outline">
          <Link href={`/dashboard/admin/blogs/${post.slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Post Details</CardTitle>
            <CardDescription>Update the content and metadata for this blog post.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={post.tags.includes(tag.id) ? "secondary" : "outline"}
                      onClick={() => handleTagChange(tag.id)}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} defaultValue={post.category_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee">Author</Label>
                <Select onValueChange={handleEmployeeChange} defaultValue={post.employee_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange} defaultValue={post.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
