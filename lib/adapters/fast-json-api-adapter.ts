// lib/adapters/fast-json-api-adapter.ts

/**
 * Adapter to transform Fast JSON API responses to the format expected by the frontend
 */

interface FastJsonAPIResource {
  id: string;
  type: string;
  attributes: Record<string, any>;
  relationships?: Record<string, { data: { id: string; type: string } | { id: string; type: string }[] }>;
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
  /**
   * Transform a Fast JSON API response into a blog posts response
   */
  static transformBlogResponse(apiResponse: any): BlogResponse {
    // Check if the response has the expected Fast JSON API structure
    if (!apiResponse || !apiResponse.data || !apiResponse.data.data) {
      console.error("Invalid API response format", apiResponse);
      return { posts: [], pagination: { current_page: 1, total_pages: 1, total_count: 0, per_page: 10 } };
    }

    const response = apiResponse.data as FastJsonAPIResponse;
    const resources = Array.isArray(response.data) ? response.data : [response.data];
    const included = response.included || [];
    const meta = response.meta?.pagination || { 
      current_page: 1, 
      total_pages: 1, 
      total_count: resources.length, 
      per_page: 10 
    };

    // Create a lookup map for included resources
    const includedMap = new Map<string, FastJsonAPIResource>();
    included.forEach(resource => {
      includedMap.set(`${resource.type}:${resource.id}`, resource);
    });

    // Transform each post resource
    const posts = resources
      .filter(resource => resource.type === 'post')
      .map(resource => {
        // Extract relationships
        const categoryRelation = resource.relationships?.category?.data;
        const tagsRelation = resource.relationships?.tags?.data;
        const employeeRelation = resource.relationships?.employee?.data;

        // Find related resources
        let category: Category | undefined;
        if (categoryRelation && !Array.isArray(categoryRelation)) {
          const categoryResource = includedMap.get(`${categoryRelation.type}:${categoryRelation.id}`);
          if (categoryResource) {
            category = {
              id: categoryResource.id,
              name: categoryResource.attributes.name || "Unknown",
              slug: categoryResource.attributes.slug || "unknown",
              description: categoryResource.attributes.description || "",
            };
          }
        }

        // Process tags
        let tags: Tag[] = [];
        if (Array.isArray(tagsRelation)) {
          tags = tagsRelation
            .map(tagRef => {
              const tagResource = includedMap.get(`${tagRef.type}:${tagRef.id}`);
              if (tagResource) {
                return {
                  id: tagResource.id,
                  name: tagResource.attributes.name || "Unknown",
                  slug: tagResource.attributes.slug || "unknown",
                };
              }
              return null;
            })
            .filter((tag): tag is Tag => tag !== null);
        }

        // Get employee/author info
        let authorName = resource.attributes.author_name || "Unknown";
        if (!authorName && employeeRelation && !Array.isArray(employeeRelation)) {
          const employeeResource = includedMap.get(`${employeeRelation.type}:${employeeRelation.id}`);
          if (employeeResource) {
            authorName = employeeResource.attributes.full_name || "Unknown";
          }
        }

        // Handle featured_image which might be nested
        let featuredImage: string | undefined;
        if (resource.attributes.featured_image) {
          if (typeof resource.attributes.featured_image === 'string') {
            featuredImage = resource.attributes.featured_image;
          } else if (typeof resource.attributes.featured_image === 'object') {
            // Handle nested featured_image structure
            if (resource.attributes.featured_image.url) {
              featuredImage = resource.attributes.featured_image.url;
            } else if (resource.attributes.featured_image.record?.featured_image_url) {
              featuredImage = resource.attributes.featured_image.record.featured_image_url;
            }
          }
        }

        // Convert the boolean author_avatar_url to a default URL if needed
        let authorAvatarUrl: string | undefined;
        if (typeof resource.attributes.author_avatar_url === 'boolean') {
          authorAvatarUrl = resource.attributes.author_avatar_url ? '/default-avatar.jpg' : undefined;
        } else {
          authorAvatarUrl = resource.attributes.author_avatar_url;
        }

        // Create the transformed post object
        return {
          id: resource.id,
          title: resource.attributes.title || "Untitled",
          slug: resource.attributes.slug || "",
          content: resource.attributes.content || "",
          excerpt: resource.attributes.excerpt || "",
          featured_image: featuredImage,
          status: resource.attributes.status || "draft",
          is_featured: resource.attributes.is_featured || false,
          published_at: resource.attributes.published_at || new Date().toISOString(),
          author_name: authorName,
          author_avatar_url: authorAvatarUrl,
          category,
          tags: tags.length > 0 ? tags : undefined,
        };
      });

    return {
      posts,
      pagination: {
        current_page: meta.current_page,
        total_pages: meta.total_pages,
        total_count: meta.total_count,
        per_page: meta.per_page,
      },
    };
  }

  /**
   * Transform a Fast JSON API response into a single blog post
   */
  static transformSinglePost(apiResponse: any): { post: BlogPost | null } {
    const transformed = this.transformBlogResponse(apiResponse);
    return {
      post: transformed.posts[0] || null
    };
  }

  /**
   * Transform a Fast JSON API response into categories
   */
  static transformCategories(apiResponse: any): Category[] {
    if (!apiResponse?.data?.data) {
      return [];
    }

    const resources = Array.isArray(apiResponse.data.data) 
      ? apiResponse.data.data 
      : [apiResponse.data.data];

    return resources
      .filter((resource: { type: string; }) => resource.type === 'category')
      .map((resource: { id: any; attributes: { name: any; slug: any; description: any; }; }) => ({
        id: resource.id,
        name: resource.attributes.name || "Unknown",
        slug: resource.attributes.slug || "unknown",
        description: resource.attributes.description || "",
      }));
  }

  /**
   * Transform a Fast JSON API response into tags
   */
  static transformTags(apiResponse: any): Tag[] {
    if (!apiResponse?.data?.data) {
      return [];
    }

    const resources = Array.isArray(apiResponse.data.data) 
      ? apiResponse.data.data 
      : [apiResponse.data.data];

    return resources
      .filter((resource: { type: string; }) => resource.type === 'tag')
      .map((resource: { id: any; attributes: { name: any; slug: any; }; }) => ({
        id: resource.id,
        name: resource.attributes.name || "Unknown",
        slug: resource.attributes.slug || "unknown",
      }));
  }
}