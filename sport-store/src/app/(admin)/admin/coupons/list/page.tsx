"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import CouponSearch from "@/components/admin/coupons/list/couponSearch";
import CouponFilter from "@/components/admin/coupons/list/couponFilter";
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

export default function CouponListPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCouponsWithStatus = useCallback(async (status: string | undefined) => {
        try {
            setLoading(true);
            const response = await couponService.getCoupons({
                page: currentPage,
                limit: 10,
                search: searchQuery,
                status: status,
            });

            if (response.success && response.data) {
                setCoupons(response.data.coupons);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                toast.error("Không thể tải danh sách mã giảm giá");
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Đã xảy ra lỗi khi tải danh sách mã giảm giá");
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery]);

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
    }, [currentPage, searchQuery, statusFilter, fetchCouponsWithStatus]);

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
        setCurrentPage(1);
    };

    const handleFilter = (status: string | undefined) => {
        let apiStatus = undefined;
        if (status === "Hoạt động") {
            apiStatus = "active";
        } else if (status === "Tạm Dừng") {
            apiStatus = "inactive";
        } else if (status === "Hết hạn") {
            apiStatus = "expired";
        }
        
        setStatusFilter(status);
        setCurrentPage(1);
        fetchCouponsWithStatus(apiStatus);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    const handleDeleteSelected = async () => {
        if (!selectedCoupons.length) return;

        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCoupons.length} mã giảm giá đã chọn?`)) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await couponService.bulkDeleteCoupons({ couponIds: selectedCoupons });
            if (response.success) {
                toast.success(`Đã xóa ${selectedCoupons.length} mã giảm giá thành công`);
                setSelectedCoupons([]);
                fetchCoupons();
            } else {
                toast.error(response.message || "Không thể xóa mã giảm giá");
            }
        } catch (error) {
            console.error("Error deleting coupons:", error);
            toast.error("Đã xảy ra lỗi khi xóa mã giảm giá");
        } finally {
            setIsDeleting(false);
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
                            <p className="text-indigo-50 mt-2 max-w-2xl text-opacity-90">
                                Tạo, chỉnh sửa và quản lý các mã giảm giá cho cửa hàng
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <CouponFilter 
                        searchTerm={searchQuery}
                        onSearchChange={handleSearch}
                        statusFilter={statusFilter || ""}
                        onStatusFilterChange={handleFilter}
                        onAddCoupon={() => router.push("/admin/coupons/add")}
                    />
                </div>

                {/* Bulk Actions */}
                {selectedCoupons.length > 0 && (
                    <div
                        className="mb-6 relative overflow-hidden"
                        style={{
                            animation: "slideInFromTop 0.3s ease-out forwards",
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
                                        <svg
                                            className="w-4 h-4 mr-1.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                        Bỏ chọn
                                    </button>
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={isDeleting}
                                        className="group px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                                                Đang xóa...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-4 h-4 mr-1.5 group-hover:animate-bounce"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    ></path>
                                                </svg>
                                                Xóa đã chọn
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Container with Glass Effect */}
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
                                        0%,
                                        100% {
                                            transform: translateY(0);
                                        }
                                        50% {
                                            transform: translateY(-15px);
                                        }
                                    }
                                    @keyframes slideInFromTop {
                                        0% {
                                            transform: translateY(-20px);
                                            opacity: 0;
                                        }
                                        100% {
                                            transform: translateY(0);
                                            opacity: 1;
                                        }
                                    }
                                `}</style>
                            </div>
                        ) : coupons.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 relative">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-indigo-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-slate-800">Không tìm thấy mã giảm giá</h3>
                                <p className="mt-2 text-slate-500 max-w-sm">
                                    Hiện không có mã giảm giá nào phù hợp với điều kiện tìm kiếm của bạn.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setStatusFilter("");
                                    }}
                                    className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-600 rounded-lg hover:from-indigo-100 hover:to-emerald-100 transition-all duration-200 font-medium"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto relative">
                                {/* Table Scroll Shadow Effect */}
                                <div className="absolute pointer-events-none inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                                <div className="absolute pointer-events-none inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                                {/* Enhanced Table */}
                                <div className="min-w-full">
                                    <CouponTable
                                        coupons={coupons}
                                        selectedCoupons={selectedCoupons}
                                        onSelectCoupon={handleSelectCoupon}
                                        onSelectAll={handleSelectAll}
                                        onDelete={handleDelete}
                                        onPause={handlePause}
                                        onActivate={handleActivate}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}