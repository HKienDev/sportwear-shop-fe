import React from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/hooks/useLogin';

const LoginForm = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="text-center text-sm">
        <span className="text-gray-600">Chưa có tài khoản? </span>
        <Link href="/user/auth/register" className="font-bold text-red-600 hover:text-blue-500">
          Đăng ký ngay
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
            className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
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
            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/user/auth/forgot-password-email-1" className="text-base text-black hover:text-blue-500">
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;