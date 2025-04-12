/**
 * Utility functions for making API requests to the Rails backend
 */
import { urls } from "@/config/urls"

// Base URL for all API requests
const API_BASE_URL = urls.api.baseUrl

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
      fetchAPI<any>(urls.api.endpoints.auth.login, {
        method: "POST",
        body: JSON.stringify({ user: credentials }),
      }),

    registerUser: (userData: any) =>
      fetchAPI<any>(urls.api.endpoints.auth.register, {
        method: "POST",
        body: JSON.stringify({ user: userData }),
      }),

    registerUserWithFormData: (formData: FormData) => {
      // For FormData, we don't set Content-Type as the browser will set it with the boundary
      return fetch(`${API_BASE_URL}${urls.api.endpoints.auth.register}`, {
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
      fetchAPI<any>(urls.api.endpoints.auth.logout, {
        method: "DELETE",
      }),

    // User password reset
    requestPasswordResetUser: (email: string) =>
      fetchAPI<any>(urls.api.endpoints.auth.passwordReset, {
        method: "POST",
        body: JSON.stringify({ user: { email } }),
      }),

    resetPasswordUser: (resetData: { reset_password_token: string; password: string; password_confirmation: string }) =>
      fetchAPI<any>(urls.api.endpoints.auth.passwordReset, {
        method: "PUT",
        body: JSON.stringify({ user: resetData }),
      }),

    // Employee authentication
    loginEmployee: (credentials: { email: string; password: string }) =>
      fetchAPI<any>(urls.api.endpoints.auth.employeeLogin, {
        method: "POST",
        body: JSON.stringify({ employee: credentials }),
      }),

    registerEmployee: (userData: any, isFormData = false) => {
      if (isFormData && userData instanceof FormData) {
        return fetchFormDataAPI<any>(urls.api.endpoints.auth.employeeRegister, userData)
      }
      return fetchAPI<any>(urls.api.endpoints.auth.employeeRegister, {
        method: "POST",
        body: JSON.stringify({ employee: userData }),
      })
    },

    logoutEmployee: () =>
      fetchAPI<any>(urls.api.endpoints.auth.employeeLogout, {
        method: "DELETE",
      }),

    // Employee password reset
    requestPasswordResetEmployee: (email: string) =>
      fetchAPI<any>(urls.api.endpoints.auth.employeePasswordReset, {
        method: "POST",
        body: JSON.stringify({ employee: { email } }),
      }),

    resetPasswordEmployee: (resetData: {
      reset_password_token: string
      password: string
      password_confirmation: string
    }) =>
      fetchAPI<any>(urls.api.endpoints.auth.employeePasswordReset, {
        method: "PUT",
        body: JSON.stringify({ employee: resetData }),
      }),

    // Get current user/employee status
    getCurrentUser: () => fetchAPI<any>(urls.api.endpoints.auth.currentUser),

    // Google OAuth URLs
    googleAuthUser: `${API_BASE_URL}${urls.api.endpoints.auth.googleAuth}`,
    googleAuthEmployee: `${API_BASE_URL}${urls.api.endpoints.auth.googleAuthEmployee}`,
  },

  // Health check
  healthCheck: () => fetchAPI<any>("/up"),

  // Blog related endpoints
  blog: {
    getPosts: (page = 1, limit = 10) => fetchAPI<any>(`${urls.api.endpoints.blog.posts}?page=${page}&limit=${limit}`),
    getPost: (slug: string) => fetchAPI<any>(`${urls.api.endpoints.blog.posts}/${slug}`),
    getCategories: () => fetchAPI<any>(urls.api.endpoints.blog.categories),
    getTags: () => fetchAPI<any>(urls.api.endpoints.blog.tags),
    getRelatedPosts: (categoryId: string, currentPostId: string) =>
      fetchAPI<any>(`${urls.api.endpoints.blog.related}?category_id=${categoryId}&current_id=${currentPostId}`),
  },

  // Contact form submission
  contact: {
    submit: (data: any) =>
      fetchAPI<any>(urls.api.endpoints.contact.submit, {
        method: "POST",
        body: JSON.stringify({ contact: data }),
      }),
  },

  // Newsletter subscription
  newsletter: {
    subscribe: (email: string) =>
      fetchAPI<any>(urls.api.endpoints.newsletter.subscribe, {
        method: "POST",
        body: JSON.stringify({ subscriber: { email } }),
      }),
  },

  // User profile management
  user: {
    updateProfile: (profileData: any) =>
      fetchAPI<any>(urls.api.endpoints.user.profile, {
        method: "PUT",
        body: JSON.stringify({ user: profileData }),
      }),
    updateProfileWithAvatar: (formData: FormData) => {
      // For FormData, we don't set Content-Type as the browser will set it with the boundary
      return fetch(`${API_BASE_URL}${urls.api.endpoints.user.profile}`, {
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
      fetchAPI<any>(urls.api.endpoints.user.password, {
        method: "PUT",
        body: JSON.stringify({ user: passwordData }),
      }),
  },
}
