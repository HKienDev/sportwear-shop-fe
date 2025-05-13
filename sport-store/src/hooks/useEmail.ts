import { useState } from 'react';
import { render } from '@react-email/render';
import axios from 'axios';
import { API_URL } from '@/utils/api';
import { OrderEmailProps } from '@/components/emails/NewOrderEmail';
import React from 'react';

interface SendEmailParams {
  to: string;
  subject: string;
  template: React.ComponentType<OrderEmailProps>;
  templateProps: OrderEmailProps;
}

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async ({ to, subject, template: Template, templateProps }: SendEmailParams) => {
    setLoading(true);
    setError(null);

    try {
      // Render template thành HTML
      const html = render(React.createElement(Template, templateProps));

      // Gửi request đến BE
      const response = await axios.post(
        `${API_URL}/api/email/send`,
        {
          to,
          subject,
          html
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
}; 