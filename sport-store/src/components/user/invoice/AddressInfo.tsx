interface StoreAddress {
  name: string;
  phone: string;
  address: string[];
}

interface Address {
  street: string;
  ward: {
    name: string;
    code: number;
  };
  district: {
    name: string;
    code: number;
  };
  province: {
    name: string;
    code: number;
  };
}

interface DeliveryAddress {
  name: string;
  address: Address;
  phone: string;
}

interface AddressInfoProps {
  storeAddress: StoreAddress;
  deliveryAddress: DeliveryAddress;
}

export default function AddressInfo({ storeAddress, deliveryAddress }: AddressInfoProps) {
  return (
    <div className="address-grid grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {/* Shipping Info */}
      <div className="address-card bg-gray-50 rounded-lg">
        <div className="address-title font-medium text-gray-900 mb-2">Thông tin vận chuyển</div>
        <div className="address-content space-y-1 sm:space-y-2">
          <div className="text-gray-600 break-words">{storeAddress.name}</div>
          {storeAddress.address.map((addr, index) => (
            <div key={index} className="text-gray-600 break-words">{addr}</div>
          ))}
        </div>
      </div>
      
      {/* Delivery Address */}
      <div className="address-card bg-gray-50 rounded-lg">
        <div className="address-title font-medium text-gray-900 mb-2">Địa chỉ giao hàng</div>
        <div className="address-content">
          <div className="font-semibold text-gray-900 break-words">{deliveryAddress.name}</div>
          <div className="text-gray-600 break-words mt-1">
            {deliveryAddress.address.street}, {deliveryAddress.address.ward.name}, {deliveryAddress.address.district.name}, {deliveryAddress.address.province.name}
          </div>
          <div className="text-gray-600 mt-1">{deliveryAddress.phone}</div>
        </div>
      </div>
    </div>
  );
} 