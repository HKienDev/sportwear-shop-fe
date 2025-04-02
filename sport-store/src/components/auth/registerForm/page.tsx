"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

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
        "http://localhost:4000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        localStorage.setItem("registerEmail", formData.email);
        alert(response.data.message);
        window.location.href = "/auth/otpVerifyRegister";
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        setError(
          status === 400 && data.message === "Email đã tồn tại"
            ? "Email này đã được sử dụng. Vui lòng chọn email khác."
            : data.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
        );
      } else {
        setError("Lỗi không xác định. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col items-center w-full max-w-md"
    >
      {/* Error Message */}
      {error && (
        <div className="text-red-500 font-semibold text-sm text-center">
          {error}
        </div>
      )}

      {/* Input Fields */}
      {[
        {
          label: "Họ và tên",
          id: "fullName",
          placeholder: "Nhập họ và tên",
          type: "text",
        },
        {
          label: "Số điện thoại",
          id: "phoneNumber",
          placeholder: "Nhập số điện thoại",
          type: "tel",
        },
        {
          label: "Tên đăng nhập",
          id: "username",
          placeholder: "Nhập tên đăng nhập",
          type: "text",
        },
        {
          label: "Email",
          id: "email",
          placeholder: "Nhập email",
          type: "email",
        },
      ].map(({ id, placeholder, type }) => (
        <div key={id} className="flex flex-col w-full relative">
          <input
            id={id}
            name={id}
            type={type}
            value={formData[id as keyof typeof formData]}
            onChange={(e) =>
              setFormData({ ...formData, [id]: e.target.value })
            }
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-black placeholder-gray-500"
          />
        </div>
      ))}

      {/* Password Input */}
      <div className="flex flex-col w-full relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Nhập mật khẩu"
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm text-black placeholder-gray-500"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 font-semibold shadow-lg transition-all"
      >
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
};

export default RegisterForm;