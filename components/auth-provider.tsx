// "use client"

// import type React from "react"
// import { createContext, useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import api from "@/lib/api"

// // Define the auth context type
// interface AuthContextType {
//   isAuthenticated: boolean
//   isLoading: boolean
//   userType: "user" | "client" | "employee" | null
//   userData: any | null
//   error: string | null
//   login: (email: string, password: string, type: "user" | "client" | "employee") => Promise<boolean>
//   register: (userData: any, type: "user" | "client" | "employee") => Promise<boolean>
//   googleAuth: () => Promise<boolean>
//   logout: () => Promise<void>
//   checkAuth: () => Promise<boolean>
//   isGuest: boolean
//   guestToken: string | null
//   createGuestSession: () => Promise<string>
// }

// // Create the auth context with a default undefined value
// export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// interface AuthProviderProps {
//   children: React.ReactNode
// }

// // Safely get localStorage items
// const getLocalStorageItem = (key: string): string | null => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem(key)
//   }
//   return null
// }

// // Safely set localStorage items
// const setLocalStorageItem = (key: string, value: string): void => {
//   if (typeof window !== "undefined") {
//     localStorage.setItem(key, value)
//   }
// }

// // Safely remove localStorage items
// const removeLocalStorageItem = (key: string): void => {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem(key)
//   }
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [userType, setUserType] = useState<"user" | "client" | "employee" | null>(null)
//   const [userData, setUserData] = useState<any | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [isGuest, setIsGuest] = useState<boolean>(false)
//   const [guestToken, setGuestToken] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const checkAuthOnMount = async () => {
//       await checkAuth()
//       setIsLoading(false)
//     }

//     checkAuthOnMount()
//   }, [])

//   // Check for guest token on mount
//   useEffect(() => {
//     const storedGuestToken = getLocalStorageItem("guestToken")
//     if (storedGuestToken) {
//       setGuestToken(storedGuestToken)
//       setIsGuest(true)
//     }
//   }, [])

//   // Listen for messages from the OAuth popup window
//   useEffect(() => {
//     const handleOAuthMessage = (event: MessageEvent) => {
//       // Verify origin for security
//       if (event.origin !== window.location.origin) return

//       const { type, token, user } = event.data || {}

//       if (type === "oauth-success" && token) {
//         // Store auth data
//         setLocalStorageItem("authToken", token)
//         setLocalStorageItem("userType", "user") // Google auth is only for users
//         setLocalStorageItem("userId", user?.id || "")

//         setIsAuthenticated(true)
//         setUserType("user")
//         setUserData(user)
//         setIsGuest(false)
//         removeLocalStorageItem("guestToken")
//         setGuestToken(null)

//         // Redirect to dashboard
//         router.push("/dashboard/user")
//       }
//     }

//     if (typeof window !== "undefined") {
//       window.addEventListener("message", handleOAuthMessage)
//       return () => window.removeEventListener("message", handleOAuthMessage)
//     }
//     return undefined
//   }, [router])

//   const login = async (email: string, password: string, type: "user" | "client" | "employee"): Promise<boolean> => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       let response

//       // Use the appropriate login endpoint based on user type
//       if (type === "user") {
//         response = await api.auth.user.login(email, password)
//       } else if (type === "client") {
//         response = await api.auth.client.login(email, password)
//       } else {
//         response = await api.auth.employee.login(email, password)
//       }

//       if (response.error) {
//         setError(response.error)
//         return false
//       }

//       // Store auth data
//       setLocalStorageItem("authToken", response.data.token)
//       setLocalStorageItem("userType", type)
//       setLocalStorageItem("userId", response.data.id || "")

//       setIsAuthenticated(true)
//       setUserType(type)
//       setUserData(response.data)

//       // Clear guest session if exists
//       setIsGuest(false)
//       removeLocalStorageItem("guestToken")
//       setGuestToken(null)

//       return true
//     } catch (err) {
//       console.error("Login error:", err)
//       setError("Login failed. Please check your credentials and try again.")
//       return false
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (userData: any, type: "user" | "client" | "employee"): Promise<boolean> => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       let response

//       // Use the appropriate register endpoint based on user type
//       if (type === "user") {
//         response = await api.auth.user.register(userData)
//       } else if (type === "client") {
//         response = await api.auth.client.register(userData)
//       } else {
//         // Employee registration might be restricted
//         setError("Employee registration is not allowed")
//         return false
//       }

//       if (response.error) {
//         setError(response.error)
//         return false
//       }

//       // Store auth data
//       setLocalStorageItem("authToken", response.data.token)
//       setLocalStorageItem("userType", type)
//       setLocalStorageItem("userId", response.data.id || "")

