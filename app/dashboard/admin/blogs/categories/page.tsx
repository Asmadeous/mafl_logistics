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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock categories data
const categories = [
  {
    id: 1,
    name: "Logistics",
    slug: "logistics",
    description: "Articles about logistics industry trends and best practices",
    postCount: 12,
  },
  {
    id: 2,
    name: "Transportation",
    slug: "transportation",
    description: "Content related to transportation services and innovations",
    postCount: 8,
  },
  {
    id: 3,
    name: "Warehousing",
    slug: "warehousing",
    description: "Information about warehousing solutions and management",
    postCount: 6,
  },
  {
    id: 4,
    name: "Road Construction",
    slug: "road-construction",
    description: "Updates and insights on road construction projects and techniques",
    postCount: 5,
  },
  {
    id: 5,
    name: "Industry News",
    slug: "industry-news",
    description: "Latest news and updates from the logistics and transportation industry",
    postCount: 10,
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const { toast } = useToast()

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCategory = (e) => {
    e.preventDefault()
    setIsAddingCategory(false)

    toast({
      title: "Category added successfully",
      description: "The new category has been created.",
    })
  }

  const handleEditCategory = (e) => {
    e.preventDefault()
    setIsEditingCategory(false)

    toast({
      title: "Category updated successfully",
      description: "The category has been updated.",
    })
  }

  const handleDeleteCategory = (id) => {
    toast({
      title: "Category deleted",
      description: "The category has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blog Categories</h1>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for blog posts.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" placeholder="e.g. Logistics Tips" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="logistics-tips" required />
                <p className="text-xs text-muted-foreground">The slug is used in the URL of the category page.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the category" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="divide-y">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-muted-foreground">{category.description}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Posts: {category.postCount} | Slug: {category.slug}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog
                    open={isEditingCategory && currentCategory?.id === category.id}
                    onOpenChange={(open) => {
                      setIsEditingCategory(open)
                      if (open) {
                        setCurrentCategory(category)
                      } else {
                        setCurrentCategory(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Make changes to the category details.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditCategory} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Category Name</Label>
                          <Input id="edit-name" defaultValue={category.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-slug">Slug</Label>
                          <Input id="edit-slug" defaultValue={category.slug} required />
                          <p className="text-xs text-muted-foreground">
                            The slug is used in the URL of the category page.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input id="edit-description" defaultValue={category.description} />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditingCategory(false)
                              setCurrentCategory(null)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No categories found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
