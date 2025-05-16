import { Metadata } from 'next';
import CouponDetailClient from './couponDetailClient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
        router.push('/admin/login');
        return null;
    }

    return <CouponDetailClient id={id} />;
} 