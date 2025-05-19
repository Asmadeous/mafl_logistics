"use client"

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  status: string;
  is_featured: boolean;
  published_at: string;
  author_name: string;
  author_avatar_url?: string;
  category: { id: number; name: string; slug: string; description: string };
  tags: { id: number; name: string; slug: string }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface BlogResponse {
  posts: BlogPost[];
  pagination: Pagination;
}

interface UseBlogsResult {
  blogs: BlogPost[];
  categories: Category[];
  tags: Tag[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  fetchBlogs: (page?: number, perPage?: number, categoryId?: number, tagIds?: number[]) => Promise<BlogPost[] | null>;
  fetchCategories: () => Promise<Category[] | null>;
  fetchTags: () => Promise<Tag[] | null>;
  fetchBlogBySlug: (slug: string) => Promise<BlogPost | null>;
}

export function useBlogs(): UseBlogsResult {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (
    page: number = 1,
    perPage: number = 10,
    categoryId?: number,
    tagIds?: number[]
  ): Promise<BlogPost[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = categoryId || tagIds ? "/blog/related" : "/blog/posts";
      const params: Record<string, any> = { page, per_page: perPage };
      if (categoryId) params.category_id = categoryId;
      if (tagIds && tagIds.length > 0) params.tag_ids = tagIds;

      console.debug("Fetching blogs with params:", { endpoint, params });
      const response = await api.blogs.getAll(params, endpoint);

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      if (!response.data || !response.data.posts) {
        throw new Error("Invalid response format: missing posts");
      }

      const { posts, pagination } = response.data as BlogResponse;
      setBlogs(posts || []);
      setPagination(pagination || null);
      console.debug("Fetched blogs:", { posts, pagination });
      return posts || [];
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || "Failed to fetch blogs";
      console.error("Error fetching blogs:", { error: err, message: errorMessage, params: { page, perPage, categoryId, tagIds } });
      setError(errorMessage);
      setBlogs([]);
      setPagination(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<Category[] | null> => {
    try {
      const response = await api.blogs.getCategories();

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const categoriesData = response.data || [];
      setCategories(categoriesData);
      console.debug("Fetched categories:", categoriesData);
      return categoriesData;
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to fetch categories");
      return null;
    }
  }, []);

  const fetchTags = useCallback(async (): Promise<Tag[] | null> => {
    try {
      const response = await api.blogs.getTags();

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const tagsData = response.data || [];
      setTags(tagsData);
      console.debug("Fetched tags:", tagsData);
      return tagsData;
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      setError(err.message || "Failed to fetch tags");
      return null;
    }
  }, []);

  const fetchBlogBySlug = useCallback(async (slug: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.blogs.getBySlug(slug);

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      if (!response.data?.post) {
        throw new Error("Invalid response format: missing post");
      }

      console.debug("Fetched blog by slug:", response.data.post);
      return response.data.post || null;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || "Failed to fetch blog";
      console.error("Error fetching blog:", { error: err, message: errorMessage, slug });
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        const [blogsData, categoriesData, tagsData] = await Promise.all([
          fetchBlogs(),
          fetchCategories(),
          fetchTags(),
        ]);

        console.debug("Initialized data:", {
          blogs: blogsData,
          categories: categoriesData,
          tags: tagsData,
        });
      } catch (error: any) {
        const errorMessage = error.message || "Failed to initialize data";
        console.error("Error initializing data:", { error, message: errorMessage });
        setError(errorMessage);
      }
    };

    initData();
  }, [fetchBlogs, fetchCategories, fetchTags]);

  return {
    blogs,
    categories,
    tags,
    pagination,
    isLoading,
    error,
    fetchBlogs,
    fetchCategories,
    fetchTags,
    fetchBlogBySlug,
  };
}