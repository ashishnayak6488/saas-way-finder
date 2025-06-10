"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  JSX,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { showToast } from "@/lib/toastUtils";

// --------- Types ---------

interface User {
  id: string;
  username: string;
  email: string;
  // Add any additional user fields here
}

interface Credentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  redirect?: string;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authChecked: boolean;
  login: (credentials: Credentials) => Promise<LoginResponse>;
  logout: () => Promise<boolean>;
  isPublicRoute: (path: string) => boolean;
  checkAuth: () => Promise<any>;
  // Additional properties for internal use
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthChecked: React.Dispatch<React.SetStateAction<boolean>>;
  authCheckPromiseRef: React.MutableRefObject<Promise<any> | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --------- Context ---------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const authCheckPromiseRef = useRef<Promise<any> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = (path: string): boolean => {
    const publicRoutes = [
      "/",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/createpassword",
      "/otpverify",
      "/termandcondition",
    ];
    return publicRoutes.some(
      (route) => path === route || path.startsWith(route)
    );
  };

  const checkAuth = async (): Promise<any> => {
    // If auth is already being checked, return the existing promise
    if (authCheckPromiseRef.current) {
      return authCheckPromiseRef.current;
    }

    // If auth has already been checked and we're not loading, don't check again
    if (authChecked && !loading) {
      return Promise.resolve({ isLoggedIn: isAuthenticated, user });
    }

    setLoading(true);

    authCheckPromiseRef.current = fetch("/api/check-auth", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.isLoggedIn && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);

          // Only redirect to dashboard if we're on a public route and authenticated
          if (
            isPublicRoute(pathname) &&
            (pathname === "/" || pathname === "/login")
          ) {
            router.push("/dashboard");
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);

          // Only redirect to login if we're on a protected route
          if (!isPublicRoute(pathname)) {
            router.push("/login");
          }
        }

        setAuthChecked(true);
        return data;
      })
      .catch((error) => {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
        setAuthChecked(true);

        // Only redirect to login if we're on a protected route
        if (!isPublicRoute(pathname)) {
          router.push("/login");
        }

        return { isLoggedIn: false, error: error.message };
      })
      .finally(() => {
        setLoading(false);
        // Clear the promise reference after a short delay
        setTimeout(() => {
          authCheckPromiseRef.current = null;
        }, 300);
      });

    return authCheckPromiseRef.current;
  };

  // Initial auth check on mount and pathname changes
  useEffect(() => {
    // Only run auth check if we haven't checked yet or if we're on a different route
    if (!authChecked || (authChecked && !loading)) {
      checkAuth();
    }
  }, [pathname]);

  // Initialize auth check on component mount
  useEffect(() => {
    // Check localStorage for quick initial state (optional optimization)
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true" && !authChecked) {
      checkAuth();
    } else if (!authChecked) {
      checkAuth();
    }
  }, []);

  const login = async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      setLoading(true);

      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("username", credentials.username);
      urlEncodedData.append("password", credentials.password);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Update auth state
      setIsAuthenticated(true);
      setUser(data.user || null);
      setAuthChecked(true);
      localStorage.setItem("isAuthenticated", "true");

      // Clear any existing auth check promise
      authCheckPromiseRef.current = null;

      showToast.success("Login successful!");
      return { success: true, redirect: "/dashboard" };
    } catch (error: any) {
      console.error("Login error:", error);
      showToast.error(error.message || "Login failed");
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear local state regardless of API response
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(false);
      authCheckPromiseRef.current = null;

      router.push("/login");
      showToast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);

      // Still clear local state even if API call fails
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(false);
      authCheckPromiseRef.current = null;

      router.push("/login");
      showToast.error("Logout completed with errors");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    authChecked,
    login,
    logout,
    isPublicRoute,
    checkAuth,
    setUser,
    setIsAuthenticated,
    setAuthChecked,
    authCheckPromiseRef,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
