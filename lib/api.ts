"use client";

// Base API URL from environment variables
const API_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.RAILS_API_URL || "http://localhost:3000";

// Helper function for making API requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`🔄 API Request: ${API_URL}${endpoint}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.parse(options.body as string) : undefined,
      });
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      const contentType = response.headers.get("content-type");
      data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (error) {
      console.error(`Response parsing error for ${endpoint}:`, error);
      throw new Error(
        `Failed to parse server response: ${
          error && typeof error === "object" && "message" in error ? (error as any).message : String(error)
        }`
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${API_URL}${endpoint}`, {
        status: response.status,
        data,
      });
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `API error: ${response.status} ${response.statusText}`;
      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : `Unknown error occurred while fetching ${endpoint}`;
    console.error(`API request failed for ${endpoint}:`, { error, stack: error.stack });
    return {
      data: null,
      error: errorMessage,
      status: 500,
    };
  }
};

const api = {
  auth: {
    user: {
      login: async (email: string, password: string, rememberMe: boolean = false) =>
        fetchAPI("/users/sign_in", {
          method: "POST",
          body: JSON.stringify({ user: { email, password, rememberMe } }),
        }),
      register: async (userData: any) =>
        fetchAPI("/users", {
          method: "POST",
          body: JSON.stringify({ user: userData }),
        }),
      getCurrentUser: async () => fetchAPI("/users/profile"),
      updateProfile: async (userData: any) =>
        fetchAPI("/users/profile", {
          method: "PUT",
          body: JSON.stringify({ user: userData }),
        }),
      resetPassword: async (email: string) =>
        fetchAPI("/users/password", {
          method: "POST",
          body: JSON.stringify({ user: { email } }),
        }),
      updatePassword: async (token: string, password: string, passwordConfirmation: string) =>
        fetchAPI("/users/password", {
          method: "PUT",
          body: JSON.stringify({
            user: {
              reset_password_token: token,
              password,
              password_confirmation: passwordConfirmation,
            },
          }),
        }),
      googleAuth: async (token: string) =>
        fetchAPI("/users/auth/google_oauth2/callback", {
          method: "POST",
          body: JSON.stringify({ token }),
        }),
      getDashboard: async () => fetchAPI("/users/dashboard"),
      getSettings: async () => fetchAPI("/users/settings"),
      updateSettings: async (settingsData: any) =>
        fetchAPI("/users/settings", {
          method: "PUT",
          body: JSON.stringify({ settings: settingsData }),
        }),
    },
    client: {
      login: async (email: string, password: string, rememberMe: boolean = false) =>
        fetchAPI("/clients/sign_in", {
          method: "POST",
          body: JSON.stringify({ client: { email, password, rememberMe } }),
        }),
      register: async (clientData: any) =>
        fetchAPI("/clients", {
          method: "POST",
          body: JSON.stringify({ client: clientData }),
        }),
      getCurrentClient: async () => fetchAPI("/clients/profile"),
      updateProfile: async (clientData: any) =>
        fetchAPI("/clients/profile", {
          method: "PUT",
          body: JSON.stringify({ client: clientData }),
        }),
      resetPassword: async (email: string) =>
        fetchAPI("/clients/password", {
          method: "POST",
          body: JSON.stringify({ client: { email } }),
        }),
      updatePassword: async (token: string, password: string, passwordConfirmation: string) =>
        fetchAPI("/clients/password", {
          method: "PUT",
          body: JSON.stringify({
            client: {
              reset_password_token: token,
              password,
              password_confirmation: passwordConfirmation,
            },
          }),
        }),
      getDashboard: async () => fetchAPI("/clients/dashboard"),
      getSettings: async () => fetchAPI("/clients/settings"),
      updateSettings: async (settingsData: any) =>
        fetchAPI("/clients/settings", {
          method: "PUT",
          body: JSON.stringify({ settings: settingsData }),
        }),
    },
    employee: {
      login: async (email: string, password: string, rememberMe: boolean = false) =>
        fetchAPI("/employees/sign_in", {
          method: "POST",
          body: JSON.stringify({ employee: { email, password, rememberMe } }),
        }),
      getCurrentEmployee: async () => fetchAPI("/employees/profile"),
      updateProfile: async (employeeData: any) =>
        fetchAPI("/employees/profile", {
          method: "PUT",
          body: JSON.stringify({ employee: employeeData }),
        }),
      checkAdminStatus: async () => fetchAPI("/employees/admin_signed_in"),
      resetPassword: async (email: string) =>
        fetchAPI("/employees/password", {
          method: "POST",
          body: JSON.stringify({ employee: { email } }),
        }),
      updatePassword: async (token: string, password: string, passwordConfirmation: string) =>
        fetchAPI("/employees/password", {
          method: "PUT",
          body: JSON.stringify({
            employee: {
              reset_password_token: token,
              password,
              password_confirmation: passwordConfirmation,
            },
          }),
        }),
      getDashboard: async () => fetchAPI("/employees/dashboard"),
      getSettings: async () => fetchAPI("/employees/settings"),
      updateSettings: async (settingsData: any) =>
        fetchAPI("/employees/settings", {
          method: "PUT",
          body: JSON.stringify({ settings: settingsData }),
        }),
    },
    logout: async (userType = "user") => {
      let endpoint = "/users/sign_out";
      if (userType === "client") endpoint = "/clients/sign_out";
      else if (userType === "employee") endpoint = "/employees/sign_out";
      return fetchAPI(endpoint, { method: "DELETE" });
    },
  },

  guests: {
    register: async (name: string, email?: string) =>
      fetchAPI("/guest/conversations", {
        method: "POST",
        body: JSON.stringify({ guest: { name, email } }),
      }),
  },

  blogs: {
    getAll: async (params: Record<string, any> = {}, endpoint: string = "/blog/posts") => {
      const queryParams = new URLSearchParams(params).toString();
      return fetchAPI(`${endpoint}${queryParams ? `?${queryParams}` : ""}`);
    },
    
    getCategories: async () => fetchAPI("/blog/categories"),
    
    getTags: async () => fetchAPI("/blog/tags"),
    
    getById: async (id: string) => fetchAPI(`/blog/posts/${id}`),
    
    getBySlug: async (slug: string) => {
      return fetchAPI(`/blog/posts/${encodeURIComponent(slug)}`);
    },
  },

  conversations: {
    getAll: async () => fetchAPI("/conversations"),
    getById: async (id: string) => fetchAPI(`/conversations/${id}`),
    create: async (recipientId: string, recipientType: string) =>
      fetchAPI("/conversations", {
        method: "POST",
        body: JSON.stringify({
          conversation: {
            recipient_id: recipientId,
            recipient_type: recipientType,
          },
        }),
      }),
    sendMessage: async (conversationId: string, content: string) =>
      fetchAPI(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: { content } }),
      }),
    markMessageAsRead: async (conversationId: string, messageId: string) =>
      fetchAPI(`/conversations/${conversationId}/messages/${messageId}/read`, {
        method: "PUT",
      }),
  },

  notifications: {
    getAll: async () => fetchAPI("/notifications"),
    markAsRead: async (id: string) =>
      fetchAPI(`/notifications/${id}/read`, {
        method: "PUT",
      }),
    markAllAsRead: async () =>
      fetchAPI("/notifications/mark_all_read", {
        method: "PUT",
      }),
  },

  jobListings: {
    getAll: async (page = 1) => fetchAPI(`/job_listings?page=${page}`),
    getBySlug: async (slug: string) => fetchAPI(`/job_listings/${slug}`),
    apply: async (slug: string, applicantData: any) =>
      fetchAPI(`/job_listings/${slug}/apply`, {
        method: "POST",
        body: JSON.stringify({ applicant: applicantData }),
      }),
  },

  appointments: {
    getAll: async () => fetchAPI("/appointments"),
    getById: async (id: string) => fetchAPI(`/appointments/${id}`),
    create: async (appointmentData: any) =>
      fetchAPI("/appointments", {
        method: "POST",
        body: JSON.stringify({ appointment: appointmentData }),
      }),
    update: async (id: string, appointmentData: any) =>
      fetchAPI(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ appointment: appointmentData }),
      }),
    cancel: async (id: string) =>
      fetchAPI(`/appointments/${id}`, {
        method: "DELETE",
      }),
  },

  newsletter: {
    subscribe: async (email: string) =>
      fetchAPI("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
  },
};

export default api;