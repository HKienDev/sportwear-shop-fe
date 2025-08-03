import { Metadata } from 'next';
import PromotionsClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Khuyến Mãi - VJU SPORT',
  description: 'Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí mua sắm tại VJU SPORT. Tìm kiếm và sử dụng các mã khuyến mãi tốt nhất.',
  keywords: 'khuyến mãi, mã giảm giá, ưu đãi, VJU SPORT, thể thao, mua sắm',
  openGraph: {
    title: 'Khuyến Mãi - VJU SPORT',
    description: 'Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí mua sắm tại VJU SPORT.',
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