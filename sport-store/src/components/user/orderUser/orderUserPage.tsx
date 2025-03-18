'use client';

export default function OrderUserPage() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>
      <div className="border rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-gray-700">ID</th>
              <th className="p-3 text-left text-gray-700">Thành Tiền</th>
              <th className="p-3 text-left text-gray-700">Thanh Toán</th>
              <th className="p-3 text-left text-gray-700">Mã Vận Chuyển</th>
              <th className="p-3 text-left text-gray-700">Vận Chuyển</th>
              <th className="p-3 text-left text-gray-700">Thời Gian Đặt Đơn</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">
                  <a href="#" className="text-blue-500 hover:underline">
                    #2131
                  </a>
                </td>
                <td className="p-3">8.500.000 VND</td>
                <td className="p-3">
                  <span className="text-green-500">ĐÃ THANH TOÁN</span>
                </td>
                <td className="p-3">#213141</td>
                <td className="p-3">
                  {index === 0 ? (
                    <span className="text-blue-500">ĐÃ GIAO</span>
                  ) : (
                    <span className="text-yellow-500">ĐANG VẬN CHUYỂN</span>
                  )}
                </td>
                <td className="p-3">16:10 24/01/2025</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-3 text-sm">
          <div>1 đến 10 trong tổng số 50 mục</div>
          <div>
            <button className="text-blue-500 hover:underline">
              Xem tất cả
            </button>
          </div>
        </div>
        <div className="flex justify-center p-3 gap-1">
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded bg-blue-500 text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}