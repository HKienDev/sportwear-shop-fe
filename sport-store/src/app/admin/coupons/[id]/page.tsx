import { Metadata } from 'next';
import CouponDetailClient from './couponDetailClient';

export const metadata: Metadata = {
    title: 'Chi Tiết Mã Giảm Giá | Admin Dashboard',
    description: 'Xem và chỉnh sửa thông tin mã giảm giá'
};

export default function CouponDetailPage({ params }: { params: { id: string } }) {
    return <CouponDetailClient id={params.id} />;
} 