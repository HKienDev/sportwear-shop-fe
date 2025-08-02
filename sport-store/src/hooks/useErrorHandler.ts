import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorType } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const router = useRouter();

  useEffect(() => {
    // Handle navigation errors
    const handleError = (event: ErrorEvent) => {
      console.error('Navigation error caught:', event.error);
      
      const errorInfo = getErrorType(event.error?.message || 'Unknown error');
      
      switch (errorInfo.type) {
        case 'not-found':
          router.replace('/error-pages/not-found');
          break;
        case 'unauthorized':
          router.replace('/error-pages/unauthorized');
          break;
        case 'server-error':
        default:
          router.replace('/error-pages/server-error');
          break;
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const errorInfo = getErrorType(event.reason?.message || 'Unknown error');
      
      switch (errorInfo.type) {
        case 'not-found':
          router.replace('/error-pages/not-found');
          break;
        case 'unauthorized':
          router.replace('/error-pages/unauthorized');
          break;
        case 'server-error':
        default:
          router.replace('/error-pages/server-error');
          break;
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [router]);
}; 