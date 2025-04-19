'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function NotAuthorizedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const shapeRef = useRef<HTMLDivElement>(null);

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!shapeRef.current) return;

      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;

      shapeRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={shapeRef} className="absolute">
          {/* Abstract red shapes */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-50 rounded-full"></div>
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-100 rounded-full opacity-70"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-200 rounded-full opacity-50"></div>

          {/* Red accent lines */}
          <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-red-500/10 via-red-500/30 to-transparent"></div>
          <div className="absolute top-2/3 right-0 h-px w-full bg-gradient-to-l from-red-500/10 via-red-500/20 to-transparent"></div>
        </div>
      </div>

      {/* Red corner accent */}
      <div className="absolute top-0 right-0 border-t-[100px] border-r-[100px] border-t-red-500 border-r-transparent opacity-90"></div>
      <div className="absolute bottom-0 left-0 border-b-[100px] border-l-[100px] border-b-red-500 border-l-transparent opacity-60"></div>

      <div className={`container max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-16 z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {/* Left side: Error illustration and animation */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <div className="relative w-72 h-72 mb-6">
            {/* Glitch effect circles */}
            <div className="absolute inset-4 bg-red-500/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-dashed border-red-300 rounded-full animate-spin-slow"></div>

            <div className="absolute inset-8 flex items-center justify-center">
              <div className="relative h-full w-full flex items-center justify-center">
                {/* 401 creative display */}
                <span className="text-8xl font-bold text-white bg-red-500 px-6 py-3 rounded-lg shadow-lg transform -rotate-6">4</span>
                <div className="relative z-10 mx-1">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center animate-bounce">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <span className="text-8xl font-bold text-white bg-red-500 px-6 py-3 rounded-lg shadow-lg transform rotate-6">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          {/* Pixel-perfect red line */}
          <div className="w-12 h-1 bg-red-500 mb-6 hidden md:block"></div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            <span className="text-red-500">Không có quyền</span> truy cập
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản có quyền phù hợp.
          </p>

          {/* Main CTA */}
          <Button
            onClick={() => router.push('/')}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 h-auto rounded-full text-lg font-semibold shadow-lg hover:shadow-red-200 transition-all duration-300"
          >
            Quay lại trang chủ
          </Button>
        </div>
      </div>

      {/* Bottom dot pattern */}
      <div
        className="absolute bottom-0 w-full h-8 bg-repeat-x"
        style={{ backgroundImage: 'radial-gradient(circle, #f87171 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      ></div>

      {/* Additional styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}