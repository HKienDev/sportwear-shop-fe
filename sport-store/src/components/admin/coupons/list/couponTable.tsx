import React, { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  validFrom: string;
  validTo: string;
  status: string;
}

interface CouponTableProps {
  coupons: Coupon[];
  selectedCoupons: string[];
  onSelectCoupon: (id: string) => void;
  onDeleteCoupon?: (couponId: string) => void;
}

export default function CouponTable({
  coupons,
  selectedCoupons,
  onSelectCoupon,
  onDeleteCoupon,
}: CouponTableProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSelectAll = () => {
    if (selectedCoupons.length === coupons.length) {
      // Bỏ chọn tất cả
      coupons.forEach((coupon) => onSelectCoupon(coupon.id));
    } else {
      // Chọn tất cả
      coupons.forEach((coupon) => onSelectCoupon(coupon.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header hành động hàng loạt */}
      {selectedCoupons.length > 0 && (
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-blue-800 font-semibold">
              {selectedCoupons.length} mục đã chọn
            </span>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-white border rounded-md px-3 py-2 hover:bg-gray-100"
              >
                Hành động hàng loạt <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      // Triển khai logic xóa hàng loạt
                      selectedCoupons.forEach((id) => onDeleteCoupon?.(id));
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 w-4 h-4 text-red-500" /> Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selectedCoupons.length === coupons.length && coupons.length > 0
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã khuyến mại
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm giá (%)
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian áp dụng
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.includes(coupon.id)}
                      onChange={() => onSelectCoupon(coupon.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{coupon.code}</td>
                  <td className="p-4 text-sm text-gray-700">{coupon.discount}%</td>
                  <td className="p-4 text-sm text-gray-700">
                    {new Date(coupon.validFrom).toLocaleDateString()} -{" "}
                    {new Date(coupon.validTo).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="text-gray-500">
                    Không tìm thấy mã khuyến mại.
                    <button className="ml-2 text-blue-600 hover:underline">
                      Thêm mã khuyến mại mới
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}