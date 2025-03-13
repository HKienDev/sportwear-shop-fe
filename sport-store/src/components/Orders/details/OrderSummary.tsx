const OrderSummary = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">TÓM TẮT</h2>
  
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>32.000.000 VND</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span>0 VND</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>30.000 VND</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-semibold text-green-600">
            <span>Thành tiền:</span>
            <span>32.030.000 VND</span>
          </div>
        </div>
  
        <div className="flex justify-end mt-4 gap-2">
          <button className="border px-4 py-2 rounded">Gửi hoá đơn</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">Đã thanh toán</button>
        </div>
      </div>
    );
  };
  
  export default OrderSummary;