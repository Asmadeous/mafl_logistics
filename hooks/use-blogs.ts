// "use client";

// import { useState, useEffect, useCallback } from "react";
// import api from "@/lib/api";

// interface BlogPost {
//   id: string; // Changed to string for UUID
//   title: string;
//   slug: string;
//   content: string;
//   excerpt: string;
//   featured_image?: string;
//   status: string;
//   is_featured: boolean;
//   published_at: string;
//   author_name: string;
//   author_avatar_url?: string;
//   category: { id: string; name: string; slug: string; description: string }; // Changed id to string
//   tags: { id: string; name: string; slug: string }[]; // Changed id to string
// }

// interface Category {
//   id: string; // Changed to string
//   name: string;
//   slug: string;
//   description: string;
// }

// interface Tag {
//   id: string; // Changed to string
//   name: string;
//   slug: string;
// }

// interface Pagination {
//   current_page: number;
//   total_pages: number;
//   total_count: number;
//   per_page: number;
// }

// interface BlogResponse {
//   posts: BlogPost[];
//   pagination: Pagination;
// }

// interface UseBlogsResult {
//   blogs: BlogPost[];
//   categories: Category[];
//   tags: Tag[];
//   pagination: Pagination | null;
//   isLoading: boolean;
//   error: string | null;
//   fetchBlogs: (page?: number, perPage?: number, categoryId?: string, tagIds?: string[]) => Promise<BlogPost[] | null>;
//   fetchCategories: () => Promise<Category[] | null>;
//   fetchTags: () => Promise<Tag[] | null>;
//   fetchBlogBySlug: (slug: string) => Promise<BlogPost | null>;
//   fetchBlogById: (id: string) => Promise<BlogPost | null>;
// }

// export function useBlogs(): UseBlogsResult {
//   const [blogs, setBlogs] = useState<BlogPost[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [tags, setTags] = useState<Tag[]>([]);
//   const [pagination, setPagination] = useState<Pagination | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchBlogs = useCallback(
//     async (page: number = 1, perPage: number = 10, categoryId?: string, tagIds?: string[]): Promise<BlogPost[] | null> => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const endpoint = categoryId || tagIds ? "/blog/related" : "/blog/posts";
//         const params: Record<string, any> = { page, per_page: perPage };
//         if (categoryId) params.category_id = categoryId;
//         if (tagIds && tagIds.length > 0) params.tag_ids = tagIds;

//         console.debug("Fetching blogs with params:", { endpoint, params });
//         const response = await api.blogs.getAll(params, endpoint);

//         if (response.error) {
//           throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
//         }

//         if (!response.data || !response.data.posts) {
//           throw new Error("Invalid response format: missing posts");
//         }

//         const { posts, pagination } = response.data as BlogResponse;
//         setBlogs(posts || []);
//         setPagination(pagination || null);
//         console.debug("Fetched blogs:", { posts, pagination });
//         return posts || [];
//       } catch (err: any) {
//         const errorMessage = err.response?.data?.message
//           ? Array.isArray(err.response.data.message)
//             ? err.response.data.message.join(", ")
//             : err.response.data.message
//           : err.message || "Failed to fetch blogs";
//         console.error("Error fetching blogs:", { error: err, message: errorMessage, params: { page, perPage, categoryId, tagIds } });
//         setError(errorMessage);
//         setBlogs([]);
//         setPagination(null);
//         return null;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     []
//   );

//   const fetchCategories = useCallback(async (): Promise<Category[] | null> => {
//     try {
//       const response = await api.blogs.getCategories();

//       if (response.error) {
//         throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
//       }

//       const categoriesData = response.data || [];
//       setCategories(categoriesData);
//       console.debug("Fetched categories:", categoriesData);
//       return categoriesData;
//     } catch (err: any) {
//       console.error("Error fetching categories:", err);
//       setError(err.message || "Failed to fetch categories");
//       return null;
//     }
//   }, []);

//   const fetchTags = useCallback(async (): Promise<Tag[] | null> => {
//     try {
//       const response = await api.blogs.getTags();

//       if (response.error) {
//         throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
//       }

//       const tagsData = response.data || [];
//       setTags(tagsData);
//       console.debug("Fetched tags:", tagsData);
//       return tagsData;
//     } catch (err: any) {
//       console.error("Error fetching tags:", err);
//       setError(err.message || "Failed to fetch tags");
//       return null;
//     }
//   }, []);

//   const fetchBlogById = useCallback(async (id: string): Promise<BlogPost | null> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await api.blogs.getById(id); // Fetch by UUID id

//       if (response.error) {
//         throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
//       }

//       if (!response.data?.post) {
//         throw new Error("Invalid response format: missing post");
//       }

