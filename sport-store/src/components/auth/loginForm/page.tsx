"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { handleRedirect } from "@/utils/navigationUtils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AuthUser } from "@/types/auth";

interface LoginFormProps {
  error: string;
  loading: boolean;
}

interface ErrorField {
  field?: string;
  message: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  errors?: ErrorField[];
  data?: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

const LoginForm = ({ error, loading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation with toast
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const result = await login(email, password) as LoginResponse;
      console.log("Login result:", result); // Debug log
      
      if (!result.success) {
        // Đọc message từ errors array thay vì message chính
        const errors = result.errors || [];
        console.log("Errors array:", errors); // Debug log
        
        // Tìm lỗi cụ thể từ errors array
        const emailError = errors.find((error: ErrorField) => error.field === 'email');
        const passwordError = errors.find((error: ErrorField) => error.field === 'password');
        const generalError = errors.find((error: ErrorField) => !error.field);
        
        if (emailError) {
          toast.error(emailError.message);
        } else if (passwordError) {
          toast.error(passwordError.message);
        } else if (generalError) {
          toast.error(generalError.message || "Đăng nhập thất bại");
        } else {
          // Fallback: sử dụng message chính
          toast.error(result.message || "Đăng nhập thất bại");
        }
      } else {
        toast.success("Đăng nhập thành công!");
        await handleRedirect(router, result.data?.user ?? null, window.location.pathname);
      }
    } catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<{ message: string; errors?: ErrorField[] }>;
      const errorMessage = axiosError?.response?.data?.message?.toLowerCase() || "";
      const errors = axiosError?.response?.data?.errors || [];
      console.log("Axios error message:", errorMessage); // Debug log
      console.log("Axios errors array:", errors); // Debug log
      console.log("Axios status:", axiosError?.response?.status); // Debug log
      
      // Đọc từ errors array trước
      const emailError = errors.find((error: ErrorField) => error.field === 'email');
      const passwordError = errors.find((error: ErrorField) => error.field === 'password');
      const generalError = errors.find((error: ErrorField) => !error.field);
      
      if (emailError) {
        toast.error(emailError.message);
      } else if (passwordError) {
        toast.error(passwordError.message);
      } else if (generalError) {
        toast.error(generalError.message || "Đăng nhập thất bại");
      } else {
        // Fallback: sử dụng message từ server
        toast.error(axiosError?.response?.data?.message || "Đăng nhập thất bại");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center w-full">
      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 flex items-start">
          <div className="flex-shrink-0 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="break-words">{error}</div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4 w-full">
        {/* Email Input */}
        <div className="relative w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex justify-between w-full text-sm text-gray-700">
        <a href="/auth/forgotPasswordEmail" className="hover:text-red-600 transition-colors">
          Quên mật khẩu?
        </a>
        <a href="/auth/register" className="font-medium hover:text-red-600 transition-colors">
          Đăng ký ngay
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-70 font-medium text-sm shadow-lg transition-all transform hover:translate-y-px active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang đăng nhập...
          </span>
        ) : (
          "Tiếp tục"
        )}
      </button>
    </form>
  );
};

export default LoginForm;