"use client";

import OrderDetails from "@/Components/Orders/Details/orderDetails";

const OrderDetailsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <OrderDetails />
    </div>
  );
};

export default OrderDetailsPage;