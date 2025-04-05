import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const GoogleAuthCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;  // Lấy token từ URL (query string)
    if (token) {
      // Lưu token vào localStorage (hoặc cookie nếu cần)
      localStorage.setItem('token', token as string);

      // Sau khi lưu token, chuyển hướng đến trang chủ (hoặc trang bạn muốn)
      router.push('/');
    } else {
      // Nếu không có token, chuyển hướng về trang login hoặc báo lỗi
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>Đang xử lý đăng nhập...</div>
    </div>
  );
};

export default GoogleAuthCallback;