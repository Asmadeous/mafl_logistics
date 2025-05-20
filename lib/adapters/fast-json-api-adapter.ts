interface FastJsonAPIResource {
  id: string;
  type: string;
  attributes: Record<string, any>;
  relationships?: Record<
    string,
    { data: { id: string; type: string } | { id: string; type: string }[] }
  >;
}

interface FastJsonAPIResponse {
  data: FastJsonAPIResource | FastJsonAPIResource[];
  included?: FastJsonAPIResource[];
  meta?: Record<string, any>;
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
  category?: Category;
  tags?: Tag[];
}

interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export class FastJsonApiAdapter {
  // Helper method to extract data from nested response
  static getData(apiResponse: any): FastJsonAPIResource | FastJsonAPIResource[] | null {
    // Handle nested data structure (e.g., { data: { data: [...] } })
    if (apiResponse?.data?.data) {
      return apiResponse.data.data;
    }
    // Fallback to apiResponse.data if not nested
    return apiResponse?.data || null;
  }

  static transformBlogResponse(apiResponse: any): BlogResponse {
    const data = this.getData(apiResponse);
    const included = Array.isArray(apiResponse?.data?.included) ? apiResponse.data.included : [];
    const meta = apiResponse?.data?.meta?.pagination || {
      current_page: 1,
      total_pages: 1,
      total_count: Array.isArray(data) ? data.length : data ? 1 : 0,
      per_page: 10,
    };

    if (!data) {
      console.warn("Invalid API response format", apiResponse);
      return {
        posts: [],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: 0,
          per_page: 10,
        },
      };
    }

    const resources = Array.isArray(data) ? data : [data];
    const includedMap = new Map<string, FastJsonAPIResource>();
    included.forEach((resource:any) => {
      if (resource.id && resource.type) {
        includedMap.set(`${resource.type}:${resource.id}`, resource);
      }
    });

    const posts: BlogPost[] = resources
      .filter((resource) => resource.type === "post" && resource.id)
      .map((resource) => {
        const attrs = resource.attributes || {};
        const rels = resource.relationships || {};

        // Category
        let category: Category | undefined;
        const categoryRef = rels.category?.data;
        if (categoryRef && !Array.isArray(categoryRef) && categoryRef.id && categoryRef.type) {
          const catResource = includedMap.get(`${categoryRef.type}:${categoryRef.id}`);
          if (catResource?.attributes) {
            category = {
              id: catResource.id,
              name: catResource.attributes.name || "Unknown",
              slug: catResource.attributes.slug || "unknown",
              description: catResource.attributes.description || "",
            };
          }
        }

        // Tags
        const tags: Tag[] = (Array.isArray(rels.tags?.data) ? rels.tags.data : [])
          .map((tagRef) => {
            if (!tagRef.id || !tagRef.type) return null;
            const tagResource = includedMap.get(`${tagRef.type}:${tagRef.id}`);
            if (tagResource?.attributes) {
              return {
                id: tagResource.id,
                name: tagResource.attributes.name || "Unknown",
                slug: tagResource.attributes.slug || "unknown",
              };
            }
            return null;
          })
          .filter((tag): tag is Tag => tag !== null);

        // Author
        let authorName = attrs.author_name || "Unknown";
        const employeeRef = rels.employee?.data;
        if (!authorName && employeeRef && !Array.isArray(employeeRef) && employeeRef.id && employeeRef.type) {
          const employeeResource = includedMap.get(`${employeeRef.type}:${employeeRef.id}`);
          if (employeeResource?.attributes) {
            authorName = employeeResource.attributes.full_name || "Unknown";
          }
        }

        // Featured Image
        let featuredImage: string | undefined;
        if (attrs.featured_image) {
          if (typeof attrs.featured_image === "string") {
            featuredImage = attrs.featured_image;
          } else if (typeof attrs.featured_image === "object" && attrs.featured_image?.record) {
            featuredImage = attrs.featured_image.record.featured_image_url || undefined;
          }
        }

        // Author Avatar
        let authorAvatarUrl: string | undefined;
        if (typeof attrs.author_avatar_url === "boolean") {
          authorAvatarUrl = attrs.author_avatar_url ? "/default-avatar.jpg" : undefined;
        } else {
          authorAvatarUrl = attrs.author_avatar_url;
        }

        return {
          id: resource.id,
          title: attrs.title || "Untitled",
          slug: attrs.slug || "",
          content: attrs.content || "",
          excerpt: attrs.excerpt || "",
          featured_image: featuredImage,
          status: attrs.status || "draft",
          is_featured: !!attrs.is_featured,
          published_at: attrs.published_at || new Date().toISOString(),
          author_name: authorName,
          author_avatar_url: authorAvatarUrl,
          category,
          tags: tags.length > 0 ? tags : undefined,
        };
      });

    return {
      posts,
      pagination: {
        current_page: Number(meta.current_page) || 1,
        total_pages: Number(meta.total_pages) || 1,
        total_count: Number(meta.total_count) || posts.length,
        per_page: Number(meta.per_page) || 10,
      },
    };
  }

  static transformSinglePost(apiResponse: any): { post: BlogPost | null } {
    const transformed = this.transformBlogResponse(apiResponse);
    return {
      post: transformed.posts[0] || null,
    };
  }

  static transformCategories(apiResponse: any): Category[] {
    const data = this.getData(apiResponse);
    if (!data) {
      console.warn("Invalid categories API response", apiResponse);
      return [];
    }

    const resources = Array.isArray(data) ? data : [data];
    return resources
      .filter((res) => res.type === "category" && res.id)
      .map((res) => ({
        id: res.id,
        name: res.attributes?.name || "Unknown",
        slug: res.attributes?.slug || "unknown",
        description: res.attributes?.description || "",
      }));
  }

  static transformTags(apiResponse: any): Tag[] {
    const data = this.getData(apiResponse);
    if (!data) {
      console.warn("Invalid tags API response", apiResponse);
      return [];
    }

    const resources = Array.isArray(data) ? data : [data];
    return resources
      .filter((res) => res.type === "tag" && res.id)
      .map((res) => ({
        id: res.id,
        name: res.attributes?.name || "Unknown",
        slug: res.attributes?.slug || "unknown",
      }));
  }
}