"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import CouponSearch from "@/components/admin/coupons/list/couponSearch";
import CouponFilter from "@/components/admin/coupons/list/couponFilter";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            const response = await couponService.getCoupons({
                page: currentPage,
                limit: 10,
                search: searchQuery,
                status: statusFilter
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
    }, [currentPage, searchQuery, statusFilter]);

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
        setStatusFilter(status);
        setCurrentPage(1);
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Quản lý mã giảm giá</CardTitle>
                            <CardDescription className="text-base mt-1">
                                Tạo, chỉnh sửa và quản lý các mã giảm giá cho cửa hàng
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={() => router.push("/admin/coupons/add")}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo mã giảm giá
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <CouponSearch onSearch={handleSearch} />
                        </div>
                        <div className="w-full md:w-auto">
                            <CouponFilter onFilter={handleFilter} />
                        </div>
                    </div>

                    {selectedCoupons.length > 0 && (
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Đã chọn {selectedCoupons.length} mã giảm giá
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                disabled={isDeleting}
                                className="flex items-center gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Xóa đã chọn"
                                )}
                            </Button>
                        </div>
                    )}

                    <CouponTable
                        coupons={coupons}
                        loading={loading}
                        selectedCoupons={selectedCoupons}
                        onSelectCoupon={handleSelectCoupon}
                        onSelectAll={handleSelectAll}
                        onDelete={handleDelete}
                        onPause={handlePause}
                        onActivate={handleActivate}
                    />

                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}