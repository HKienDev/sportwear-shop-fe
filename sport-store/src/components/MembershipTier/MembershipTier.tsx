import React from "react";

const MembershipTier = () => {
  return (
    <div className="border rounded p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p>
            Hạng Thành Viên{" "}
            <span className="text-purple-500 font-semibold">Kim Cương</span>
          </p>
          <p className="text-blue-500">Tôi đã thăng hạng</p>
        </div>
        <p>
          Tổng Tiền Tích Lũy:{" "}
          <span className="text-purple-500 font-semibold">123.324.000 VND</span>
        </p>
      </div>
      <div className="mb-6">
        <p className="font-semibold text-gray-700">ĐIỀU KIỆN:</p>
        <p>
          Tổng số tiền mua hàng tích lũy trong năm nay và năm liền trước đạt từ{" "}
          <span className="text-blue-500">50 triệu đồng</span> trở lên.
        </p>
      </div>
      <div>
        <p className="font-semibold text-red-500">ƯU ĐÃI MUA HÀNG:</p>
        <p>Giảm 1% áp dụng mua tất cả sản phẩm.</p>
        <p>Miễn phí giao hàng áp dụng cho mọi đơn hàng.</p>
      </div>
    </div>
  );
};

export default MembershipTier;