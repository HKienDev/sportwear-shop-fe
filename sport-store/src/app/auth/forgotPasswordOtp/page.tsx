'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { API_URL } from "@/utils/api";

export default function ForgotPasswordCombined() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    try {
      // Kiểm tra localStorage
      const storedEmail = localStorage.getItem('forgotPasswordEmail');
      console.log('Email từ localStorage:', storedEmail);
      
      // Kiểm tra URL params
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      console.log('Email từ URL:', emailParam);
      
      if (storedEmail) {
        setEmail(storedEmail);
      } else if (emailParam) {
        setEmail(emailParam);
        localStorage.setItem('forgotPasswordEmail', emailParam);
      } else {
        setError('Không tìm thấy email. Vui lòng quay lại bước nhập email.');
      }
    } catch (err) {
      console.error('Lỗi khi khởi tạo:', err);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
    
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
    
    if (!/^\d+$/.test(pastedData)) {
      setError('Mã OTP chỉ chứa các chữ số');
      return;
    }
    
    setOtp(pastedData.split('').concat(Array(6 - pastedData.length).fill('')));
    
    const nextEmptyIndex = Math.min(pastedData.length, 5);
    if (nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePassword = (password: string) => password.length >= 8;

  const handleResendCode = async () => {
    if (!email) {
      setError('Không tìm thấy email để gửi lại mã.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Đang gửi lại OTP cho email:', email);
      
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      console.log('Trạng thái phản hồi:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Dữ liệu lỗi:', errorData);
        setError(errorData.message || 'Không thể gửi lại mã OTP, vui lòng thử lại.');
      } else {
        setSuccessMessage('Mã OTP mới đã được gửi đến email của bạn.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error('Lỗi khi gửi lại OTP:', err);
      setError('Lỗi kết nối đến server, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Kiểm tra dữ liệu form
      const otpString = otp.join('');
      if (otpString.length !== 6) {
        setError('Vui lòng nhập đầy đủ mã OTP.');
        setIsLoading(false);
        return;
      }

      if (!email) {
        setError('Không tìm thấy email. Vui lòng quay lại bước trước.');
        setIsLoading(false);
        return;
      }

      // Kiểm tra mật khẩu
      const { newPassword, confirmPassword } = formData;
      
      if (!validatePassword(newPassword)) {
        setError('Mật khẩu phải có ít nhất 8 ký tự');
        setIsLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu không khớp');
        setIsLoading(false);
        return;
      }

      console.log('Đang gửi dữ liệu - Email:', email, 'OTP:', otpString);

      // Gửi request xác thực OTP và đặt lại mật khẩu
      console.log('Request data:', {
        email,
        otp: otpString,
        newPassword
      });

      try {
        const response = await axios.post(`${API_URL}/auth/reset-password`, {
          email,
          otp: otpString,
          newPassword
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Response from server:', response.data);

        if (response.data.success) {
          // Xóa dữ liệu đã lưu
          localStorage.removeItem('forgotPasswordEmail');
          
          // Chuyển hướng đến trang xác nhận
          router.push('/auth/forgotPasswordSucces');
        } else {
          console.log('Server response indicates failure:', response.data);
          setError(response.data.message || 'Không thể đặt lại mật khẩu');
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
        if (axios.isAxiosError(error)) {
          const resData = error.response?.data;
          if (resData) {
            if (typeof resData.message === 'string' && resData.message) {
              errorMessage = resData.message;
            } else if (Array.isArray(resData.errors) && resData.errors.length > 0 && resData.errors[0].message) {
              errorMessage = resData.errors[0].message;
            }
          }
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        if (resData) {
          if (typeof resData.message === 'string' && resData.message) {
            errorMessage = resData.message;
          } else if (Array.isArray(resData.errors) && resData.errors.length > 0 && resData.errors[0].message) {
            errorMessage = resData.errors[0].message;
          }
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 skew-x-12 transform origin-top-right"></div>
        <div className="absolute top-0 left-0 w-1/4 h-screen bg-gradient-to-b from-red-500/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-gradient-to-t from-red-500/5 to-transparent"></div>
        {/* Animated dots */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "3s" }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "5s", animationDelay: "0.5s" }}></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: "6s", animationDelay: "1.5s" }}></div>
        </div>
        {/* Dynamic lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="black" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Cài lại mật khẩu</h2>
          {email ? (
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi mã đến <span className="text-red-600">{email}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Vui lòng nhập mã OTP đã gửi đến email của bạn
            </p>
          )}
          {/* Animated line */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-red-500 to-gray-200 rounded-full"></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border-l-4 border-green-500 text-green-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* OTP Input Section */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Nhập mã xác thực</p>
            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-10 sm:w-14 h-10 sm:h-14 text-center text-xl sm:text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="text-center text-sm mb-6">
              <span className="text-gray-500">Không nhận được mã? </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-red-600 hover:text-red-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang gửi...' : 'Ấn để nhận lại mã'}
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4 border-t pt-6 mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Tạo mật khẩu mới</p>
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật Khẩu Mới</label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-600 focus:border-red-600"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác Nhận Mật Khẩu</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-600 focus:border-red-600"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Mật khẩu phải có ít nhất 8 ký tự</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some(digit => !digit) || !formData.newPassword || !formData.confirmPassword}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Cài lại mật khẩu'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            className="font-medium text-red-600 hover:text-red-500 px-4 py-2 rounded transition-colors"
            onClick={() => router.push('/auth/login')}
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}