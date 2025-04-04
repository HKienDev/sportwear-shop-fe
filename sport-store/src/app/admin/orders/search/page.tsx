import { OrderSearch } from '@/components/admin/orders/search/orderSearch';

export default function OrderSearchPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tìm kiếm đơn hàng theo số điện thoại</h1>
      <OrderSearch />
    </div>
  );
} 