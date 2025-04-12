// Define all admin routes in one place for easy maintenance
export const adminRoutes = {
  // Dashboard
  dashboard: "/admin",

  // Blog management
  blog: {
    index: "/admin/blog",
    new: "/admin/blog/new",
    edit: (id: string) => `/admin/blog/edit/${id}`,
    categories: "/admin/blog/categories",
    tags: "/admin/blog/tags",
  },

  // User management
  users: {
    index: "/admin/users",
    new: "/admin/users/new",
    edit: (id: string) => `/admin/users/edit/${id}`,
  },

  // Customer management
  customers: {
    index: "/admin/customers",
    new: "/admin/customers/new",
    edit: (id: string) => `/admin/customers/edit/${id}`,
  },

  // Order management
  orders: {
    index: "/admin/orders",
    new: "/admin/orders/new",
    edit: (id: string) => `/admin/orders/edit/${id}`,
    view: (id: string) => `/admin/orders/view/${id}`,
  },

  // Employee management
  employees: {
    index: "/admin/employees",
    new: "/admin/employees/new",
    edit: (id: string) => `/admin/employees/edit/${id}`,
  },

  // Invoice management
  invoices: {
    index: "/admin/invoices",
    new: "/admin/invoices/new",
    edit: (id: string) => `/admin/invoices/edit/${id}`,
    view: (id: string) => `/admin/invoices/view/${id}`,
  },

  // Subscriber management
  subscribers: "/admin/subscribers",

  // Message management
  messages: "/admin/messages",

  // Notification management
  notifications: "/admin/notifications",

  // Settings
  settings: "/admin/settings",

  // Setup
  setup: "/admin/setup",
}
