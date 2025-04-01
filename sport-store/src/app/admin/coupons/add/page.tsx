import { Metadata } from 'next';
import CouponForm from '@/components/admin/coupons/add/couponForm';

export const metadata: Metadata = {
    title: 'Thêm Mã Giảm Giá | Admin Dashboard',
    description: 'Thêm mã giảm giá mới vào hệ thống'
};

export default function AddCouponPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Thêm Mã Giảm Giá</h1>
                <p className="text-muted-foreground mt-2">
                    Tạo mã giảm giá mới để khuyến khích khách hàng mua sắm
                </p>
            </div>
            <CouponForm />
        </div>
    );
} 