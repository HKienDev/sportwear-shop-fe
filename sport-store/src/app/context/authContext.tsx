"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
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
  setUser: (user: User | null) => void;
  login: (userData: User, accessToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    console.log("Logout called");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/user/auth/login");
  }, [router]);

  // Hàm làm mới token
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Đọc refreshToken từ cookies
      });

      if (!response.ok) {
        console.error("Refresh Token không hợp lệ:", response.status);
        return null;
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken); // Lưu accessToken mới
        return data.accessToken;
      }
    } catch (error) {
      console.error("Lỗi kết nối API refresh token:", error);
    }
    return null;
  }, []);

  // Kiểm tra trạng thái đăng nhập khi tải lại trang
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      const currentPath = window.location.pathname;

      // Không tự logout nếu đang ở trang đăng nhập hoặc OTP
      const exemptPaths = [
        "/user/auth/login",
        "/user/auth/otpVerifyRegister",
        "/user/auth/forgotPasswordEmail",
      ];
      if (exemptPaths.includes(currentPath)) {
        setIsLoading(false);
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
            if (data.user) {
              setUser(data.user);
              localStorage.setItem("user", JSON.stringify(data.user));
            }
          } else if (res.status === 401) {
            console.warn("Access token expired, trying to refresh...");
            const newAccessToken = await refreshAccessToken();
            if (!newAccessToken) {
              console.warn("Failed to refresh token, logging out...");
              logout();
            } else {
              console.log("Token refreshed successfully");
              // Thử lại request với token mới
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
      setIsLoading(false);
    };

    checkAuth();
  }, [logout, refreshAccessToken, router]);

  const login = useCallback((userData: User, accessToken: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);

    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }, [router]);

  const authValue = useMemo(
    () => ({ user, setUser, login, logout, refreshAccessToken }),
    [user, login, logout, refreshAccessToken]
  );

  if (isLoading) return <></>;

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};