import { Metadata } from 'next';
import AddCouponClient from './addCouponClient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Thêm Mã Giảm Giá | Admin Dashboard',
    description: 'Thêm mã giảm giá mới vào hệ thống'
};

export default function AddCouponPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
        router.push('/admin/login');
        return null;
    }

    return <AddCouponClient />;
} 