"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { FastJsonApiAdapter } from "@/lib/adapters/fast-json-api-adapter";

interface BlogPost {
  id: string;
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
  category?: { id: string; name: string; slug: string; description: string };
  tags?: { id: string; name: string; slug: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Tag {
  id: string;
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
  fetchBlogs: (page?: number, perPage?: number, categoryId?: string, tagIds?: string[]) => Promise<BlogPost[] | null>;
  fetchCategories: () => Promise<Category[] | null>;
  fetchTags: () => Promise<Tag[] | null>;
  fetchBlogBySlug: (slug: string) => Promise<BlogPost | null>;
  fetchBlogById: (id: string) => Promise<BlogPost | null>;
}

export function useBlogs(): UseBlogsResult {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(
    async (page: number = 1, perPage: number = 10, categoryId?: string, tagIds?: string[]): Promise<BlogPost[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = { page, per_page: perPage };
        if (categoryId) params["filter[category_id]"] = categoryId;
        if (tagIds && tagIds.length > 0) params["filter[tag_ids]"] = tagIds.join(",");

        console.debug("Fetching blogs with params:", { params });
        const response = await api.blogs.getAll(params, "/blog/posts");
        console.log("Raw API response for blogs:", JSON.stringify(response, null, 2));

        if (response.error) {
          throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
        }

        const transformedResponse = FastJsonApiAdapter.transformBlogResponse(response);
        console.log("Transformed blog response:", transformedResponse);
        setBlogs(transformedResponse.posts || []);
        setPagination(transformedResponse.pagination || null);
        return transformedResponse.posts || [];
      } catch (err: any) {
        const errorMessage = err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : err.message || JSON.stringify(err) || "Failed to fetch blogs";
        console.error("Error fetching blogs:", {
          error: err,
          message: errorMessage,
          params: { page, perPage, categoryId, tagIds },
          stack: err.stack,
        });
        setError(errorMessage);
        setBlogs([]);
        setPagination(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async (): Promise<Category[] | null> => {
    try {
      const response = await api.blogs.getCategories();
      console.log("Raw API response for categories:", JSON.stringify(response, null, 2));

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const transformedCategories = FastJsonApiAdapter.transformCategories(response);
      console.log("Transformed categories:", transformedCategories);
      setCategories(transformedCategories);
      return transformedCategories;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err) || "Failed to fetch categories";
      console.error("Error fetching categories:", { error: err, message: errorMessage, stack: err.stack });
      setError(errorMessage);
      return null;
    }
  }, []);

  const fetchTags = useCallback(async (): Promise<Tag[] | null> => {
    try {
      const response = await api.blogs.getTags();
      console.log("Raw API response for tags:", JSON.stringify(response, null, 2));

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const transformedTags = FastJsonApiAdapter.transformTags(response);
      console.log("Transformed tags:", transformedTags);
      setTags(transformedTags);
      return transformedTags;
    } catch (err: any) {
      const errorMessage = err.message || JSON.stringify(err) || "Failed to fetch tags";
      console.error("Error fetching tags:", { error: err, message: errorMessage, stack: err.stack });
      setError(errorMessage);
      return null;
    }
  }, []);

  const fetchBlogById = useCallback(async (id: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.blogs.getById(id);
      console.log("Raw API response for blog by id:", JSON.stringify(response, null, 2));

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const transformedResponse = FastJsonApiAdapter.transformSinglePost(response);
      console.log("Transformed blog by id:", transformedResponse);
      if (!transformedResponse.post) {
        throw new Error("Post not found");
      }

      return transformedResponse.post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || JSON.stringify(err) || "Failed to fetch blog";
      console.error("Error fetching blog by id:", { error: err, message: errorMessage, id, stack: err.stack });
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBlogBySlug = useCallback(async (slug: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.blogs.getBySlug(slug);
      console.log("Raw API response for blog by slug:", JSON.stringify(response, null, 2));

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      const transformedResponse = FastJsonApiAdapter.transformSinglePost(response);
      console.log("Transformed blog by slug:", transformedResponse);
      if (!transformedResponse.post) {
        throw new Error("Post not found");
      }

      return transformedResponse.post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || JSON.stringify(err) || "Failed to fetch blog";
      console.error("Error fetching blog by slug:", { error: err, message: errorMessage, slug, stack: err.stack });
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
        console.log("Initialized data:", { blogs: blogsData, categories: categoriesData, tags: tagsData });
      } catch (error: any) {
        const errorMessage = error.message || JSON.stringify(error) || "Failed to initialize data";
        console.error("Error initializing data:", { error, message: errorMessage, stack: error.stack });
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
    fetchBlogById,
  };
}