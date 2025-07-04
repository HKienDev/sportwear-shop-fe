import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "sonner";

interface CouponSectionProps {
  onApplyCoupon: (discount: number) => void;
}

export default function CouponSection({ onApplyCoupon }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetchWithAuth<{ discount: number }>("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code: couponCode }),
      });

      if (response.success && response.data?.discount) {
        onApplyCoupon(response.data.discount);
        toast.success("Áp dụng mã giảm giá thành công");
      } else {
        setError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("Có lỗi xảy ra khi áp dụng mã giảm giá");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">MÃ GIẢM GIÁ</h2>
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={isLoading}
            className="whitespace-nowrap text-xs md:text-sm"
          >
            {isLoading ? "Đang xử lý..." : "Áp dụng"}
          </Button>
        </div>
        {error && <p className="text-xs md:text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
} 