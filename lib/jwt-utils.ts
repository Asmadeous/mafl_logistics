/**
 * JWT token management utilities
 */

// Store token in localStorage
export function getToken(): string | null {
  if (typeof window === "undefined") return null

  // Try both possible token keys for backward compatibility
  const token = localStorage.getItem("jwt_token") || localStorage.getItem("auth_token")
  return token
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return

  // Store token in both keys for backward compatibility
  localStorage.setItem("jwt_token", token)
  localStorage.setItem("auth_token", token)

  // Log token storage for debugging
  console.log("Token stored successfully")
}

export function removeToken(): void {
  if (typeof window === "undefined") return

  // Remove token from both keys
  localStorage.removeItem("jwt_token")
  localStorage.removeItem("auth_token")
}

// Check if token is valid (not expired)
export function isTokenValid(): boolean {
  const token = getToken()
  if (!token) {
    console.log("No token found")
    return false
  }

  try {
    // Basic JWT expiration check
    const payload = decodeToken(token)
    if (!payload) {
      console.log("Could not decode token")
      return false
    }

    // Check if token has expiration
    if (!payload.exp) {
      console.log("Token has no expiration, considering valid")
      return true // If no expiration, consider it valid
    }

    const isValid = payload.exp * 1000 > Date.now()
    console.log("Token validity check:", isValid, "Expires:", new Date(payload.exp * 1000))
    return isValid
  } catch (e) {
    console.error("Error validating token:", e)
    return false
  }
}

// Get the decoded payload from the token
export function decodeToken(token: string): any {
  if (!token) return null

  try {
    // Split the token and get the payload part
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.log("Invalid token format (not a JWT)")
      return null
    }

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

    // Decode the base64 string
    const rawPayload = atob(base64)
    const payload = JSON.parse(rawPayload)

    // Log the decoded payload for debugging
    console.log("Decoded token payload:", payload)
    return payload
  } catch (e) {
    console.error("Error decoding token:", e)
    return null
  }
}

// Check if user has admin role
export function isUserAdmin(): boolean {
  const payload = decodeToken(getToken() || "")
  if (!payload) {
    console.log("No payload found in token")
    return false
  }

  // Check for employee scope in the payload
  // Based on the provided token structure: { "scp": "employee" }
  const scope = payload.scp
  console.log("User scope from token:", scope)

  // Check if scope is "employee"
  const isEmployee = scope === "employee"
  console.log("Is user employee:", isEmployee)
  return isEmployee
}

// Extract user info from token
export function getUserFromToken(): any {
  const payload = decodeToken(getToken() || "")
  if (!payload) return null

  // Create a user object from token claims
  // Adjusted for the provided token structure
  return {
    id: payload.sub,
    email: payload.email || "employee@mafl.com", // Fallback if email not in token
    name: payload.name || "MAFL Employee", // Fallback if name not in token
    role: payload.scp || "unknown",
  }
}
