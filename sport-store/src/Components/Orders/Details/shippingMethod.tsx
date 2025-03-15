interface ShippingMethodProps {
    method: string;
    expectedDate: string;
    courier: string;
    trackingId: string;
  }
  
  export default function ShippingMethod({ method, expectedDate, courier, trackingId }: ShippingMethodProps) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-gray-800 font-medium flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a2 2 0 00-2 2v8a2 2 0 002 2V4h2a2 2 0 00-2-2h-2zM7 8H5v2H3v4h5v2h2v-4h2V8h-5V6h-2v2z" />
          </svg>
          Phương Thức Vận Chuyển
        </h3>
        <div className="text-gray-600">
          <p className="font-medium">{method}</p>
          <p>{expectedDate}</p>
          <p className="mt-2">Đơn vị vận chuyển: {courier}</p>
          <p>Mã vận đơn: <span className="font-medium text-blue-600">{trackingId}</span></p>
        </div>
      </div>
    );
  }