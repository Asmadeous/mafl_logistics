
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken, removeToken, isTokenValid, getToken, decodeToken } from "@/lib/jwt-utils";

// Define user type
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  phone?: string;
  company?: string;
  user_metadata?: Record<string, any>;
  type: "Employee" | "User";
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  loginEmployee: (email: string, password: string) => Promise<void>;
  registerUser: (userData: FormData | any) => Promise<void>;
  registerEmployee: (userData: FormData | any, isFormData?: boolean) => Promise<void>;
  googleAuthUser: () => Promise<void>;
  googleAuthEmployee: () => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string, isEmployee?: boolean) => Promise<void>;
  resetPassword: (data: any, isEmployee?: boolean) => Promise<void>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "staff";

  // Extract user from token
  const getUserFromToken = () => {
    try {
      const token = getToken();
      if (!token) {
        console.log("No token found");
        return null;
      }

      // Decode the token to get user information
      const decoded = decodeToken(token);
      if (!decoded) {
        console.log("Failed to decode token");
        return null;
      }

      // Derive type from scp or role
      const type: "Employee" | "User" = decoded.scp === "employee" ? "Employee" : "User";

      return {
        id: decoded.sub || decoded.id || "",
        email: decoded.email || "",
        name: decoded.name || undefined,
        role: decoded.role || undefined,
        avatar_url: decoded.avatar_url || undefined,
        phone: decoded.phone || undefined,
        company: decoded.company || undefined,
        user_metadata: decoded.user_metadata || undefined,
        type,
      };
    } catch (error) {
      console.error("Error extracting user from token:", error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a valid token
        if (!isTokenValid()) {
          console.log("No valid token found, user is not authenticated");
          removeToken();
          setUser(null);
          setLoading(false);
          router.push("/auth/login");
          return;
        }

        // Extract user from token
        const tokenUser = getUserFromToken();
        if (tokenUser) {
          setUser(tokenUser);
          console.log("User session restored from token", tokenUser);
        } else {
          console.log("Could not extract user from token");
          setUser(null);
          removeToken();
          router.push("/auth/login");
        }
      } catch (error) {
        console.warn("Session check error:", error);
        setUser(null);
        removeToken();
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Login user
  const loginUser = async (email: string, password: string) => {
    try {
      console.log("Attempting user login for:", email);
      const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL;
      const response = await fetch(`${API_URL}/users/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        const tokenUser = getUserFromToken();
        if (tokenUser) {
          setUser({ ...tokenUser, type: "User" });
          console.log("User logged in:", tokenUser);
        }
        router.push("/dashboard");
      } else {
        throw new Error("Login failed: No authentication token received.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Login employee (admin)
  const loginEmployee = async (email: string, password: string) => {
    try {
      console.log("Attempting employee login for:", email);
      const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL;
      const response = await fetch(`${API_URL}/employees/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ employee: { email, password } }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        const tokenUser = getUserFromToken();
        if (tokenUser) {
          setUser({ ...tokenUser, type: "Employee" });
          console.log("Employee logged in:", tokenUser);
        }
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 100);
      } else {
        throw new Error("Login failed: No authentication token received.");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  // Register user
  const registerUser = async (userData: FormData | any) => {
    try {
      const isFormData = userData instanceof FormData;
      const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL;
      const headers: Record<string, string> = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
      }

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers,
        body: isFormData ? userData : JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Registration failed.");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      }
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Register employee (admin)
  const registerEmployee = async (userData: FormData | any, isFormData = false) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL;
      const headers: Record<string, string> = {};
      if (!(userData instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
      }

      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers,
        body: userData instanceof FormData ? userData : JSON.stringify({ employee: userData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Registration failed.");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
      }
      router.push("/admin/login?registered=true");
    } catch (error: any) {
      console.error("Admin registration error:", error);
      throw error;
    }
  };

  // Google auth for users
  const googleAuthUser = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_RAILS_API_URL}/users/auth/google_oauth2`;
    } catch (error: any) {
      console.error("Google auth error:", error);
      throw error;
    }
  };

  // Google auth for employees (admin)
  const googleAuthEmployee = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_RAILS_API_URL}/employees/auth/google_oauth2`;
    } catch (error: any) {
      console.error("Google auth error for admin:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
      if (isAdminPath) {
        await api.auth.logoutEmployee();
      } else {
        await api.auth.logoutUser();
      }
      removeToken();
      setUser(null);
      router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      removeToken();
      setUser(null);
      router.push("/");
      throw error;
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string, isEmployee = false) => {
    try {
      if (isEmployee) {
        await api.auth.requestPasswordResetEmployee(email);
      } else {
        await api.auth.requestPasswordResetUser(email);
      }
      router.push(isEmployee ? "/admin/forgot-password/confirmation" : "/auth/forgot-password/confirmation");
    } catch (error: any) {
      console.error("Password reset request error:", error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (data: any, isEmployee = false) => {
    try {
      if (isEmployee) {
        await api.auth.resetPasswordEmployee(data);
      } else {
        await api.auth.resetPasswordUser(data);
      }
      router.push(isEmployee ? "/admin/login?reset=true" : "/auth/login?reset=true");
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        loginUser,
        loginEmployee,
        registerUser,
        registerEmployee,
        googleAuthUser,
        googleAuthEmployee,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
