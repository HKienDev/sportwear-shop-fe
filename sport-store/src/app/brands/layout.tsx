import { Metadata } from 'next';
import BrandsClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Thương Hiệu Đối Tác - Khánh Hoàn Shop',
  description: 'Khám phá các thương hiệu thể thao hàng đầu thế giới với chất lượng cao và thiết kế độc đáo tại Khánh Hoàn Shop.',
  keywords: 'thương hiệu, nike, adidas, puma, thể thao, sportswear, Khánh Hoàn Shop, đối tác, premium brands',
  openGraph: {
    title: 'Thương Hiệu Đối Tác - Khánh Hoàn Shop',
    description: 'Khám phá các thương hiệu thể thao hàng đầu thế giới với chất lượng cao và thiết kế độc đáo.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BrandsClientLayout>{children}</BrandsClientLayout>;
} 