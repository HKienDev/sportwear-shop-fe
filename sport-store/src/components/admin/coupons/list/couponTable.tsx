import { useState } from "react";
import { Coupon } from "@/types/coupon";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { MoreVertical, Trash2, Edit2, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface CouponTableProps {
  coupons: Coupon[];
  onDelete: (id: string) => void;
  onEdit: (coupon: Coupon) => void;
  onBulkDelete: (ids: string[]) => void;
}

export default function CouponTable({ coupons, onDelete, onEdit, onBulkDelete }: CouponTableProps) {
  const router = useRouter();
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedCoupons.length === coupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(coupons.map((coupon) => coupon._id));
    }
  };

  const handleSelectCoupon = (id: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(id)
        ? prev.filter((couponId) => couponId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedCoupons);
    setSelectedCoupons([]);
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (now < startDate) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Chưa bắt đầu
        </Badge>
      );
    }

    if (now > endDate) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
          Đã hết hạn
        </Badge>
      );
    }

    if (!coupon.isActive) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Đã tắt
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
        Đang hoạt động
      </Badge>
    );
  };

  const getUsageStatus = (coupon: Coupon) => {
    if (coupon.usageLimit === 0) return "Không giới hạn";
    if (coupon.usageCount >= coupon.usageLimit) return "Đã hết lượt";
    const remaining = coupon.usageLimit - coupon.usageCount;
    return `${coupon.usageCount}/${coupon.usageLimit} (còn ${remaining})`;
  };

  const getTimeRemaining = (endDate: string) => {
    try {
      const now = new Date();
      const end = new Date(endDate);
      if (isNaN(end.getTime())) return "Không hợp lệ";
      
      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;

      if (days > 0) {
        return `${days} ngày ${hours} giờ`;
      }
      return `${hours} giờ`;
    } catch {
      return "Không hợp lệ";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không hợp lệ";
      return format(date, "dd/MM/yyyy HH:mm");
    } catch {
      return "Không hợp lệ";
    }
  };

  const getUsageStatusColor = (coupon: Coupon) => {
    if (coupon.usageLimit === 0) return "text-green-600";
    if (coupon.usageCount >= coupon.usageLimit) return "text-red-600";
    const percentage = (coupon.usageCount / coupon.usageLimit) * 100;
    if (percentage > 80) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white">
      {selectedCoupons.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-lg border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Đã chọn {selectedCoupons.length} mã khuyến mãi
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa đã chọn
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCoupons([])}
              className="text-white hover:text-white hover:bg-blue-700"
            >
              Bỏ chọn tất cả
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedCoupons.length === coupons.length}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã khuyến mãi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Giảm giá
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      Điều kiện áp dụng
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Điều kiện tối thiểu để sử dụng mã</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      Số lần sử dụng
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Số lần đã sử dụng/tổng số lần cho phép</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      Ngày hết hạn
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Thời gian còn lại của mã</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedCoupons.includes(coupon._id)}
                      onChange={() => handleSelectCoupon(coupon._id)}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{coupon.discountPercentage}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coupon.minimumPurchaseAmount ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            Tối thiểu {coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Đơn hàng tối thiểu {coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : 'Không có'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${getUsageStatusColor(coupon)}`}>
                    {getUsageStatus(coupon)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(coupon.endDate)}
                    <div className="text-xs text-gray-500">
                      Còn lại: {getTimeRemaining(coupon.endDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(coupon)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(coupon)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(coupon._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Không tìm thấy mã khuyến mãi nào</div>
          <Button
            onClick={() => router.push("/admin/coupons/create")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            Thêm mã khuyến mại mới
          </Button>
        </div>
      )}
    </div>
  );
}