"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order } from "@/types/base";

export function OrderSearch() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchWithAuth<{ orders: Order[] }>(`/orders/search?phone=${phoneNumber}`);

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi tìm kiếm đơn hàng");
      }

      if (!response.data || response.data.orders.length === 0) {
        toast.info("Không tìm thấy đơn hàng nào với số điện thoại này");
        return;
      }

      // Chuyển hướng đến trang danh sách đơn hàng với kết quả tìm kiếm
      router.push(`/admin/orders/list?phone=${phoneNumber}`);
    } catch (error) {
      console.error("Error searching orders:", error);
      toast.error("Đã xảy ra lỗi khi tìm kiếm đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <Input
            id="phone"
            type="text"
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </Button>
      </form>
    </div>
  );
} 