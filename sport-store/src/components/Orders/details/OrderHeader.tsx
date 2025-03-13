interface OrderHeaderProps {
    orderId: string;
    customerId: string;
    lastUpdated: string;
    status: string;
    paymentStatus: string;
  }
  
  export default function OrderHeader({
    orderId,
    customerId,
    lastUpdated,
    status,
    paymentStatus,
  }: OrderHeaderProps) {
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-blue-600 font-semibold">ĐƠN HÀNG {orderId}</span>
          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 text-sm rounded">
            {status}
          </span>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 text-sm rounded">
            {paymentStatus}
          </span>
        </div>
        <p className="text-gray-600">
          ID KHÁCH HÀNG:{" "}
          <span className="text-blue-600 font-semibold">{customerId}</span>
        </p>
        <p className="text-sm text-gray-500">Cập nhật lần cuối: {lastUpdated}</p>
      </div>
    );
  }