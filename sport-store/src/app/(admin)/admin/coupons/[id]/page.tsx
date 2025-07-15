"use client";
import CouponDetailClient from './couponDetailClient';
import { useAuth } from '@/context/authContext';
import { useRouter, useParams } from 'next/navigation';

export default function CouponDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40 flex items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-8 shadow-xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-600 font-medium">Đang kiểm tra quyền truy cập...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Auth check
    if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/admin/login');
        return null;
    }

    return <CouponDetailClient id={id} />;
} 