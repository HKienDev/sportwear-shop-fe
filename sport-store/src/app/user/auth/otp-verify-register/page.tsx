'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

export default function RegisterVerificationOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    setOtp(pastedData.split('').concat(Array(6 - pastedData.length).fill('')));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const otpString = otp.join('');
      console.log("OTP gửi đi:", otpString); // Kiểm tra OTP gửi đi

      // Gọi API xác thực OTP
      const response = await axios.post('http://localhost:4000/api/auth/verify-account', {
        email: 'abc@gmail.com', // TODO: Truyền email thực tế của user
        otp: otpString,
      });

      // Lưu token vào localStorage
      localStorage.setItem('auth_token', response.data.token);

      console.log('OTP xác thực thành công:', response.data);
      router.push('/user/auth/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Lỗi xác thực OTP:', error.response?.data?.message || error.message);
        setError(error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại.');
      } else if (error instanceof Error) {
        console.error('Lỗi không xác định:', error.message);
        setError(error.message);
      } else {
        console.error('Lỗi không xác định:', error);
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Gọi API gửi lại OTP
      await axios.post('http://localhost:4000/api/auth/resend-otp', {
        email: 'abc@gmail.com', // TODO: Truyền email thực tế của user
      });

      console.log('Mã OTP đã được gửi lại.');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Lỗi gửi lại mã OTP:', error.response?.data?.message || error.message);
        setError(error.response?.data?.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      } else if (error instanceof Error) {
        console.error('Lỗi không xác định:', error.message);
        setError(error.message);
      } else {
        console.error('Lỗi không xác định:', error);
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Xác thực đăng ký</h2>
          <p className="mt-2 text-sm text-gray-600">
            Chúng tôi đã gửi mã đến <span className="text-blue-600">abc@gmail.com</span>
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">Không nhận được mã? </span>
          <button
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Ấn để nhận lại mã
          </button>
        </div>

        <div className="text-center">
          <Link href="/user/auth/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
