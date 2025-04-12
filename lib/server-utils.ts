// Simplified server utils without Supabase dependencies

export async function getServerSession() {
  // Return a mock session
  return {
    data: {
      session: null,
    },
  }
}

export function getServerAdminClient() {
  // Return a mock admin client
  return {
    // Add minimal functionality needed for photo handling
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any) => {
          console.log(`Mock server upload to ${bucket}/${path}`)
          return { data: { path }, error: null }
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/placeholder.svg?height=200&width=200` },
        }),
      }),
    },
  }
}
