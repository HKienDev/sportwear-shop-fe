import { Metadata } from 'next';
import PromotionsClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Khuyến Mãi - Khánh Hoàn Shop',
  description: 'Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí mua sắm tại Khánh Hoàn Shop. Tìm kiếm và sử dụng các mã khuyến mãi tốt nhất.',
  keywords: 'khuyến mãi, mã giảm giá, ưu đãi, Khánh Hoàn Shop, thể thao, mua sắm',
  openGraph: {
    title: 'Khuyến Mãi - Khánh Hoàn Shop',
    description: 'Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí mua sắm tại Khánh Hoàn Shop.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function PromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PromotionsClientLayout>{children}</PromotionsClientLayout>;
} 