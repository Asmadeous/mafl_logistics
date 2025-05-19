"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Trash2, MoreHorizontal, BookOpen, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock blog posts data
const blogPosts = [
  { id: 1, title: "The Future of Logistics in East Africa" },
  { id: 2, title: "Overcoming Cross-Border Logistics Challenges" },
  { id: 3, title: "Sustainable Logistics: Reducing Carbon Footprint" },
  { id: 4, title: "The Role of Technology in Modern Logistics" },
  { id: 5, title: "Road Construction Best Practices in Kenya" },
  { id: 6, title: "Warehousing Solutions for Growing Businesses" },
  { id: 7, title: "Logistics Innovations for 2025" },
]

// Mock tags data
const tags = [
  { id: 1, name: "Logistics" },
  { id: 2, name: "Transportation" },
  { id: 3, name: "Warehousing" },
  { id: 4, name: "Road Construction" },
  { id: 5, name: "Industry News" },
  { id: 6, name: "Supply Chain" },
  { id: 7, name: "Cross-Border" },
  { id: 8, name: "Technology" },
  { id: 9, name: "Sustainability" },
]

// Mock post-tags relationships
const initialPostTags = [
  { id: 1, postId: 1, tagId: 1, postTitle: "The Future of Logistics in East Africa", tagName: "Logistics" },
  { id: 2, postId: 1, tagId: 5, postTitle: "The Future of Logistics in East Africa", tagName: "Industry News" },
  { id: 3, postId: 1, tagId: 8, postTitle: "The Future of Logistics in East Africa", tagName: "Technology" },
  { id: 4, postId: 2, tagId: 1, postTitle: "Overcoming Cross-Border Logistics Challenges", tagName: "Logistics" },
  { id: 5, postId: 2, tagId: 7, postTitle: "Overcoming Cross-Border Logistics Challenges", tagName: "Cross-Border" },
  {
    id: 6,
    postId: 3,
    tagId: 9,
    postTitle: "Sustainable Logistics: Reducing Carbon Footprint",
    tagName: "Sustainability",
  },
  { id: 7, postId: 3, tagId: 1, postTitle: "Sustainable Logistics: Reducing Carbon Footprint", tagName: "Logistics" },
  { id: 8, postId: 4, tagId: 8, postTitle: "The Role of Technology in Modern Logistics", tagName: "Technology" },
  { id: 9, postId: 4, tagId: 1, postTitle: "The Role of Technology in Modern Logistics", tagName: "Logistics" },
  { id: 10, postId: 5, tagId: 4, postTitle: "Road Construction Best Practices in Kenya", tagName: "Road Construction" },
  { id: 11, postId: 6, tagId: 3, postTitle: "Warehousing Solutions for Growing Businesses", tagName: "Warehousing" },
  { id: 12, postId: 6, tagId: 6, postTitle: "Warehousing Solutions for Growing Businesses", tagName: "Supply Chain" },
  { id: 13, postId: 7, tagId: 1, postTitle: "Logistics Innovations for 2025", tagName: "Logistics" },
  { id: 14, postId: 7, tagId: 8, postTitle: "Logistics Innovations for 2025", tagName: "Technology" },
  { id: 15, postId: 7, tagId: 5, postTitle: "Logistics Innovations for 2025", tagName: "Industry News" },
]

export default function PostTagsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingPostTag, setIsAddingPostTag] = useState(false)
  const [postTags, setPostTags] = useState(initialPostTags)
  const [newPostTag, setNewPostTag] = useState({
    postId: "",
    tagId: "",
  })
  const { toast } = useToast()

  const filteredPostTags = postTags.filter(
    (postTag) =>
      postTag.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postTag.tagName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPostTag = (e) => {
    e.preventDefault()

    // Check if this post-tag relationship already exists
    const exists = postTags.some(
      (pt) => pt.postId === Number.parseInt(newPostTag.postId) && pt.tagId === Number.parseInt(newPostTag.tagId),
    )

    if (exists) {
      toast({
        title: "Relationship already exists",
        description: "This post already has this tag assigned.",
        variant: "destructive",
      })
      return
    }

    const id = postTags.length > 0 ? Math.max(...postTags.map((pt) => pt.id)) + 1 : 1
    const post = blogPosts.find((p) => p.id === Number.parseInt(newPostTag.postId))
    const tag = tags.find((t) => t.id === Number.parseInt(newPostTag.tagId))

    setPostTags([
      ...postTags,
      {
        id,
        postId: Number.parseInt(newPostTag.postId),
        tagId: Number.parseInt(newPostTag.tagId),
        postTitle: post.title,
        tagName: tag.name,
      },
    ])

    setNewPostTag({ postId: "", tagId: "" })
    setIsAddingPostTag(false)

    toast({
      title: "Relationship added successfully",
      description: "The post-tag relationship has been created.",
    })
  }

  const handleDeletePostTag = (id) => {
    setPostTags(postTags.filter((pt) => pt.id !== id))

    toast({
      title: "Relationship deleted",
      description: "The post-tag relationship has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Post-Tag Relationships</h1>
        <Dialog open={isAddingPostTag} onOpenChange={setIsAddingPostTag}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Relationship
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Post-Tag Relationship</DialogTitle>
              <DialogDescription>Assign a tag to a blog post.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPostTag} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="postId">Blog Post</Label>
                <Select
                  value={newPostTag.postId}
                  onValueChange={(value) => setNewPostTag({ ...newPostTag, postId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blog post" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogPosts.map((post) => (
                      <SelectItem key={post.id} value={post.id.toString()}>
                        {post.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagId">Tag</Label>
                <Select
                  value={newPostTag.tagId}
                  onValueChange={(value) => setNewPostTag({ ...newPostTag, tagId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingPostTag(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newPostTag.postId || !newPostTag.tagId}>
                  Save Relationship
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Post-Tag Relationships</CardTitle>
          <CardDescription>Assign tags to blog posts to improve organization and searchability.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by post title or tag name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blog Post</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPostTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No relationships found. Create your first post-tag relationship to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPostTags.map((postTag) => (
                      <TableRow key={postTag.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">{postTag.postTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-gray-500" />
                            {postTag.tagName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeletePostTag(postTag.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
