'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

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
    inputRefs.current[0]?.focus();
    
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
      
      const response = await fetch('http://localhost:4000/api/auth/resend-otp', {
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

      // Gửi tất cả dữ liệu trong một request
      const resetResponse = await fetch('http://localhost:4000/api/auth/verify-forgot-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp: otpString,
          newPassword
        })
      });

      console.log('Trạng thái đặt lại mật khẩu:', resetResponse.status);
      
      // Log response để debug
      const resetResponseText = await resetResponse.text();
      console.log('Phản hồi gốc từ reset-password:', resetResponseText);
      
      let resetData;
      try {
        resetData = JSON.parse(resetResponseText);
        console.log('Dữ liệu phản hồi đặt lại mật khẩu:', resetData);
      } catch (e) {
        console.error('Lỗi khi parse phản hồi reset:', e);
        if (resetResponse.ok) {
          // Nếu status ok nhưng không phải JSON, có thể là phản hồi thành công không có body
          resetData = { success: true };
        } else {
          throw new Error('Phản hồi từ server không hợp lệ');
        }
      }

      if (!resetResponse.ok) {
        // Xử lý lỗi chi tiết
        let errorMessage = 'Không thể đặt lại mật khẩu';
        if (resetData && resetData.message) {
          errorMessage = resetData.message;
        } else if (resetResponse.status === 401) {
          errorMessage = 'Token xác thực không hợp lệ hoặc đã hết hạn';
        } else if (resetResponse.status === 400) {
          errorMessage = 'Thiếu thông tin cần thiết';
        }
        throw new Error(errorMessage);
      }

      // Xóa dữ liệu đã lưu
      localStorage.removeItem('forgotPasswordEmail');
      
      // Chuyển hướng đến trang xác nhận
      router.push('/user/auth/forgotPasswordSucces');
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Cài lại mật khẩu</h2>
          {email ? (
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi mã đến <span className="text-blue-600">{email}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Vui lòng nhập mã OTP đã gửi đến email của bạn
            </p>
          )}
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
        {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  className="w-10 sm:w-14 h-10 sm:h-14 text-center text-xl sm:text-2xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="text-center text-sm mb-6">
              <span className="text-gray-500">Không nhận được mã? </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            disabled={isLoading || 
              otp.some(digit => !digit) || 
              !formData.newPassword || 
              !formData.confirmPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Cài lại mật khẩu'}
          </button>
        </form>

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