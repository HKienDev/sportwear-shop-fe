interface AddressInfoProps {
  storeAddress: {
    name: string;
    phone: string;
    address: string[];
  };
  deliveryAddress: {
    name: string;
    address: string[];
    phone: string;
  };
}

export default function AddressInfo({ storeAddress, deliveryAddress }: AddressInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <div className="flex-1 bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-3">Thông tin cửa hàng</h3>
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{storeAddress.name}</div>
          <div className="text-gray-600 mt-1">{storeAddress.phone}</div>
          {storeAddress.address.map((line, index) => (
            <div key={index} className="text-gray-600 mt-1">{line}</div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-3">Địa chỉ nhận hàng</h3>
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{deliveryAddress.name}</div>
          {deliveryAddress.address.map((line, index) => (
            <div key={index} className="text-gray-600 mt-1">{line}</div>
          ))}
          <div className="text-gray-600 mt-1">{deliveryAddress.phone}</div>
        </div>
      </div>
    </div>
  );
} 