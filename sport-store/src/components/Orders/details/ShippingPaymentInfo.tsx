const ShippingPaymentInfo = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">THÔNG TIN VẬN CHUYỂN / THANH TOÁN</h2>
  
        {/* Đơn vị vận chuyển */}
        <div className="mb-4">
          <label className="block font-medium mb-1">ĐƠN VỊ VẬN CHUYỂN</label>
          <div className="flex gap-2">
            <select className="border p-2 rounded w-full">
              <option>GIAO HÀNG TIẾT KIỆM</option>
              <option>GIAO HÀNG NHANH</option>
              <option>VIETTEL POST</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">Cập Nhật</button>
          </div>
        </div>
  
        {/* Phương thức thanh toán */}
        <div>
          <label className="block font-medium mb-1">PHƯƠNG THỨC THANH TOÁN</label>
          <div className="flex gap-2">
            <select className="border p-2 rounded w-full">
              <option>MOMO</option>
              <option>VNPAY</option>
              <option>COD</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">Cập Nhật</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ShippingPaymentInfo;