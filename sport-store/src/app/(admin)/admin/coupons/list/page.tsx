"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";

import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import CouponFilter from "@/components/admin/coupons/list/couponFilter";
import CouponStatusCards from "@/components/admin/coupons/list/couponStatusCards";
import Pagination from "@/components/admin/coupons/list/pagination";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export default function CouponListPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const couponsPerPage = 10;

    const fetchCouponsWithStatus = useCallback(async (status: string | undefined) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...(searchQuery && { search: searchQuery }),
                ...(status && { status }),
            });
            
            const response = await fetch(`/api/coupons/admin?${params}`, {
                credentials: 'include',
            });
            
            const data = await response.json();
            if (data.success && data.data) {
                setCoupons(data.data.coupons);
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
        if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/admin/login');
        } else {
            fetchCoupons();
        }
    }, [user, router, fetchCoupons, authLoading, isAuthenticated]);

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

    // Sửa lại hàm handleDelete chỉ set id, không gọi API
    const handleDelete = async (id: string): Promise<void> => {
        setDeleteId(id);
    };

    // Hàm xác nhận xóa thực sự
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            setIsDeleting(true);
            const toastId = toast.loading("Đang xóa mã giảm giá...");
            // Cập nhật local state ngay
            setCoupons(prev => prev.filter(c => c._id !== deleteId));
            
            const response = await fetch(`/api/coupons/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Xóa mã giảm giá thành công", { id: toastId });
            } else {
                // Nếu lỗi, fetch lại danh sách (hoặc có thể hoàn tác local state nếu muốn)
                toast.error(data.message || "Không thể xóa mã giảm giá", { id: toastId });
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Đã xảy ra lỗi khi xóa mã giảm giá");
        } finally {
            setDeleteId(null);
            setIsDeleting(false);
        }
    };

    const handlePause = async (id: string) => {
        try {
            const coupon = coupons.find(c => c._id === id);
            const toastId = toast.loading(`Đang tạm dừng mã giảm giá "${coupon?.code}"...`);
            // Cập nhật local state ngay
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "inactive" } : c));
            
            const response = await fetch(`/api/coupons/${id}/pause`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success("Tạm dừng mã giảm giá thành công", { id: toastId });
            } else {
                // Hoàn tác nếu lỗi
                setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "active" } : c));
                toast.error(data.message || "Không thể tạm dừng mã giảm giá", { id: toastId });
            }
        } catch (error) {
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "active" } : c));
            console.error("Error pausing coupon:", error);
            toast.error("Đã xảy ra lỗi khi tạm dừng mã giảm giá");
        }
    };

    const handleActivate = async (id: string) => {
        try {
            const coupon = coupons.find(c => c._id === id);
            const toastId = toast.loading(`Đang kích hoạt mã giảm giá "${coupon?.code}"...`);
            // Cập nhật local state ngay
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "active" } : c));
            
            const response = await fetch(`/api/coupons/${id}/activate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success("Kích hoạt mã giảm giá thành công", { id: toastId });
            } else {
                // Hoàn tác nếu lỗi
                setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "inactive" } : c));
                toast.error(data.message || "Không thể kích hoạt mã giảm giá", { id: toastId });
            }
        } catch (error) {
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, status: "inactive" } : c));
            console.error("Error activating coupon:", error);
            toast.error("Đã xảy ra lỗi khi kích hoạt mã giảm giá");
        }
    };

    const handleBulkDeleteCoupons = useCallback(async () => {
        if (selectedCoupons.length === 0) {
            toast.error("Vui lòng chọn ít nhất một mã giảm giá để xóa");
            return;
        }

        try {
            setIsDeleting(true);
            const toastId = toast.loading(`Đang xóa ${selectedCoupons.length} mã giảm giá...`);
            
            const response = await fetch('/api/coupons/bulk-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ couponIds: selectedCoupons })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Có lỗi xảy ra khi xóa mã giảm giá");
            }

            const data = await response.json();
            if (data.success) {
                toast.success(`Đã xóa ${data.data.deletedCount} mã giảm giá thành công`, { id: toastId });
                setSelectedCoupons([]);
                fetchCoupons();
            } else {
                toast.error(data.message || "Có lỗi xảy ra khi xóa mã giảm giá", { id: toastId });
            }
        } catch (error) {
            console.error("Lỗi khi xóa mã giảm giá:", error);
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa mã giảm giá");
        } finally {
            setIsDeleting(false);
        }
    }, [selectedCoupons, fetchCoupons]);

    // Pagination logic
    const indexOfLastCoupon = currentPage * couponsPerPage;
    const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
    const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
    const totalPages = Math.ceil(coupons.length / couponsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
            {/* Glass Morphism Wrapper */}
            <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header with Enhanced 3D-like Effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                                        Quản lý mã giảm giá
                                        <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                                    </h1>
                                    <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                                        Quản lý và theo dõi các mã giảm giá trong hệ thống với giao diện hiện đại
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                                    </div>
                                </div>
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
                        onAddCoupon={() => router.push("/admin/coupons/add")}
                    />
                </div>

                {/* Status Cards Section */}
                <div className="mb-6">
                    <CouponStatusCards coupons={coupons} />
                </div>

                {/* Bulk Actions - With Enhanced Animation */}
                {selectedCoupons.length > 0 && (
                    <div 
                        className="mb-6 relative overflow-hidden" 
                        style={{
                            animation: "slideInFromTop 0.4s ease-out forwards"
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform rotate-1"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl transform -rotate-1"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/60 shadow-xl p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                                        <span className="text-white font-bold text-lg">{selectedCoupons.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-700 font-semibold">mã giảm giá đã được chọn</span>
                                        <p className="text-sm text-slate-500">Sẵn sàng thực hiện thao tác hàng loạt</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setSelectedCoupons([])}
                                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20 flex items-center text-sm font-medium shadow-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        Bỏ chọn tất cả
                                    </button>
                                    <button
                                        onClick={handleBulkDeleteCoupons}
                                        disabled={isDeleting}
                                        className="group px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transform hover:scale-105"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xóa...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Xóa đã chọn ({selectedCoupons.length})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section with Enhanced Glass Effect */}
                <div className="relative">
                    {loading ? (
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading-animation mb-6">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                                <p className="text-lg font-semibold text-slate-700 mb-2">Đang tải dữ liệu...</p>
                                <p className="text-slate-500 text-center max-w-sm">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn</p>
                                <style jsx>{`
                                    .loading-animation {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        gap: 12px;
                                    }
                                    
                                    .dot {
                                        width: 16px;
                                        height: 16px;
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
                                        0%, 100% {
                                            transform: translateY(0);
                                        }
                                        50% {
                                            transform: translateY(-20px);
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
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 relative mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                                    <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                                        <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy mã giảm giá</h3>
                                <p className="text-slate-600 max-w-md mb-6 text-lg">
                                    Hiện không có mã giảm giá nào phù hợp với điều kiện tìm kiếm của bạn. 
                                    Hãy thử điều chỉnh bộ lọc hoặc tạo mã giảm giá mới.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={() => {setSearchQuery(""); setStatusFilter("");}}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-emerald-100 transition-all duration-300 font-semibold border border-indigo-200/60"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                    <button 
                                        onClick={() => router.push("/admin/coupons/add")}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25"
                                    >
                                        Tạo mã giảm giá mới
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
                            <div className="bg-white/90 backdrop-blur-sm bg-opacity-80 rounded-3xl shadow-xl border border-indigo-100/60 overflow-hidden relative z-10">
                                <CouponTable
                                    coupons={currentCoupons}
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

                    {/* Pagination Component - Outside Table Container */}
                    {coupons.length > 0 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={couponsPerPage}
                                totalItems={coupons.length}
                            />
                        </div>
                    )}
                </div>

                {/* AlertDialog xác nhận xóa */}
                <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
                    <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-indigo-100/60 shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-800 font-bold">Bạn có chắc chắn muốn xóa mã giảm giá này?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600">
                                Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn mã giảm giá khỏi hệ thống.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                                Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 disabled:opacity-50"
                            >
                                {isDeleting ? "Đang xóa..." : "Xóa"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}