import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "./useToast";
import axios from "axios";

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

interface ApiError {
  response?: {
    data?: {
      message: string;
    };
  };
  message: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Đang gửi request login...");
      const response = await axios.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });
      console.log("Response từ server:", response.data);

      if (response.data.success) {
        // Lưu token và thông tin user
        localStorage.setItem("accessToken", response.data.data?.accessToken || "");
        localStorage.setItem("user", JSON.stringify(response.data.data?.user));

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
          variant: "default",
        });

        // Xử lý chuyển hướng
        const redirectFrom = searchParams.get("redirect") || "/";
        window.location.href = redirectFrom;
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
        toast({
          title: "Lỗi đăng nhập",
          description: response.data.message || "Vui lòng kiểm tra lại thông tin",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      const error = err as ApiError;
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
      toast({
        title: "Lỗi đăng nhập",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
};