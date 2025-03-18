interface OrderListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddOrder: () => void;
}

export default function OrderListFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddOrder,
}: OrderListFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Bạn cần tìm gì?"
        className="border border-gray-300 rounded-md px-4 py-2 w-1/3"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex gap-4">
        {/* Lọc theo trạng thái */}
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao hàng</option>
          <option value="delivered">Giao hàng thành công</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        {/* Nút thêm đơn hàng */}
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={onAddOrder}
        >
          + Thêm Đơn Hàng
        </button>
      </div>
    </div>
  );
} 