'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '@/components/GoogleLoginButton/page';
import LoginForm from '@/components/LoginForm/page';

const LoginPage = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[calc(100vw-40px)] h-[calc(100vh-40px)] bg-white rounded-[12px] shadow-lg overflow-hidden flex">
          <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-gray-900/30">
              <Image src="/image.png" alt="Sports Player" layout="fill" objectFit="cover" priority />
            </div>
          </div>

          <div className="w-full bg-white lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="text-4xl text-black font-bold">Đăng nhập</h2>
              </div>

              <LoginForm />

              <div className="flex justify-center mt-4">
                <GoogleLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;