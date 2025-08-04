'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging
    console.error('Global error caught:', error);
    
    // Không redirect cho React Hook errors
    if (error.message.includes('Invalid hook call') ||
        error.message.includes('useCallback') ||
        error.message.includes('useEffect') ||
        error.message.includes('useMemo') ||
        error.message.includes('useState') ||
        error.message.includes('useRef')) {
      // Cho React Hook errors, chỉ reset
      try {
        reset();
      } catch (resetError) {
        console.error('Reset failed:', resetError);
      }
      return;
    }
    
    // Chỉ redirect những lỗi thực sự nghiêm trọng
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('Network Error') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('500') ||
        error.message.includes('Internal Server Error')) {
      router.replace('/error-pages/server-error');
    } else {
      // Cho những lỗi khác, thử reset trước
      try {
        reset();
      } catch (resetError) {
        console.error('Reset failed:', resetError);
        router.replace('/error-pages/server-error');
      }
    }
  }, [error, router, reset]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xử lý lỗi...</p>
          </div>
        </div>
      </body>
    </html>
  );
} 