// Mock server-side session and admin client for now
// This removes the dependency on @supabase/auth-helpers-nextjs

// Get server-side session
export async function getServerSession() {
  // Return a mock session
  return {
    data: {
      session: null,
    },
  }
}

// Get server-side admin client
export function getServerAdminClient() {
  // Return a mock admin client with minimal functionality
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          or: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
        }),
        in: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
        update: () => ({
          eq: () => Promise.resolve({ error: null }),
          in: () => Promise.resolve({ error: null }),
        }),
        insert: () => Promise.resolve({ error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg" } }),
      }),
    },
  }
}
