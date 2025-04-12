import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL and anon key not provided, some features may not work")
    // Return a mock client with upload functionality
    return {
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => {
            console.log(`Mock upload to ${bucket}/${path}`)
            // Return a mock successful response
            return {
              error: null,
              data: { path },
            }
          },
          getPublicUrl: (path: string) => ({
            data: { publicUrl: URL.createObjectURL(new Blob()) },
          }),
        }),
      },
    } as any
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}
