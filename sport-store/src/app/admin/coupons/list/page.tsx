"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { CouponTable } from "@/components/admin/coupons/couponTable";
import { CouponSearch } from "@/components/admin/coupons/couponSearch";
import { Pagination } from "@/components/ui/pagination";

export default function CouponListPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (user.role !== "admin") {
            router.push("/");
            return;
        }

        fetchCoupons();
    }, [user, router, currentPage, searchQuery]);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/api/coupons/admin?page=${currentPage}&limit=10&search=${searchQuery}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch coupons");
            }

            const data = await response.json();
            setCoupons(data.data.coupons);
            setTotalPages(data.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Không thể tải danh sách mã giảm giá");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
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

        try {
            const response = await fetch("/api/coupons/admin/bulk-delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ couponIds: selectedCoupons }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete coupons");
            }

            toast.success("Xóa mã giảm giá thành công");
            setSelectedCoupons([]);
            fetchCoupons();
        } catch (error) {
            console.error("Error deleting coupons:", error);
            toast.error("Không thể xóa mã giảm giá");
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
                <Button onClick={() => router.push("/admin/coupons/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm mã giảm giá
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <CouponSearch onSearch={handleSearch} />
                        {selectedCoupons.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSelected}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa đã chọn ({selectedCoupons.length})
                            </Button>
                        )}
                    </div>

                    <CouponTable
                        coupons={coupons}
                        selectedCoupons={selectedCoupons}
                        onSelectCoupon={handleSelectCoupon}
                        onSelectAll={handleSelectAll}
                        isLoading={isLoading}
                    />

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}