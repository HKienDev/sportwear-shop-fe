import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from '@/context/authContext';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/config/constants";
import type { LoginRequest } from '@/types/auth';
import type { AxiosError } from 'axios';
import { handleRedirect } from "@/utils/navigationUtils";

export const useLogin = () => {
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      } else {
        setError(result.message || ERROR_MESSAGES.INVALID_CREDENTIALS);
        toast.error(result.message || ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Login error:', error);
      const errorMessage = axiosError?.response?.data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await handleLogin({ email, password });
      // Xử lý chuyển hướng: luôn lấy user từ context
      await handleRedirect(router, user, window.location.pathname);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
    handleLogin
  };
};