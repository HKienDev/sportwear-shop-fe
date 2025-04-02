"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  handleLogin: (email: string, password: string) => Promise<void>;
  error: string;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin, error, loading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data.email, data.password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col items-center w-full max-w-md"
    >
      {/* Error Message */}
      {error && (
        <div className="text-red-500 font-semibold text-sm">{error}</div>
      )}

      {/* Email Input */}
      <div className="flex flex-col w-full relative">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-black placeholder-gray-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col w-full relative">
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Mật khẩu"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-black placeholder-gray-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Links */}
      <div className="flex justify-between w-full text-sm text-gray-700">
        <Link href="/auth/forgot-password" className="hover:text-red-600">
          Quên mật khẩu?
        </Link>
        <Link href="/auth/register" className="font-medium hover:text-red-600">
          Đăng ký ngay
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 font-semibold shadow-lg transition-all"
      >
        {loading ? "Đang đăng nhập..." : "Tiếp tục"}
      </button>
    </form>
  );
};

export default LoginForm;