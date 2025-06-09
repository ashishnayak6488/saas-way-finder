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
  login: (credentials: Credentials) => Promise<LoginResponse>;
  logout: () => Promise<boolean>;
  isPublicRoute: (path: string) => boolean;
  checkAuth: () => Promise<any>;
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
    if (authCheckPromiseRef.current) {
      return authCheckPromiseRef.current;
    }

    setLoading(true);

    authCheckPromiseRef.current = fetch("/api/check-auth", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setIsAuthenticated(true);
          setUser(data.user || null);
          router.push("/dashboard");
        } else {
          setIsAuthenticated(false);
          setUser(null);
          if (!isPublicRoute(pathname)) {
            router.push("/login");
          }
        }
        return data;
      })
      .catch((error) => {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
        return { isLoggedIn: false, error };
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          authCheckPromiseRef.current = null;
        }, 300);
      });

    return authCheckPromiseRef.current;
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const login = async (credentials: Credentials): Promise<LoginResponse> => {
    try {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setUser(data.user || null);
      localStorage.setItem("isAuthenticated", "true");
      authCheckPromiseRef.current = null;

      return { success: true, redirect: "/dashboard" };
    } catch (error: any) {
      showToast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(false);
      router.push("/login");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        authChecked,
        setAuthChecked,
        authCheckPromiseRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
