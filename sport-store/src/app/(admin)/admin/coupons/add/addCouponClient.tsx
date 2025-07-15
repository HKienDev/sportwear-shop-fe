"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import CouponForm from "@/components/admin/coupons/add/couponForm";

export default function AddCouponClient() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (user.role !== "admin") {
            router.push("/");
            return;
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
            {/* Glass Morphism Wrapper */}
            <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Header with Enhanced 3D-like Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight relative">
                                        Thêm Mã Giảm Giá Mới
                                        <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                                    </h1>
                                    <p className="text-indigo-100 mt-3 text-lg">
                                        Điền thông tin chi tiết về mã giảm giá của bạn
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-white text-sm font-medium">Chế độ tạo mới</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/60 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <CouponForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 