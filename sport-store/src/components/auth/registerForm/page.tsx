"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validatePassword = (password: string) => /^(?=.*[A-Z]).{8,25}$/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, tối đa 25 ký tự và chứa ít nhất 1 chữ in hoa.');
      return;
    }

    setLoading(true);
    try {
      const newUser = { username, email, password, fullName, phoneNumber };
      const response = await axios.post('http://localhost:4000/api/auth/register', newUser, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        localStorage.setItem('registerEmail', email);
        alert(response.data.message);
        window.location.href = '/auth/otpVerifyRegister';
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        setError(status === 400 && data.message === 'Email đã tồn tại' ? 'Email này đã được sử dụng. Vui lòng chọn email khác.' : data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      } else {
        setError('Lỗi không xác định. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-center">{error}</div>}

      {[{ label: 'Họ và tên', value: fullName, setter: setFullName, id: 'fullName' },
        { label: 'Số điện thoại', value: phoneNumber, setter: setPhoneNumber, id: 'phoneNumber', type: 'tel' },
        { label: 'Tên đăng nhập', value: username, setter: setUsername, id: 'username' },
        { label: 'Email', value: email, setter: setEmail, id: 'email', type: 'email' }
      ].map(({ label, value, setter, id, type = 'text' }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={`Nhập ${label.toLowerCase()}`}
            className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}

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
            className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-2 px-4 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md">
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default RegisterForm;