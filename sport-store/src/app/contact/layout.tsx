import { Metadata } from 'next';
import ContactClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Liên Hệ - Khánh Hoàn Shop',
  description: 'Liên hệ với Khánh Hoàn Shop để được tư vấn và hỗ trợ tốt nhất. Chúng tôi luôn sẵn sàng phục vụ bạn 24/7.',
  keywords: 'liên hệ, hỗ trợ, tư vấn, Khánh Hoàn Shop, thể thao, mua sắm, customer service',
  openGraph: {
    title: 'Liên Hệ - Khánh Hoàn Shop',
    description: 'Liên hệ với Khánh Hoàn Shop để được tư vấn và hỗ trợ tốt nhất.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContactClientLayout>{children}</ContactClientLayout>;
} 