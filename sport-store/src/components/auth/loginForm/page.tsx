"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface LoginFormProps {
  error: string;
  loading: boolean;
}

const LoginForm = ({ error, loading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (!result.success) {
        toast.error(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          // Lỗi từ server
          const errorMessage = error.response.data?.message;
          const errors = error.response.data?.errors;

          // Xử lý các trường hợp lỗi cụ thể
          switch (errorMessage) {
            case 'INVALID_CREDENTIALS':
              toast.error('Email hoặc mật khẩu không chính xác');
              break;
            case 'ACCOUNT_NOT_VERIFIED':
              toast.error('Tài khoản chưa được xác thực. Vui lòng kiểm tra email');
              break;
            case 'ACCOUNT_INACTIVE':
              toast.error('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ');
              break;
            case 'ACCOUNT_BLOCKED':
              toast.error('Tài khoản đã bị chặn. Vui lòng liên hệ hỗ trợ');
              break;
            default:
              // Hiển thị lỗi từ server nếu có
              if (errors && errors.length > 0) {
                toast.error(errors[0].message);
              } else {
                toast.error(errorMessage || "Lỗi server");
              }
          }
        } else if (error.request) {
          // Không nhận được response
          toast.error("Không thể kết nối đến server");
        } else {
          // Lỗi khác
          toast.error("Đăng nhập thất bại");
        }
      } else {
        toast.error("Đăng nhập thất bại");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
};

export default LoginForm;