//       console.debug("Fetched blog by id:", response.data.post);
//       return response.data.post || null;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message
//         ? Array.isArray(err.response.data.message)
//           ? err.response.data.message.join(", ")
//           : err.response.data.message
//         : err.message || "Failed to fetch blog";
//       console.error("Error fetching blog by id:", { error: err, message: errorMessage, id });
//       setError(errorMessage);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchBlogBySlug = useCallback(async (slug: string): Promise<BlogPost | null> => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await api.blogs.getBySlug(slug); // Fetch by slug

//       if (response.error) {
//         throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
//       }

//       if (!response.data?.post) {
//         throw new Error("Invalid response format: missing post");
//       }

//       console.debug("Fetched blog by slug:", response.data.post);
//       return response.data.post || null;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message
//         ? Array.isArray(err.response.data.message)
//           ? err.response.data.message.join(", ")
//           : err.response.data.message
//         : err.message || "Failed to fetch blog";
//       console.error("Error fetching blog by slug:", { error: err, message: errorMessage, slug });
//       setError(errorMessage);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const initData = async () => {
//       try {
//         const [blogsData, categoriesData, tagsData] = await Promise.all([
//           fetchBlogs(),
//           fetchCategories(),
//           fetchTags(),
//         ]);

//         console.debug("Initialized data:", {
//           blogs: blogsData,
//           categories: categoriesData,
//           tags: tagsData,
//         });
//       } catch (error: any) {
//         const errorMessage = error.message || "Failed to initialize data";
//         console.error("Error initializing data:", { error, message: errorMessage });
//         setError(errorMessage);
//       }
//     };

//     initData();
//   }, [fetchBlogs, fetchCategories, fetchTags]);

//   return {
//     blogs,
//     categories,
//     tags,
//     pagination,
//     isLoading,
//     error,
//     fetchBlogs,
//     fetchCategories,
//     fetchTags,
//     fetchBlogBySlug,
//     fetchBlogById,
//   };
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { FastJsonApiAdapter } from "@/lib/adapters/fast-json-api-adapter";

interface BlogPost {
  id: string; // Changed to string for UUID
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
  category?: { id: string; name: string; slug: string; description: string }; // Changed id to string
  tags?: { id: string; name: string; slug: string }[]; // Changed id to string
}

interface Category {
  id: string; // Changed to string
  name: string;
  slug: string;
  description: string;
}

interface Tag {
  id: string; // Changed to string
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
        const endpoint = categoryId || tagIds ? "/blog/related" : "/blog/posts";
        const params: Record<string, any> = { page, per_page: perPage };
        if (categoryId) params.category_id = categoryId;
        if (tagIds && tagIds.length > 0) params.tag_ids = tagIds;

        console.debug("Fetching blogs with params:", { endpoint, params });
        const response = await api.blogs.getAll(params, endpoint);

        if (response.error) {
          throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
        }

        // Transform the Fast JSON API response to our expected format
        const transformedResponse = FastJsonApiAdapter.transformBlogResponse(response);
        
        setBlogs(transformedResponse.posts || []);
        setPagination(transformedResponse.pagination || null);
        console.debug("Fetched blogs:", transformedResponse);
        return transformedResponse.posts || [];
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
    },
    []
  );

  const fetchCategories = useCallback(async (): Promise<Category[] | null> => {
    try {
      const response = await api.blogs.getCategories();

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      // Transform the categories response
      const transformedCategories = FastJsonApiAdapter.transformCategories(response);
      setCategories(transformedCategories);
      console.debug("Fetched categories:", transformedCategories);
      return transformedCategories;
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

      // Transform the tags response
      const transformedTags = FastJsonApiAdapter.transformTags(response);
      setTags(transformedTags);
      console.debug("Fetched tags:", transformedTags);
      return transformedTags;
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      setError(err.message || "Failed to fetch tags");
      return null;
    }
  }, []);

  const fetchBlogById = useCallback(async (id: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.blogs.getById(id); // Fetch by UUID id

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      // Transform the response to get a single post
      const transformedResponse = FastJsonApiAdapter.transformSinglePost(response);
      if (!transformedResponse.post) {
        throw new Error("Post not found");
      }

      console.debug("Fetched blog by id:", transformedResponse.post);
      return transformedResponse.post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || "Failed to fetch blog";
      console.error("Error fetching blog by id:", { error: err, message: errorMessage, id });
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
      const response = await api.blogs.getBySlug(slug); // Fetch by slug

      if (response.error) {
        throw new Error(Array.isArray(response.error) ? response.error.join(", ") : response.error);
      }

      // Transform the response to get a single post
      const transformedResponse = FastJsonApiAdapter.transformBlogResponse(response);
      if (!transformedResponse.posts || transformedResponse.posts.length === 0) {
        throw new Error("Post not found");
      }

      // Just take the first post matching the slug
      const post = transformedResponse.posts[0];
      console.debug("Fetched blog by slug:", post);
      return post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : err.message || "Failed to fetch blog";
      console.error("Error fetching blog by slug:", { error: err, message: errorMessage, slug });
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
    fetchBlogById,
  };
}