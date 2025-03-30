"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  refreshAccessToken: async () => null,
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    console.log("Logout called");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.replace("/auth/login");
  }, [router]);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Refresh Token không hợp lệ:", response.status);
        return null;
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error("Lỗi kết nối API refresh token:", error);
    }
    return null;
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    const currentPath = window.location.pathname;

    const exemptPaths = [
      "/auth/login",
      "/auth/otpVerifyRegister",
      "/auth/forgotPasswordEmail",
    ];
    if (exemptPaths.includes(currentPath)) {
      setLoading(false);
      return;
    }

    if (storedUser && token) {
      setUser(JSON.parse(storedUser) as User);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            const userData = {
              id: data.user.id,
              name: data.user.name || data.user.email,
              email: data.user.email,
              avatar: data.user.avatar,
              role: data.user.role
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else if (res.status === 401) {
          console.warn("Access token expired, trying to refresh...");
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            console.warn("Failed to refresh token, logging out...");
            logout();
          } else {
            console.log("Token refreshed successfully");
            const resAfterRefresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/check`, {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              credentials: "include",
            });
            
            if (resAfterRefresh.ok) {
              const data = await resAfterRefresh.json();
              if (data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
              }
            } else {
              logout();
            }
          }
        } else {
          console.warn("Unexpected error, logging out...");
          logout();
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        logout();
      }
    } else {
      console.log("No user found, logging out");
      logout();
    }
    setLoading(false);
  }, [logout, refreshAccessToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData: User, accessToken: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);

    if (userData.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/user");
    }
  }, [router]);

  const value = {
    user,
    loading,
    setUser,
    login,
    logout,
    refreshAccessToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};