"use client";
import OrderDetails from "@/components/Orders/Details/OrderDetails";

const OrderDetailsPage = () => {
  return (
    <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <OrderDetails />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      </div>
    </div>
  );
};

export default OrderDetailsPage;