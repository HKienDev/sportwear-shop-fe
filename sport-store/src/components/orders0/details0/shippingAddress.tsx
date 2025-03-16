interface ShippingAddressProps {
    name: string;
    address: string;
    phone: string;
  }
  
  export default function ShippingAddress({ name, address, phone }: ShippingAddressProps) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-gray-800 font-medium flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2v12a2 2 0 002 2h12a2 2 0 002-2V3a1 1 0 100-2H5a1 1 0 00-2 0zm14 1V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v1a1 1 0 001 1h6a1 1 0 001-1zM3 4a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
          </svg>
          Địa Chỉ Giao Hàng
        </h3>
        <div className="text-gray-600">
          <p className="font-medium">{name}</p>
          <p>{address}</p>
          <p className="mt-2">Điện thoại: {phone}</p>
        </div>
      </div>
    );
  }