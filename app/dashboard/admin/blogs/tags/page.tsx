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
import { Plus, Search, Pencil, Trash2, MoreHorizontal, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock tags data
const initialTags = [
  {
    id: 1,
    name: "Logistics",
    slug: "logistics",
    postCount: 15,
  },
  {
    id: 2,
    name: "Transportation",
    slug: "transportation",
    postCount: 10,
  },
  {
    id: 3,
    name: "Warehousing",
    slug: "warehousing",
    postCount: 8,
  },
  {
    id: 4,
    name: "Road Construction",
    slug: "road-construction",
    postCount: 6,
  },
  {
    id: 5,
    name: "Industry News",
    slug: "industry-news",
    postCount: 12,
  },
  {
    id: 6,
    name: "Supply Chain",
    slug: "supply-chain",
    postCount: 9,
  },
  {
    id: 7,
    name: "Cross-Border",
    slug: "cross-border",
    postCount: 7,
  },
  {
    id: 8,
    name: "Technology",
    slug: "technology",
    postCount: 11,
  },
  {
    id: 9,
    name: "Sustainability",
    slug: "sustainability",
    postCount: 5,
  },
]

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isEditingTag, setIsEditingTag] = useState(false)
  const [currentTag, setCurrentTag] = useState(null)
  const [tags, setTags] = useState(initialTags)
  const [newTag, setNewTag] = useState({
    name: "",
    slug: "",
  })
  const { toast } = useToast()

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTag = (e) => {
    e.preventDefault()
    const id = tags.length > 0 ? Math.max(...tags.map((t) => t.id)) + 1 : 1

    setTags([...tags, { ...newTag, id, postCount: 0 }])
    setNewTag({ name: "", slug: "" })
    setIsAddingTag(false)

    toast({
      title: "Tag added successfully",
      description: "The new tag has been created.",
    })
  }

  const handleEditTag = (e) => {
    e.preventDefault()

    setTags(tags.map((tag) => (tag.id === currentTag.id ? currentTag : tag)))
    setIsEditingTag(false)

    toast({
      title: "Tag updated successfully",
      description: "The tag has been updated.",
    })
  }

  const handleDeleteTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id))

    toast({
      title: "Tag deleted",
      description: "The tag has been deleted successfully.",
    })
  }

  const handleInputChange = (e, isNew = true) => {
    const { name, value } = e.target

    if (isNew) {
      setNewTag({ ...newTag, [name]: value })

      // Auto-generate slug from name if slug field is empty
      if (name === "name" && !newTag.slug) {
        setNewTag({
          ...newTag,
          name: value,
          slug: value.toLowerCase().replace(/\s+/g, "-"),
        })
      }
    } else {
      setCurrentTag({ ...currentTag, [name]: value })

      // Auto-generate slug from name if editing name
      if (name === "name") {
        setCurrentTag({
          ...currentTag,
          name: value,
          slug: value.toLowerCase().replace(/\s+/g, "-"),
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blog Tags</h1>
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>Create a new tag for blog posts.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTag} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newTag.name}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="e.g. Logistics Tips"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={newTag.slug}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="logistics-tips"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only
                  letters, numbers, and hyphens.
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingTag(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Tag</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Tag Dialog */}
        <Dialog open={isEditingTag} onOpenChange={setIsEditingTag}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>Update the tag details.</DialogDescription>
            </DialogHeader>
            {currentTag && (
              <form onSubmit={handleEditTag} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tag Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={currentTag.name}
                    onChange={(e) => handleInputChange(e, false)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    value={currentTag.slug}
                    onChange={(e) => handleInputChange(e, false)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">The "slug" is the URL-friendly version of the name.</p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditingTag(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Tag</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Tags</CardTitle>
          <CardDescription>Create, edit, and delete tags for organizing your blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search tags..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No tags found. Create your first tag to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-gray-500" />
                            {tag.name}
                          </div>
                        </TableCell>
                        <TableCell>{tag.slug}</TableCell>
                        <TableCell>{tag.postCount}</TableCell>
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
                                onClick={() => {
                                  setCurrentTag(tag)
                                  setIsEditingTag(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTag(tag.id)}>
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
