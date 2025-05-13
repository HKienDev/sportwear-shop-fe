"use client";

import React, { useState } from "react";
import { Eye, EyeOff, User, Phone, AtSign, Mail, Lock } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/utils/api";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z]).{8,25}$/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(formData.password)) {
      setError(
        "Mật khẩu phải có ít nhất 8 ký tự, tối đa 25 ký tự và chứa ít nhất 1 chữ in hoa."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullname: formData.fullName,
          phone: formData.phoneNumber
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        window.location.href = "/auth/login";
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.errors) {
          const errorMessage = data.errors[0]?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
          setError(errorMessage);
        } else {
          setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      label: "Họ và tên",
      id: "fullName",
      placeholder: "Nguyễn Văn A",
      type: "text",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Số điện thoại",
      id: "phoneNumber",
      placeholder: "0912345678",
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
    },
    {
      label: "Tên đăng nhập",
      id: "username",
      placeholder: "username",
      type: "text",
      icon: <AtSign className="h-4 w-4" />,
    },
    {
      label: "Email",
      id: "email",
      placeholder: "example@gmail.com",
      type: "email",
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col items-center w-full max-w-md"
    >
      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 flex items-start">
          <div className="flex-shrink-0 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>{error}</div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4 w-full">
        {inputFields.map(({ id, placeholder, type, icon }) => (
          <div key={id} className="relative w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                {icon}
              </div>
              <input
                id={id}
                name={id}
                type={type}
                value={formData[id as keyof typeof formData]}
                onChange={(e) =>
                  setFormData({ ...formData, [id]: e.target.value })
                }
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>
        ))}

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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-sm text-black placeholder-gray-500 bg-white hover:bg-gray-50 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-1">
            Mật khẩu phải có ít nhất 8 ký tự và 1 chữ in hoa
          </p>
        </div>
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
            Đang đăng ký...
          </span>
        ) : (
          "Đăng ký"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;