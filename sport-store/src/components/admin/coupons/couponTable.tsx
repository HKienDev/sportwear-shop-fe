import { Coupon } from "@/types/coupon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CouponTableProps {
    coupons: Coupon[];
    selectedCoupons: string[];
    onSelectCoupon: (couponId: string) => void;
    onSelectAll: () => void;
    isLoading: boolean;
}

export function CouponTable({
    coupons,
    selectedCoupons,
    onSelectCoupon,
    onSelectAll,
    isLoading,
}: CouponTableProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/coupons/admin/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete coupon");
            }

            toast.success("Xóa mã giảm giá thành công");
            router.refresh();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Không thể xóa mã giảm giá");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (coupons.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Không có mã giảm giá nào
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <Checkbox
                                checked={selectedCoupons.length === coupons.length}
                                onCheckedChange={onSelectAll}
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giảm giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày bắt đầu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày kết thúc
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                        <tr key={coupon._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Checkbox
                                    checked={selectedCoupons.includes(coupon._id)}
                                    onCheckedChange={() => onSelectCoupon(coupon._id)}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {coupon.code}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {coupon.type === '%' ? `${coupon.value}%` : `${coupon.value.toLocaleString('vi-VN')}đ`}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {format(new Date(coupon.startDate), "dd/MM/yyyy", {
                                        locale: vi,
                                    })}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {format(new Date(coupon.endDate), "dd/MM/yyyy", {
                                        locale: vi,
                                    })}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        coupon.status === 'Hoạt động'
                                            ? "bg-green-100 text-green-800"
                                            : coupon.status === 'Tạm Dừng'
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {coupon.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            router.push(`/admin/coupons/edit/${coupon._id}`)
                                        }
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(coupon._id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 