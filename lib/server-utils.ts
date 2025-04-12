// Simplified server utils without Supabase dependencies

export async function getServerSession() {
  // Return a mock session
  return {
    data: {
      session: null,
    },
  }
}

// Remove getServerAdminClient function since we won't use Supabase for photos
