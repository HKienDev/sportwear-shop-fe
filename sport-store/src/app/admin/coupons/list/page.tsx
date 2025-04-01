"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import CouponSearch from "@/components/admin/coupons/list/couponSearch";
import CouponPagination from "@/components/admin/coupons/list/pagination";
import CouponActions from "@/components/admin/coupons/list/couponButton";
import { Loader2 } from "lucide-react";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";

export default function CouponList() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/coupons?page=${currentPage}&limit=10&search=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách mã khuyến mãi");
      }

      const data = await response.json();
      setCoupons(data.coupons.map((coupon: Record<string, unknown>) => ({
        _id: coupon._id as string,
        code: coupon.code as string,
        discountPercentage: coupon.discountPercentage as number,
        startDate: coupon.startDate as string,
        endDate: coupon.endDate as string,
        isActive: coupon.isActive as boolean,
        usageLimit: coupon.usageLimit as number,
        usageCount: coupon.usageCount as number,
        minimumPurchaseAmount: coupon.minimumPurchaseAmount as number | undefined,
        createdAt: coupon.createdAt as string,
        updatedAt: coupon.updatedAt as string
      })));
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách mã khuyến mãi:", error);
      setError("Có lỗi xảy ra khi tải danh sách mã khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xóa mã khuyến mãi");
      }

      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
      toast.success("Xóa mã khuyến mãi thành công");
    } catch (error) {
      console.error("Lỗi khi xóa mã khuyến mãi:", error);
      toast.error("Có lỗi xảy ra khi xóa mã khuyến mãi");
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedCoupons }),
      });

      if (!response.ok) {
        throw new Error("Không thể xóa các mã khuyến mãi");
      }

      setCoupons((prev) => prev.filter((coupon) => !selectedCoupons.includes(coupon._id)));
      setSelectedCoupons([]);
      toast.success("Xóa các mã khuyến mãi thành công");
    } catch (error) {
      console.error("Lỗi khi xóa các mã khuyến mãi:", error);
      toast.error("Có lỗi xảy ra khi xóa các mã khuyến mãi");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    router.push(`/admin/coupons/edit/${coupon._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6">
            Danh Sách Mã Khuyến Mại
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <Button
                onClick={fetchCoupons}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <CouponSearch 
                  searchQuery={searchQuery}
                  onSearchChange={handleSearch}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }}
                />
                <CouponActions
                  selectedCount={selectedCoupons.length}
                  onDelete={handleBulkDelete}
                  disabled={isDeleting}
                />
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <CouponTable
                  coupons={coupons}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onBulkDelete={handleBulkDelete}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <CouponPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}