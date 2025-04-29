"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import CouponFilter from "@/components/admin/coupons/list/couponFilter";

export default function CouponListPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

    const fetchCouponsWithStatus = useCallback(async (status: string | undefined) => {
        try {
            setLoading(true);
            const response = await couponService.getCoupons({
                search: searchQuery,
                status: status,
            });

            if (response.success && response.data) {
                setCoupons(response.data.coupons);
            } else {
                toast.error("Không thể tải danh sách mã giảm giá");
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Đã xảy ra lỗi khi tải danh sách mã giảm giá");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const fetchCoupons = useCallback(async () => {
        let apiStatus = undefined;
        if (statusFilter === "Hoạt động") {
            apiStatus = "active";
        } else if (statusFilter === "Tạm Dừng") {
            apiStatus = "inactive";
        } else if (statusFilter === "Hết hạn") {
            apiStatus = "expired";
        }
        
        await fetchCouponsWithStatus(apiStatus);
    }, [statusFilter, fetchCouponsWithStatus]);

    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (user.role !== "admin") {
            router.push("/");
            return;
        }

        fetchCoupons();
    }, [user, router, fetchCoupons]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        fetchCouponsWithStatus(status === "Hoạt động" ? "active" : 
                             status === "Tạm Dừng" ? "inactive" : 
                             status === "Hết hạn" ? "expired" : undefined);
    };

    const handleSelectCoupon = (couponId: string) => {
        setSelectedCoupons((prev) =>
            prev.includes(couponId)
                ? prev.filter((id) => id !== couponId)
                : [...prev, couponId]
        );
    };

    const handleSelectAll = () => {
        if (selectedCoupons.length === coupons.length) {
            setSelectedCoupons([]);
        } else {
            setSelectedCoupons(coupons.map((coupon) => coupon._id));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
            return;
        }

        try {
            const response = await couponService.deleteCoupon(id);
            if (response.success) {
                toast.success("Xóa mã giảm giá thành công");
                fetchCoupons();
            } else {
                toast.error(response.message || "Không thể xóa mã giảm giá");
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Đã xảy ra lỗi khi xóa mã giảm giá");
        }
    };

    const handlePause = async (id: string) => {
        try {
            const response = await couponService.pauseCoupon(id);
            if (response.success) {
                toast.success("Tạm dừng mã giảm giá thành công");
                fetchCoupons();
            } else {
                toast.error(response.message || "Không thể tạm dừng mã giảm giá");
            }
        } catch (error) {
            console.error("Error pausing coupon:", error);
            toast.error("Đã xảy ra lỗi khi tạm dừng mã giảm giá");
        }
    };

    const handleActivate = async (id: string) => {
        try {
            const response = await couponService.activateCoupon(id);
            if (response.success) {
                toast.success("Kích hoạt mã giảm giá thành công");
                fetchCoupons();
            } else {
                toast.error(response.message || "Không thể kích hoạt mã giảm giá");
            }
        } catch (error) {
            console.error("Error activating coupon:", error);
            toast.error("Đã xảy ra lỗi khi kích hoạt mã giảm giá");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40">
            {/* Glass Morphism Wrapper */}
            <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header with 3D-like Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-indigo-600 opacity-5 rounded-2xl transform -rotate-1"></div>
                    <div className="absolute inset-0 bg-emerald-600 opacity-5 rounded-2xl transform rotate-1"></div>
                    <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
                        <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-6 sm:p-8">
                            <h1 className="text-3xl font-bold text-white tracking-tight relative">
                                Quản lý mã giảm giá
                                <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                            </h1>
                            <p className="text-indigo-50 mt-2 max-w-2xl text-opacity-90">Quản lý và theo dõi các mã giảm giá trong hệ thống</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6">
                    <CouponFilter 
                        searchTerm={searchQuery}
                        onSearchChange={handleSearch}
                        statusFilter={statusFilter}
                        onStatusFilterChange={handleFilter}
                        onAddCoupon={() => router.push("/admin/coupons/create")}
                    />
                </div>

                {/* Bulk Actions - With Animation */}
                {selectedCoupons.length > 0 && (
                    <div 
                        className="mb-6 relative overflow-hidden" 
                        style={{
                            animation: "slideInFromTop 0.3s ease-out forwards"
                        }}
                    >
                        <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform rotate-1"></div>
                        <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform -rotate-1"></div>
                        <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-rose-100 p-4 relative z-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-semibold mr-3">
                                        {selectedCoupons.length}
                                    </span>
                                    <span className="text-slate-700">mã giảm giá đã được chọn</span>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setSelectedCoupons([])}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 flex items-center text-sm"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        Bỏ chọn
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section with Glass Effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 opacity-5 rounded-2xl transform rotate-1"></div>
                    <div className="absolute inset-0 bg-emerald-500 opacity-5 rounded-2xl transform -rotate-1"></div>
                    <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center">
                                <div className="loading-animation">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                                <p className="mt-6 text-slate-500 font-medium">Đang tải dữ liệu...</p>
                                <style jsx>{`
                                    .loading-animation {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        gap: 8px;
                                    }
                                    
                                    .dot {
                                        width: 12px;
                                        height: 12px;
                                        border-radius: 50%;
                                        background: linear-gradient(to right, #4f46e5, #10b981);
                                        animation: bounce 1.5s infinite ease-in-out;
                                    }
                                    
                                    .dot:nth-child(1) {
                                        animation-delay: 0s;
                                    }
                                    
                                    .dot:nth-child(2) {
                                        animation-delay: 0.2s;
                                    }
                                    
                                    .dot:nth-child(3) {
                                        animation-delay: 0.4s;
                                    }
                                    
                                    @keyframes bounce {
                                        0%, 80%, 100% { transform: scale(0); }
                                        40% { transform: scale(1); }
                                    }
                                `}</style>
                            </div>
                        ) : (
                            <CouponTable
                                coupons={coupons}
                                selectedCoupons={selectedCoupons}
                                onSelectCoupon={handleSelectCoupon}
                                onSelectAll={handleSelectAll}
                                onDelete={handleDelete}
                                onPause={handlePause}
                                onActivate={handleActivate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}