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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-gray-900 mb-2">Thông tin vận chuyển</div>
        <div className="text-sm space-y-2">
          <div className="text-gray-600">{storeAddress.name}</div>
          <div className="text-gray-600">{storeAddress.address[0]}</div>
          <div className="text-gray-600">{storeAddress.address[1]}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-gray-900 mb-2">Địa chỉ giao hàng</div>
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{deliveryAddress.name}</div>
          <div className="text-gray-600">
            {deliveryAddress.address.street}, {deliveryAddress.address.ward.name}, {deliveryAddress.address.district.name}, {deliveryAddress.address.province.name}
          </div>
          <div className="text-gray-600 mt-1">{deliveryAddress.phone}</div>
        </div>
      </div>
    </div>
  );
} 