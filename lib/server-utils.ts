// Mock server utilities to replace Supabase auth helpers

export async function getServerSession() {
  // Return a mock session
  return {
    data: {
      session: null,
    },
  }
}

// Mock function for admin client
export async function getServerAdminClient() {
  return {
    // Mock methods as needed
    auth: {
      admin: {
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
    },
  }
}
