"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Edit, Trash2, Plus, Save, X } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (value: string, isNew = true) => {
    if (isNew) {
      setNewCategory((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }))
    } else {
      setEditingCategory((prev) => {
        if (!prev) return null
        return {
          ...prev,
          name: value,
          slug: generateSlug(value),
        }
      })
    }
  }

  const handleSlugChange = (value: string, isNew = true) => {
    if (isNew) {
      setNewCategory((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    } else {
      setEditingCategory((prev) => {
        if (!prev) return null
        return {
          ...prev,
          slug: generateSlug(value),
        }
      })
    }
  }

  const handleDescriptionChange = (value: string, isNew = true) => {
    if (isNew) {
      setNewCategory((prev) => ({
        ...prev,
        description: value,
      }))
    } else {
      setEditingCategory((prev) => {
        if (!prev) return null
        return {
          ...prev,
          description: value,
        }
      })
    }
  }

  const addCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_categories").insert([
        {
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description || null,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Category added successfully.",
      })

      // Reset form and refresh categories
      setNewCategory({ name: "", slug: "", description: "" })
      setIsAdding(false)
      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("blog_categories")
        .update({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
        })
        .eq("id", editingCategory.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category updated successfully.",
      })

      // Reset editing state and refresh categories
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_categories").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category deleted successfully.",
      })

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-slug">Slug</Label>
                <Input
                  id="new-slug"
                  value={newCategory.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="category-slug"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-description">Description (optional)</Label>
                <Input
                  id="new-description"
                  value={newCategory.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Category description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={addCategory}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Blog Categories</CardTitle>
          <CardDescription>
            Manage categories for your blog posts. You have {categories.length} categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    {editingCategory && editingCategory.id === category.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => handleNameChange(e.target.value, false)}
                            placeholder="Category name"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.slug}
                            onChange={(e) => handleSlugChange(e.target.value, false)}
                            placeholder="category-slug"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.description || ""}
                            onChange={(e) => handleDescriptionChange(e.target.value, false)}
                            placeholder="Category description"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingCategory(null)} title="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={updateCategory} title="Save">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCategory(category)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCategory(category.id)}
                              title="Delete"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">No categories found. Add your first category!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
