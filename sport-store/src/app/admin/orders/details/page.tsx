import OrderDetails from "@/components/Orders/details/OrderDetails";
import OrderTable from "@/components/Orders/details/OrderTable";
import CustomerInfo from "@/components/Orders/details/CustomerInfo";
import ShippingPaymentInfo from "@/components/Orders/details/ShippingPaymentInfo";
import OrderSummary from "@/components/Orders/details/OrderSummary";

const OrderDetailsPage = () => {
  return (
    <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <OrderDetails />
      <OrderTable />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CustomerInfo />
        <ShippingPaymentInfo />
        <OrderSummary />
      </div>
    </div>
  );
};

export default OrderDetailsPage;