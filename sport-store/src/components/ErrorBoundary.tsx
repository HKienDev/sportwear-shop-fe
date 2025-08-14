'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorType } from '@/utils/errorHandler';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props & { router: unknown }, State> {
  constructor(props: Props & { router: unknown }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    const errorInfoType = getErrorType(error.message);
    
    switch (errorInfoType.type) {
      case 'not-found':
        this.props.router.replace('/error-pages/not-found');
        break;
      case 'unauthorized':
        this.props.router.replace('/error-pages/unauthorized');
        break;
      case 'server-error':
      default:
        this.props.router.replace('/error-pages/server-error');
        break;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide router
export default function ErrorBoundaryWrapper({ children }: Props) {
  const router = useRouter();
  
  return (
    <ErrorBoundary router={router}>
      {children}
    </ErrorBoundary>
  );
} 