'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import GoogleLoginButton from '@/components/GoogleLoginButton/page';

const RegisterTemplate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z]).{8,25}$/; 
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, tối đa 25 ký tự và chứa ít nhất 1 chữ in hoa.');
      return;
    }
  
    setLoading(true);
    try {
      const newUser = { username, email, password };
  
      await axios.post('http://localhost:4000/api/auth/register', newUser, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Lưu email vào localStorage
      localStorage.setItem('registerEmail', email);
  
      alert('Xác thực đăng ký...');
      window.location.href = '/user/auth/otp-verify-register';
    } catch (err: unknown) {
      console.error('Lỗi khi gọi API:', err);
  
      if (err instanceof Error && 'response' in err && err.response && typeof err.response === 'object') {
        const response = err.response as { status?: number };
  
        if (response.status === 401) {
          setError('Bạn không có quyền truy cập. Vui lòng kiểm tra lại.');
        } else {
          setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      } else {
        setError('Lỗi không xác định. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[calc(100vw-40px)] h-[calc(100vh-40px)] bg-white rounded-[12px] shadow-lg overflow-hidden flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/30">
            <Image src="/messi.png" alt="Sports Player" layout="fill" objectFit="cover" priority />
          </div>
        </div>

        <div className="w-full bg-white lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-4xl text-black font-bold">Đăng ký</h2>
            </div>

            {/* Nút Đăng nhập với Google */}
            <GoogleLoginButton/>

            {/* Chữ "Hoặc" với gạch ngang 2 bên */}
            <div className="flex items-center gap-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="text-sm font-medium text-black">Hoặc</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-500 text-center">{error}</div>}

              <div className="space-y-6">
                {/* Input: Tên đăng nhập */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Input: Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Input: Mật khẩu */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Nút Đăng ký */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>


              <div className="text-center text-sm">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link href="/user/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTemplate;