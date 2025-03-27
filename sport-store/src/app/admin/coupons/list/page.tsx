"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import CouponSearch from "@/components/admin/coupons/list/couponSearch";
import CouponTable from "@/components/admin/coupons/list/couponTable";
import Pagination from "@/components/admin/coupons/list/pagination";
import DeleteButton from "@/components/admin/coupons/list/couponButton";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  validFrom: string;
  validTo: string;
  status: string;
}

export default function CouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Tính toán số trang và danh sách mã khuyến mại hiện tại
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Lấy danh sách mã khuyến mại từ API
  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Coupons");
      if (!response.ok) {
        throw new Error("Lỗi khi lấy danh sách mã khuyến mại");
      }
      const data = await response.json();
      setCoupons(data);
      setFilteredCoupons(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mã khuyến mại:", error);
      toast.error("Không thể tải danh sách mã khuyến mại");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lọc mã khuyến mại theo từ khóa tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    
    const filtered = coupons.filter((coupon) => {
      const code = coupon.code ? coupon.code.toLowerCase() : ""; 
      const discount = coupon.discount !== undefined ? coupon.discount.toString() : ""; 
      
      return code.includes(lowercaseQuery) || discount.includes(query);
    });
  
    setFilteredCoupons(filtered);
    setCurrentPage(1);
  }, [coupons]);

  // Xử lý chọn/bỏ chọn mã khuyến mại
  const handleSelectCoupon = useCallback((id: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(id) ? prev.filter((couponId) => couponId !== id) : [...prev, id]
    );
  }, []);

  // Xử lý xóa mã khuyến mại đã chọn
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedCoupons.length) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedCoupons.length} mã khuyến mại đã chọn?
Lưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      for (const id of selectedCoupons) {
        const response = await fetch(
          `https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Coupons/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi xóa mã khuyến mại");
        }
      }

      toast.success(`Đã xóa thành công ${selectedCoupons.length} mã khuyến mại`);
      setSelectedCoupons([]);
      fetchCoupons();
    } catch (error) {
      console.error("Lỗi khi xóa mã khuyến mại:", error);
      toast.error("Không thể xóa một số mã khuyến mại. Vui lòng thử lại sau");
    }
  }, [selectedCoupons, fetchCoupons]);

  // Tải danh sách mã khuyến mại khi component được mount
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        DANH SÁCH MÃ KHUYẾN MẠI
        {isLoading && <span className="ml-2 text-gray-500 text-sm">(Đang tải...)</span>}
      </h1>

      <div className="flex justify-between mb-4">
        <CouponSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
        />
        <DeleteButton
          selectedCount={selectedCoupons.length}
          onDelete={handleDeleteSelected}
        />
      </div>

      <CouponTable
        coupons={currentCoupons}
        selectedCoupons={selectedCoupons}
        onSelectCoupon={handleSelectCoupon}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}