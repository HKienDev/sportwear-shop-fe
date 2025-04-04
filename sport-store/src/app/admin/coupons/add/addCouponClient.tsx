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
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thêm mã giảm giá mới</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <CouponForm />
            </div>
        </div>
    );
} 