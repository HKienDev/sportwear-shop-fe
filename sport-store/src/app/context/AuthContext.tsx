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
    router.push("/");
  }, [router]);

  // ✅ Dùng lại accessToken khi reload
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      const currentPath = window.location.pathname;

      // 🛠️ Không tự logout nếu đang ở trang OTP hoặc Quên mật khẩu
      const exemptPaths = [
        "/user/auth/otp-verify-register",
        "/user/auth/forgot-password-email-1"
      ];
      if (exemptPaths.includes(currentPath)) {
        setIsLoading(false);
        return;
      }

      if (storedUser && token) {
        setUser(JSON.parse(storedUser) as User);
        try {
          const res = await fetch("http://localhost:4000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            console.warn("Access token expired or invalid. Logging out...");
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
  }, [logout]);

  const login = useCallback((userData: User, accessToken: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);

    if (userData.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  }, [router]);

  const authValue = useMemo(
    () => ({ user, setUser, login, logout }),
    [user, login, logout]
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