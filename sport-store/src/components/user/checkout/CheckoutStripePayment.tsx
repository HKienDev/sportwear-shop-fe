'use client';

import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import StripePaymentForm from './StripePaymentForm';
import { toast } from 'sonner';

interface CheckoutStripePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function CheckoutStripePayment({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
  onPaymentError
}: CheckoutStripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const requestInProgress = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const createPaymentIntent = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      console.log('Creating payment intent for amount:', amount);

      if (requestInProgress.current) {
        console.log('Request already in progress, waiting...');
        return;
      }

      requestInProgress.current = true;

      const response = await api.post('/stripe/create-payment-intent', {
        amount: amount
      });

      if (response.data.success) {
        console.log('Payment intent created successfully:', response.data);
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
        setError('');
        setShowPaymentForm(true);
      }
    } catch (error: unknown) {
      console.error('Error creating payment intent:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
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
  }, [amount, maxRetries]);

  const handlePaymentSuccess = useCallback(() => {
    onPaymentSuccess?.();
    onClose();
  }, [onPaymentSuccess, onClose]);

  const handleRetry = useCallback(() => {
    setClientSecret('');
    setError('');
    setShowPaymentForm(false);
    requestInProgress.current = false;
    retryCount.current = 0;
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleClose = useCallback(() => {
    setClientSecret('');
    setError('');
    setShowPaymentForm(false);
    setIsLoading(false);
    requestInProgress.current = false;
    retryCount.current = 0;
    onClose();
  }, [onClose]);

  const handleStartPayment = useCallback(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-[500px] w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Thanh toán bằng thẻ</h2>
            <button 
              onClick={handleClose}
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
          ) : showPaymentForm && clientSecret ? (
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
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Số tiền thanh toán:</p>
                <p className="text-lg font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
              </div>
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Nhấn nút bên dưới để bắt đầu thanh toán</p>
                <button
                  onClick={handleStartPayment}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Bắt đầu thanh toán'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 