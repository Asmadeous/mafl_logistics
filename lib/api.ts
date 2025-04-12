/**
 * Utility functions for making API requests to the Rails backend
 */

// Base URL for all API requests
const API_BASE_URL = process.env.RAILS_API_URL || "https://literally-immortal-sunbird.ngrok-free.app"

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  // Include credentials for cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include", // Important for Rails Devise authentication
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, fetchOptions)

  // Handle HTTP errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred while fetching the data.",
    }))

    throw new Error(error.message || `API error: ${response.status}`)
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  // For non-JSON responses (like 204 No Content)
  return {} as T
}

/**
 * Generic fetch function for FormData uploads
 */
async function fetchFormDataAPI<T>(endpoint: string, formData: FormData, method = "POST"): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    body: formData,
    // Don't set Content-Type header, let the browser set it with the boundary
  }

  const response = await fetch(url, fetchOptions)

  // Handle HTTP errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred while uploading the data.",
    }))

    throw new Error(error.message || `API error: ${response.status}`)
  }

  // Check if response is JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  // For non-JSON responses (like 204 No Content)
  return {} as T
}

// Add a new method for FormData registration
export const api = {
  // Authentication endpoints
  auth: {
    // User authentication
    loginUser: (credentials: { email: string; password: string }) =>
      fetchAPI<any>("/users/sign_in", {
        method: "POST",
        body: JSON.stringify({ user: credentials }),
      }),

    registerUser: (userData: any) =>
      fetchAPI<any>("/users", {
        method: "POST",
        body: JSON.stringify({ user: userData }),
      }),

    registerUserWithFormData: (formData: FormData) => {
      // For FormData, we don't set Content-Type as the browser will set it with the boundary
      return fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || `API error: ${response.status}`)
          })
        }
        return response.json()
      })
    },

    logoutUser: () =>
      fetchAPI<any>("/users/sign_out", {
        method: "DELETE",
      }),

    // User password reset
    requestPasswordResetUser: (email: string) =>
      fetchAPI<any>("/users/password", {
        method: "POST",
        body: JSON.stringify({ user: { email } }),
      }),

    resetPasswordUser: (resetData: { reset_password_token: string; password: string; password_confirmation: string }) =>
      fetchAPI<any>("/users/password", {
        method: "PUT",
        body: JSON.stringify({ user: resetData }),
      }),

    // Employee authentication
    loginEmployee: (credentials: { email: string; password: string }) =>
      fetchAPI<any>("/employees/sign_in", {
        method: "POST",
        body: JSON.stringify({ employee: credentials }),
      }),

    registerEmployee: (userData: any, isFormData = false) => {
      if (isFormData && userData instanceof FormData) {
        return fetchFormDataAPI<any>("/employees", userData)
      }
      return fetchAPI<any>("/employees", {
        method: "POST",
        body: JSON.stringify({ employee: userData }),
      })
    },

    logoutEmployee: () =>
      fetchAPI<any>("/employees/sign_out", {
        method: "DELETE",
      }),

    // Employee password reset
    requestPasswordResetEmployee: (email: string) =>
      fetchAPI<any>("/employees/password", {
        method: "POST",
        body: JSON.stringify({ employee: { email } }),
      }),

    resetPasswordEmployee: (resetData: {
      reset_password_token: string
      password: string
      password_confirmation: string
    }) =>
      fetchAPI<any>("/employees/password", {
        method: "PUT",
        body: JSON.stringify({ employee: resetData }),
      }),

    // Get current user/employee status
    getCurrentUser: () => fetchAPI<any>("/api/current_user"),

    // Google OAuth URLs
    googleAuthUser: `${API_BASE_URL}/users/auth/google_oauth2`,
    googleAuthEmployee: `${API_BASE_URL}/employees/auth/google_oauth2`,
  },

  // Health check
  healthCheck: () => fetchAPI<any>("/up"),

  // Blog related endpoints
  blog: {
    getPosts: (page = 1, limit = 10) => fetchAPI<any>(`/api/blog_posts?page=${page}&limit=${limit}`),
    getPost: (slug: string) => fetchAPI<any>(`/api/blog_posts/${slug}`),
    getCategories: () => fetchAPI<any>("/api/blog_categories"),
    getTags: () => fetchAPI<any>("/api/blog_tags"),
    getRelatedPosts: (categoryId: string, currentPostId: string) =>
      fetchAPI<any>(`/api/blog_posts/related?category_id=${categoryId}&current_id=${currentPostId}`),
  },

  // Contact form submission
  contact: {
    submit: (data: any) =>
      fetchAPI<any>("/api/contact", {
        method: "POST",
        body: JSON.stringify({ contact: data }),
      }),
  },

  // Newsletter subscription
  newsletter: {
    subscribe: (email: string) =>
      fetchAPI<any>("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ subscriber: { email } }),
      }),
  },

  // User profile management
  user: {
    updateProfile: (profileData: any) =>
      fetchAPI<any>("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ user: profileData }),
      }),
    updateProfileWithAvatar: (formData: FormData) => {
      // For FormData, we don't set Content-Type as the browser will set it with the boundary
      return fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      }).then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || `API error: ${response.status}`)
          })
        }
        return response.json()
      })
    },
    updatePassword: (passwordData: any) =>
      fetchAPI<any>("/api/user/password", {
        method: "PUT",
        body: JSON.stringify({ user: passwordData }),
      }),
  },
}
