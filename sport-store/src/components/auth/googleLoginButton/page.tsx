"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const GoogleLoginButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; 

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-72 py-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          width={20}
          height={20}
          priority
          unoptimized
        />
        Đăng nhập với Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;