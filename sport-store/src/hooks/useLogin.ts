import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:4000/api/auth",
  withCredentials: true, // Đảm bảo gửi cookies
});

export const useLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      router.push('/'); // Chuyển hướng nếu đã đăng nhập
    }
  }, [router]);

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
      const response = await api.post('/login', { username, password });
      const { accessToken, user } = response.data;

      // Lưu accessToken vào localStorage
      localStorage.setItem('accessToken', accessToken);

      console.log("✅ Login successful. User:", user);
      router.push('/');
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Lỗi server' : 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  };
};