//       setIsAuthenticated(true)
//       setUserType(type)
//       setUserData(response.data)

//       // Clear guest session if exists
//       setIsGuest(false)
//       removeLocalStorageItem("guestToken")
//       setGuestToken(null)

//       return true
//     } catch (err) {
//       console.error("Registration error:", err)
//       setError("Registration failed. Please try again.")
//       return false
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const googleAuth = async (): Promise<boolean> => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       // Open a popup window to the correct Rails OmniAuth route
//       if (typeof window !== "undefined") {
//         const googleAuthWindow = window.open(
//           `${process.env.NEXT_PUBLIC_API_URL}/users/auth/google_oauth2`,
//           "googleAuth",
//           "width=600,height=600,scrollbars=yes",
//         )

//         if (!googleAuthWindow) {
//           throw new Error("Popup blocked. Please allow popups for this site.")
//         }
//       }

//       // The actual authentication result will be handled by the useEffect listener
//       // that receives a message from the popup window

//       return true
//     } catch (err) {
//       console.error("Google auth error:", err)
//       setError(err instanceof Error ? err.message : "Google authentication failed")
//       setIsLoading(false)
//       return false
//     }
//   }

//   const logout = async (): Promise<void> => {
//     setIsLoading(true)

//     try {
//       // Call the logout API
//       await api.auth.logout(userType || "user")

//       // Clear local storage
//       removeLocalStorageItem("authToken")
//       removeLocalStorageItem("userType")
//       removeLocalStorageItem("userId")

//       setIsAuthenticated(false)
//       setUserType(null)
//       setUserData(null)

//       router.push("/")
//     } catch (err) {
//       console.error("Logout error:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const checkAuth = async (): Promise<boolean> => {
//     const token = getLocalStorageItem("authToken")
//     const storedUserType = getLocalStorageItem("userType") as "user" | "client" | "employee" | null
//     const userId = getLocalStorageItem("userId")

//     if (!token || !storedUserType || !userId) {
//       setIsAuthenticated(false)
//       setUserType(null)
//       setUserData(null)
//       return false
//     }

//     try {
//       let response

//       // Use the appropriate profile endpoint based on user type
//       if (storedUserType === "user") {
//         response = await api.auth.user.getCurrentUser()
//       } else if (storedUserType === "client") {
//         response = await api.auth.client.getCurrentClient()
//       } else {
//         response = await api.auth.employee.getCurrentEmployee()
//       }

//       if (response.error) {
//         throw new Error(response.error)
//       }

//       setIsAuthenticated(true)
//       setUserType(storedUserType)
//       setUserData(response.data)
//       return true
//     } catch (err) {
//       console.error("Auth check error:", err)

//       // Clear invalid auth state
//       removeLocalStorageItem("authToken")
//       removeLocalStorageItem("userType")
//       removeLocalStorageItem("userId")

//       setIsAuthenticated(false)
//       setUserType(null)
//       setUserData(null)

//       return false
//     }
//   }

//   // Create a guest session
//   const createGuestSession = async (): Promise<string> => {
//     try {
//       // Check if we already have a guest token
//       if (guestToken) {
//         return guestToken
//       }

//       // Create a new guest session
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest_sessions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create guest session")
//       }

//       const data = await response.json()
//       const newToken = data.token

//       // Store the guest token
//       setLocalStorageItem("guestToken", newToken)
//       setGuestToken(newToken)
//       setIsGuest(true)

//       return newToken
//     } catch (error) {
//       console.error("Error creating guest session:", error)
//       // Generate a fallback token for development
//       const fallbackToken = `guest-${Math.random().toString(36).substring(2, 15)}`
//       setLocalStorageItem("guestToken", fallbackToken)
//       setGuestToken(fallbackToken)
//       setIsGuest(true)
//       return fallbackToken
//     }
//   }

//   const contextValue: AuthContextType = {
//     isAuthenticated,
//     isLoading,
//     userType,
//     userData,
//     error,
//     login,
//     register,
//     googleAuth,
//     logout,
//     checkAuth,
//     isGuest,
//     guestToken,
//     createGuestSession,
//   }

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
// }
"use client";

