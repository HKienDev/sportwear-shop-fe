import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  handleLogin: (username: string, password: string) => Promise<void>;
  error: string;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin, error, loading }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
      {error && <div className="text-red-500 font-semibold">{error}</div>}

      <div className="space-y-6">
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
            placeholder="Tên đăng nhập"
            className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

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

      <div className="flex justify-between w-72">
        <a href="/auth/forgotPasswordEmail" className="text-sm text-red-600 hover:underline">Quên mật khẩu?</a>
        <a href="/auth/register" className="text-sm font-medium text-black hover:text-red-600">Đăng ký ngay</a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-72 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 font-semibold shadow-lg"
      >
        {loading ? 'Đang đăng nhập...' : 'Tiếp tục'}
      </button>
    </form>
  );
};

export default LoginForm;