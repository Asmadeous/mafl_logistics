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

const getStorageItem = (
  key: string,
  useSession: boolean = false
): string | null => {
  if (typeof window !== "undefined") {
    return useSession ? sessionStorage.getItem(key) : localStorage.getItem(key);
  }
  return null;
};

const setStorageItem = (
  key: string,
  value: string,
  useSession: boolean = false
): void => {
  if (typeof window !== "undefined") {
    if (useSession) {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }
};

const removeStorageItem = (key: string, useSession: boolean = false): void => {
  if (typeof window !== "undefined") {
    if (useSession) {
      sessionStorage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
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
  const [useSessionStorage, setUseSessionStorage] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthOnMount = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    checkAuthOnMount();
  }, []);

  useEffect(() => {
    const storedGuestToken = getStorageItem("guestToken", useSessionStorage);
    if (storedGuestToken) {
      setGuestToken(storedGuestToken);
      setIsGuest(true);
    }
  }, [useSessionStorage]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, token, user } = event.data || {};

      if (type === "oauth-success" && token) {
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");
        setStorageItem("userId", user?.id || "");

        setIsAuthenticated(true);
        setUserType("user");
        setUserData(user);
        setIsGuest(false);
        removeStorageItem("guestToken", useSessionStorage);
        setGuestToken(null);

        router.push("/dashboard/user");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleOAuthMessage);
      return () => window.removeEventListener("message", handleOAuthMessage);
    }
    return undefined;
  }, [router, useSessionStorage]);

  const login = async (
    email: string,
    password: string,
    type: "user" | "client" | "employee",
    rememberMe: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setUseSessionStorage(!rememberMe);

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

      setStorageItem("authToken", response.data.token, !rememberMe);
      setStorageItem("userType", type, !rememberMe);
      setStorageItem("userId", response.data.id || "", !rememberMe);

      setIsAuthenticated(true);
      setUserType(type);
      setUserData(response.data);

      setIsGuest(false);
      removeStorageItem("guestToken", !rememberMe);
      setGuestToken(null);

      router.push(
        type === "employee"
          ? "/dashboard/admin"
          : type === "client"
          ? "/dashboard/client"
          : "/dashboard/user"
      );

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

      setStorageItem("authToken", response.data.token);
      setStorageItem("userType", type);
      setStorageItem("userId", response.data.id || "");

      setIsAuthenticated(true);
      setUserType(type);
      setUserData(response.data);

      setIsGuest(false);
      removeStorageItem("guestToken", useSessionStorage);
      setGuestToken(null);

      router.push(
        (type as "user" | "client" | "employee") === "employee"
          ? "/dashboard/admin"
          : type === "client"
          ? "/dashboard/client"
          : "/dashboard/user"
      );

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

      removeStorageItem("authToken", useSessionStorage);
      removeStorageItem("userType", useSessionStorage);
      removeStorageItem("userId", useSessionStorage);

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
    const token = getStorageItem("authToken", useSessionStorage);
    const storedUserType = getStorageItem("userType", useSessionStorage) as
      | "user"
      | "client"
      | "employee"
      | null;
    const userId = getStorageItem("userId", useSessionStorage);

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
      removeStorageItem("authToken", useSessionStorage);
      removeStorageItem("userType", useSessionStorage);
      removeStorageItem("userId", useSessionStorage);
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
        `${process.env.NEXT_PUBLIC_API_URL}/guest_sessions`,
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
      setStorageItem("guestToken", newToken, useSessionStorage);
      setGuestToken(newToken);
      setIsGuest(true);

      return newToken;
    } catch (error) {
      console.error("Error creating guest session:", error);
      const fallbackToken = `guest-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      setStorageItem("guestToken", fallbackToken, useSessionStorage);
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
