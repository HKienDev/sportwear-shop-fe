'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';
import StripePaymentForm from './StripePaymentForm';
import { toast } from 'react-hot-toast';

interface CheckoutStripePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function CheckoutStripePayment({
  isOpen,
  onClose,
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError
}: CheckoutStripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const requestInProgress = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const createPaymentIntent = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      console.log('Creating payment intent for order:', orderId);

      if (requestInProgress.current) {
        console.log('Request already in progress, waiting...');
        return;
      }

      requestInProgress.current = true;

      const response = await api.post('/stripe/create-payment-intent', {
        orderId
      });

      if (response.data.success) {
        console.log('Payment intent created successfully:', response.data);
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
        setError('');
      }
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes('payment intent đang xử lý')) {
        toast.error('Đơn hàng đang được xử lý, vui lòng đợi trong giây lát');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms... Attempt ${retryCount + 1} of ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return createPaymentIntent(retryCount + 1);
      }

      setError('Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.');
      toast.error('Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
      requestInProgress.current = false;
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen && orderId && !clientSecret && !requestInProgress.current) {
      timeoutId = setTimeout(() => {
        createPaymentIntent();
      }, 500);
    }

    if (!isOpen) {
      setClientSecret('');
      setError('');
      requestInProgress.current = false;
      retryCount.current = 0;
    }

    return () => {
      clearTimeout(timeoutId);
      requestInProgress.current = false;
      retryCount.current = 0;
    };
  }, [isOpen, orderId]);

  const handlePaymentSuccess = useCallback(() => {
    onPaymentSuccess?.();
    onClose();
  }, [onPaymentSuccess, onClose]);

  const handleRetry = useCallback(() => {
    setClientSecret('');
    setError('');
    requestInProgress.current = false;
    retryCount.current = 0;
    createPaymentIntent();
  }, []);

  if (!isOpen) return null;

  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e6e6e6',
        boxShadow: 'none',
        fontSize: '16px'
      },
      '.Input:focus': {
        border: '1px solid #0570de',
        boxShadow: '0 1px 3px 0 #cfd7df'
      },
      '.Tab': {
        display: 'none'
      },
      '.Tab--selected': {
        display: 'block'
      },
      '.Label': {
        fontWeight: '500'
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
    loader: 'auto' as const,
    payment_method_types: ['card'] as const
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-[500px] w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Thanh toán bằng thẻ</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <p>{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={requestInProgress.current}
              >
                {requestInProgress.current ? 'Đang thử lại...' : 'Thử lại'}
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Đang tạo phiên thanh toán{retryCount.current > 0 ? ` (Lần ${retryCount.current})` : ''}...</span>
            </div>
          ) : clientSecret ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Số tiền thanh toán:</p>
                <p className="text-lg font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
              </div>
              <StripePaymentForm 
                clientSecret={clientSecret} 
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  setError(error);
                  onPaymentError?.(error);
                }}
              />
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Đang khởi tạo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 