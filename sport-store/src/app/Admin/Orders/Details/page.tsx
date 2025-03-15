"use client";

import OrderDetails from "@/components/Orders/Details/orderDetails00";

const OrderDetailsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <OrderDetails />
    </div>
  );
};

export default OrderDetailsPage;