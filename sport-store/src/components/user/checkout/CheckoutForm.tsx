'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  amount: number;
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Thanh toán thành công!');
          break;
        case 'processing':
          setMessage('Đang xử lý thanh toán.');
          break;
        case 'requires_payment_method':
          setMessage('Thanh toán thất bại, vui lòng thử lại.');
          break;
        default:
          setMessage('Đã xảy ra lỗi.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/user/checkout/success`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'Đã xảy ra lỗi');
    } else {
      setMessage('Đã xảy ra lỗi không mong muốn');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <PaymentElement 
        id="payment-element" 
        options={paymentElementOptions}
      />
      <Button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        className="w-full mt-4"
      >
        {isLoading ? 'Đang xử lý...' : `Thanh toán ${amount.toLocaleString('vi-VN')}đ`}
      </Button>
      {message && <div className="mt-4 text-red-500">{message}</div>}
    </form>
  );
} 