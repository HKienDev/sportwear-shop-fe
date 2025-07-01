"use client";
import CouponDetailClient from './couponDetailClient';
import { useAuth } from '@/context/authContext';
import { useRouter, useParams } from 'next/navigation';

export default function CouponDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
        router.push('/admin/login');
        return null;
    }

    return <CouponDetailClient id={id} />;
} 