import { useRouter } from 'next/navigation';

export interface ErrorInfo {
  message: string;
  status?: number;
  type?: 'not-found' | 'server-error' | 'unauthorized' | 'unknown';
}

export const getErrorType = (error: Error | string): ErrorInfo => {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();
  
  // Check for 404 errors
  if (lowerMessage.includes('404') || 
      lowerMessage.includes('not found') || 
      lowerMessage.includes('page not found') ||
      lowerMessage.includes('route not found')) {
    return {
      message,
      status: 404,
      type: 'not-found'
    };
  }
  
  // Check for 401/403 errors
  if (lowerMessage.includes('401') || 
      lowerMessage.includes('unauthorized') || 
      lowerMessage.includes('access denied') ||
      lowerMessage.includes('403') ||
      lowerMessage.includes('forbidden')) {
    return {
      message,
      status: 401,
      type: 'unauthorized'
    };
  }
  
  // Check for 500 errors
  if (lowerMessage.includes('500') || 
      lowerMessage.includes('server error') || 
      lowerMessage.includes('internal server error') ||
      lowerMessage.includes('internal error')) {
    return {
      message,
      status: 500,
      type: 'server-error'
    };
  }
  
  // Default to server error
  return {
    message,
    status: 500,
    type: 'server-error'
  };
};

export const redirectToErrorPage = (error: Error | string) => {
  const errorInfo = getErrorType(error);
  
  switch (errorInfo.type) {
    case 'not-found':
      window.location.href = '/error-pages/not-found';
      break;
    case 'unauthorized':
      window.location.href = '/error-pages/unauthorized';
      break;
    case 'server-error':
    default:
      window.location.href = '/error-pages/server-error';
      break;
  }
};

export const useErrorRedirect = () => {
  const router = useRouter();
  
  const redirectToError = (error: Error | string) => {
    const errorInfo = getErrorType(error);
    
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
  
  return { redirectToError, getErrorType };
}; 