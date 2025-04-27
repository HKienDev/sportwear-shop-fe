"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
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
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

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
        setCurrentPage(1);
    };

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
        fetchCouponsWithStatus(status === "Hoạt động" ? "active" : 
                             status === "Tạm Dừng" ? "inactive" : 
                             status === "Hết hạn" ? "expired" : undefined);
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
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Quản lý và theo dõi các mã giảm giá trong hệ thống
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push("/admin/coupons/create")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Tạo mã giảm giá
                                </button>
                            </div>
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

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <>
                            <CouponTable
                                coupons={coupons}
                                selectedCoupons={selectedCoupons}
                                onSelectCoupon={handleSelectCoupon}
                                onSelectAll={handleSelectAll}
                                onDelete={handleDelete}
                                onPause={handlePause}
                                onActivate={handleActivate}
                            />
                            <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Trang trước
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Hiển thị <span className="font-medium">{coupons.length}</span> kết quả
                                            </p>
                                        </div>
                                        <div>
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}