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

type Tag = {
  id: string
  name: string
  slug: string
  created_at: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState({ name: "", slug: "" })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("blog_tags").select("*").order("name", { ascending: true })

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Error",
        description: "Failed to load tags. Please try again.",
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
      setNewTag((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }))
    } else {
      setEditingTag((prev) => {
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
      setNewTag((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    } else {
      setEditingTag((prev) => {
        if (!prev) return null
        return {
          ...prev,
          slug: generateSlug(value),
        }
      })
    }
  }

  const addTag = async () => {
    if (!newTag.name) {
      toast({
        title: "Error",
        description: "Tag name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_tags").insert([
        {
          name: newTag.name,
          slug: newTag.slug,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Tag added successfully.",
      })

      // Reset form and refresh tags
      setNewTag({ name: "", slug: "" })
      setIsAdding(false)
      fetchTags()
    } catch (error) {
      console.error("Error adding tag:", error)
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTag = async () => {
    if (!editingTag || !editingTag.name) {
      toast({
        title: "Error",
        description: "Tag name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("blog_tags")
        .update({
          name: editingTag.name,
          slug: editingTag.slug,
        })
        .eq("id", editingTag.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Tag updated successfully.",
      })

      // Reset editing state and refresh tags
      setEditingTag(null)
      fetchTags()
    } catch (error) {
      console.error("Error updating tag:", error)
      toast({
        title: "Error",
        description: "Failed to update tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_tags").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Tag deleted successfully.",
      })

      // Refresh tags
      fetchTags()
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newTag.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Tag name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-slug">Slug</Label>
                <Input
                  id="new-slug"
                  value={newTag.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="tag-slug"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={addTag}>
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
          <CardTitle>Blog Tags</CardTitle>
          <CardDescription>Manage tags for your blog posts. You have {tags.length} tags.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading tags...</div>
          ) : tags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    {editingTag && editingTag.id === tag.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingTag.name}
                            onChange={(e) => handleNameChange(e.target.value, false)}
                            placeholder="Tag name"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingTag.slug}
                            onChange={(e) => handleSlugChange(e.target.value, false)}
                            placeholder="tag-slug"
                            required
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTag(null)} title="Cancel">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={updateTag} title="Save">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell>{tag.slug}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTag(tag)} title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTag(tag.id)}
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
            <div className="text-center py-4">No tags found. Add your first tag!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
