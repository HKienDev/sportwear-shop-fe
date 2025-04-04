import { Metadata } from 'next';
import CouponDetailClient from './couponDetailClient';

export const metadata: Metadata = {
    title: 'Chi Tiết Mã Giảm Giá | Admin Dashboard',
    description: 'Xem và chỉnh sửa thông tin mã giảm giá'
};

interface PageProps {
    params: {
        id: string;
    };
}

export default async function CouponDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <CouponDetailClient id={id} />;
} 