import type React from "react";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: "user" | "client" | "employee" | null;
  userData: any | null;
  error: string | null;
  login: (
    email: string,
    password: string,
    type: "user" | "client" | "employee",
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (
    userData: any,
    type: "user" | "client" | "employee"
  ) => Promise<boolean>;
  googleAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isGuest: boolean;
  guestToken: string | null;
  createGuestSession: () => Promise<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<
    "user" | "client" | "employee" | null
  >(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthOnMount = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    checkAuthOnMount();
  }, []);

  useEffect(() => {
    const storedGuestToken = getLocalStorageItem("guestToken");
    if (storedGuestToken) {
      setGuestToken(storedGuestToken);
      setIsGuest(true);
    }
  }, []);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, token, user } = event.data || {};

      if (type === "oauth-success" && token) {
        setLocalStorageItem("authToken", token);
        setLocalStorageItem("userType", "user");
        setLocalStorageItem("userId", user?.id || "");

        setIsAuthenticated(true);
        setUserType("user");
        setUserData(user);
        setIsGuest(false);
        removeLocalStorageItem("guestToken");
        setGuestToken(null);

        router.push("/dashboard/user");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleOAuthMessage);
      return () => window.removeEventListener("message", handleOAuthMessage);
    }
    return undefined;
  }, [router]);

  const login = async (
    email: string,
    password: string,
    type: "user" | "client" | "employee",
    rememberMe: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (type === "user") {
        response = await api.auth.user.login(email, password, rememberMe);
      } else if (type === "client") {
        response = await api.auth.client.login(email, password, rememberMe);
      } else {
        response = await api.auth.employee.login(email, password, rememberMe);
      }

      if (response.error) {
        setError(response.error);
        return false;
      }

      setLocalStorageItem("authToken", response.data.token);
      setLocalStorageItem("userType", type);
      setLocalStorageItem("userId", response.data.id || "");

      setIsAuthenticated(true);
      setUserType(type);
      setUserData(response.data);

      setIsGuest(false);
      removeLocalStorageItem("guestToken");
      setGuestToken(null);

      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: any,
    type: "user" | "client" | "employee"
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (type === "user") {
        response = await api.auth.user.register(userData);
      } else if (type === "client") {
        response = await api.auth.client.register(userData);
      } else {
        setError("Employee registration is not allowed");
        return false;
      }

      if (response.error) {
        setError(response.error);
        return false;
      }

      setLocalStorageItem("authToken", response.data.token);
      setLocalStorageItem("userType", type);
      setLocalStorageItem("userId", response.data.id || "");

      setIsAuthenticated(true);
      setUserType(type);
      setUserData(response.data);

      setIsGuest(false);
      removeLocalStorageItem("guestToken");
      setGuestToken(null);

      return true;
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== "undefined") {
        const googleAuthWindow = window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/users/auth/google_oauth2`,
          "googleAuth",
          "width=600,height=600,scrollbars=yes"
        );

        if (!googleAuthWindow) {
          throw new Error("Popup blocked. Please allow popups for this site.");
        }
      }

      return true;
    } catch (err) {
      console.error("Google auth error:", err);
      setError(
        err instanceof Error ? err.message : "Google authentication failed"
      );
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await api.auth.logout(userType || "user");

      removeLocalStorageItem("authToken");
      removeLocalStorageItem("userType");
      removeLocalStorageItem("userId");

      setIsAuthenticated(false);
      setUserType(null);
      setUserData(null);

      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const token = getLocalStorageItem("authToken");
    const storedUserType = getLocalStorageItem("userType") as
      | "user"
      | "client"
      | "employee"
      | null;
    const userId = getLocalStorageItem("userId");

    if (!token || !storedUserType || !userId) {
      setIsAuthenticated(false);
      setUserType(null);
      setUserData(null);
      return false;
    }

    try {
      let response;

      if (storedUserType === "user") {
        response = await api.auth.user.getCurrentUser();
      } else if (storedUserType === "client") {
        response = await api.auth.client.getCurrentClient();
      } else {
        response = await api.auth.employee.getCurrentEmployee();
      }

      if (response.error) throw new Error(response.error);

      setIsAuthenticated(true);
      setUserType(storedUserType);
      setUserData(response.data);
      return true;
    } catch (err) {
      console.error("Auth check error:", err);
      removeLocalStorageItem("authToken");
      removeLocalStorageItem("userType");
      removeLocalStorageItem("userId");
      setIsAuthenticated(false);
      setUserType(null);
      setUserData(null);
      return false;
    }
  };

  const createGuestSession = async (): Promise<string> => {
    try {
      if (guestToken) return guestToken;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/guest_  sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to create guest session");

      const data = await response.json();
      const newToken = data.token;
      setLocalStorageItem("guestToken", newToken);
      setGuestToken(newToken);
      setIsGuest(true);

      return newToken;
    } catch (error) {
      console.error("Error creating guest session:", error);
      const fallbackToken = `guest-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      setLocalStorageItem("guestToken", fallbackToken);
      setGuestToken(fallbackToken);
      setIsGuest(true);
      return fallbackToken;
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    userType,
    userData,
    error,
    login,
    register,
    googleAuth,
    logout,
    checkAuth,
    isGuest,
    guestToken,
    createGuestSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
