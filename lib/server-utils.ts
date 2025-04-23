// Server utilities to work with Rails API

/**
 * Get the current server session from Rails API
 */
export async function getServerSession() {
  try {
    const response = await fetch(`${process.env.RAILS_API_URL}/api/auth/session`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return { data: { session: null } }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Error fetching server session:", error)
    return { data: { session: null } }
  }
}

/**
 * Get admin client for admin operations
 */
export async function getServerAdminClient() {
  return {
    auth: {
      admin: {
        listUsers: async () => {
          try {
            const response = await fetch(`${process.env.RAILS_API_URL}/api/admin/users`, {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            })

            if (!response.ok) {
              throw new Error(`Failed to list users: ${response.status}`)
            }

            const users = await response.json()
            return { data: { users }, error: null }
          } catch (error) {
            console.error("Error listing users:", error)
            return { data: { users: [] }, error }
          }
        },
      },
    },
  }
}
