const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL;

// Helper for common request options
const createRequestOptions = (method = 'GET', body: object | null = null) => {
  const options: { method: string; headers: { Authorization?: string; "Content-Type": string; Accept: string }; body?: string } = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(localStorage.getItem("jwt_token")
        ? { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
        : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Handle common error responses
const handleErrorResponse = async (response: Response) => {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Request failed with status: ${response.status}`);
  }
  return response;
};

export const api = {
  auth: {
    logoutUser: async () => {
      const response = await fetch(`${API_URL}/users/sign_out`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(localStorage.getItem("jwt_token")
            ? { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
            : {}),
        },
      });
      if (!response.ok) throw new Error("Logout failed");
    },
    logoutEmployee: async () => {
      const response = await fetch(`${API_URL}/employees/sign_out`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(localStorage.getItem("jwt_token")
            ? { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
            : {}),
        },
      });
      if (!response.ok) throw new Error("Logout failed");
    },
    requestPasswordResetUser: async (email: string) => {
      const response = await fetch(`${API_URL}/users/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: { email } }),
      });
      await handleErrorResponse(response);
    },
    requestPasswordResetEmployee: async (email: string) => {
      const response = await fetch(`${API_URL}/employees/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ employee: { email } }),
      });
      await handleErrorResponse(response);
    },
    resetPasswordUser: async (data: any) => {
      const response = await fetch(`${API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: data }),
      });
      await handleErrorResponse(response);
    },
    resetPasswordEmployee: async (data: any) => {
      const response = await fetch(`${API_URL}/employees/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ employee: data }),
      });
      await handleErrorResponse(response);
    },
  },

  user: {
    updateProfileWithAvatar: async (formData: FormData) => {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          ...(localStorage.getItem("jwt_token")
            ? { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
            : {}),
        },
        body: formData,
      });
      await handleErrorResponse(response);
    },
    updatePassword: async (data: any) => {
      const response = await fetch(`${API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(localStorage.getItem("jwt_token")
            ? { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
            : {}),
        },
        body: JSON.stringify({ user: data }),
      });
      await handleErrorResponse(response);
    },
  },

  newsletter: {
    subscribe: async (email: string) => {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriber: { email } }),
      });
      await handleErrorResponse(response);
    },
  },

  blog: {
    getCategories: async () => {
      const response = await fetch(`${API_URL}/blog/categories`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },
    createPost: async (postData: any) => {
      const response = await fetch(`${API_URL}/blog/posts`, 
        createRequestOptions('POST', { post: postData }));
      await handleErrorResponse(response);
      return response.json();
    },
    getPost: async (slug: string) => {
      const response = await fetch(`${API_URL}/blog/posts/${slug}`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },
    updatePost: async (slug: string, postData: any) => {
      const response = await fetch(`${API_URL}/blog/posts/${slug}`, 
        createRequestOptions('PUT', { post: postData }));
      await handleErrorResponse(response);
    },
  },

  notifications: {
    getNotifications: async () => {
      const response = await fetch(`${API_URL}/notifications`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },
    markAsRead: async (id: string) => {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, createRequestOptions('PUT'));
      await handleErrorResponse(response);
    },
    markAllAsRead: async () => {
      const response = await fetch(`${API_URL}/notifications/mark_all_read`, createRequestOptions('PUT'));
      await handleErrorResponse(response);
    },
  },

  conversations: {
    getConversations: async () => {
      const response = await fetch(`${API_URL}/conversations`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },

    getMessages: async (conversationId: string) => {
      const response = await fetch(`${API_URL}/conversations/${conversationId}`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },

    sendMessage: async (conversationId: string, content: string) => {
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, 
        createRequestOptions('POST', { content }));
      await handleErrorResponse(response);
      return response.json();
    },

    markAsRead: async (conversationId: string, messageId: string) => {
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}/read`, 
        createRequestOptions('PUT'));
      await handleErrorResponse(response);
      return response.json();
    },

    getAvailableUsers: async () => {
      const response = await fetch(`${API_URL}/contacts`, createRequestOptions());
      await handleErrorResponse(response);
      return response.json();
    },

    createConversation: async (partnerId: string) => {
      // Determine whether to use user_id or employee_id based on the current route
      const isAdmin = window.location.pathname.startsWith("/admin");
      const bodyKey = isAdmin ? "user_id" : "employee_id";
      
      const response = await fetch(`${API_URL}/conversations`, 
        createRequestOptions('POST', { [bodyKey]: partnerId }));
      await handleErrorResponse(response);
      return response.json();
    },
  },
};