import { Metadata } from 'next';
import AddCouponClient from './addCouponClient';

export const metadata: Metadata = {
    title: 'Thêm Mã Giảm Giá | Admin Dashboard',
    description: 'Thêm mã giảm giá mới vào hệ thống'
};

export default function AddCouponPage() {
    return <AddCouponClient />;
} 