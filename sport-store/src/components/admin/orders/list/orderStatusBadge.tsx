export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-yellow-500"; // Chờ xác nhận
    case "processing":
      return "text-blue-500"; // Đang xử lý
    case "shipped":
      return "text-orange-500"; // Đang giao
    case "delivered":
      return "text-green-500"; // Đã giao
    case "cancelled":
      return "text-red-500"; // Đã hủy
    default:
      return "text-gray-500"; // Không rõ trạng thái
  }
}

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`${getStatusColor(status)}`}>
      {status}
    </span>
  );
} 