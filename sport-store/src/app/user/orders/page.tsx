"use client";

import Image from "next/image";
import { useState } from "react";

export default function Invoice() {
  const [invoiceData] = useState({
    invoiceNumber: "#123456",
    invoiceDate: "15.1.2025",
    seller: {
      name: "VJU SPORT",
      phone: "+84 865 206 198",
      address: "Đường Lưu Hữu Phước, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội",
    },
    recipient: {
      name: "Hoàng Tiến Trung Kiên,",
      address: "Số 94 (Cổng khác số 2006), Đường Phú Mỹ, Mỹ Đình 2, Nam Từ Liêm, Hà Nội,",
      phone: "+84 865 206 198",
    },
    products: [
      {
        name: "Nike Air Zoom Mercurial Superfly X Elite FG",
        type: "Giày sân cỏ tự nhiên",
        color: "Mặc định",
        size: "43",
        quantity: 2,
        total: "4.000.000 VND",
        image: "/shoes.png", 
      },
      {
        name: "Nike Air Zoom Mercurial Superfly X Elite FG",
        type: "Giày sân cỏ tự nhiên",
        color: "Mặc định",
        size: "43",
        quantity: 2,
        total: "4.000.000 VND",
        image: "/shoes.png",
      },
      {
        name: "Nike Air Zoom Mercurial Superfly X Elite FG",
        type: "Giày sân cỏ tự nhiên",
        color: "Mặc định",
        size: "43",
        quantity: 2,
        total: "4.000.000 VND",
        image: "/shoes.png",
      },
      {
        name: "Nike Air Zoom Mercurial Superfly X Elite FG",
        type: "Giày sân cỏ tự nhiên",
        color: "Mặc định",
        size: "43",
        quantity: 2,
        total: "4.000.000 VND",
        image: "/shoes.png",
      },
    ],
    payment: {
      subtotal: "16.000.000 vnd",
      discount: "0 vnd",
      shipping: "30.000 vnd",
      total: "16.030.000 vnd",
      paid: "16.030.000 vnd",
    },
    support: {
      phone: "+84 865 206 198",
      address: "Đường Lưu Hữu Phước, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội",
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold text-center mb-8">HÓA ĐƠN</h1>
      
      {/* Invoice header */}
      <div className="border border-gray-200 rounded p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex">
              <p className="font-bold mr-4 w-40">Mã hóa đơn:</p>
              <p>{invoiceData.invoiceNumber}</p>
            </div>
            <div className="flex">
              <p className="font-bold mr-4 w-40">Ngày lập hóa đơn:</p>
              <p>{invoiceData.invoiceDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold mb-2">Bán bởi:</p>
            <p>{invoiceData.seller.name}</p>
            <p>{invoiceData.seller.phone}</p>
            <p className="leading-tight">{invoiceData.seller.address}</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold mb-2">Địa chỉ nhận hàng:</p>
            <p>{invoiceData.recipient.name}</p>
            <p className="leading-tight">{invoiceData.recipient.address}</p>
            <p className="mt-4">{invoiceData.recipient.phone}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="border border-gray-300 rounded p-8 mb-8">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_2fr] gap-6 font-bold mb-8 text-xl">
          <div>Sản phẩm</div>
          <div>Thể loại</div>
          <div>Màu</div>
          <div>Kích Cỡ</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
        </div>

        {invoiceData.products.map((product, index) => (
            <div
                key={index}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_2fr] gap-6 items-center py-6 border-t border-gray-200 text-lg"
            >
                <div className="flex items-center space-x-8">
                  <div className="w-36 h-36 relative rounded-lg overflow-hidden shadow-md border border-gray-300 p-2 bg-white">
                      <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="contain"
                      />
                  </div>
                  <span className="text-blue-600 font-medium min-w-[140px]">{product.name}</span>
                </div>
                <div className="text-gray-700 min-w-[140px]">{product.type}</div>
                <div className="text-gray-700 min-w-[120px]">{product.color}</div>
                <div className="text-gray-700 min-w-[120px]">{product.size}</div>
                <div className="text-gray-900 font-semibold min-w-[120px]">{product.quantity}</div>
                <div className="text-green-600 font-bold min-w-[160px] break-words">{product.total}</div>
            </div>
        ))}
      </div>

      {/* Payment info */}
      <div className="border border-gray-300 rounded p-8 mb-8">
        <div className="flex items-center text-red-600 font-bold mb-8">
          <span className="inline-block w-6 h-6 bg-red-600 mr-3"></span>
          THÔNG TIN THANH TOÁN
        </div>

        <div className="space-y-4 text-xl">
          <div className="flex justify-between">
            <span>Tổng tiền sản phẩm:</span>
            <span className="font-medium">{invoiceData.payment.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span>{invoiceData.payment.discount}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{invoiceData.payment.shipping}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span>Phải thanh toán:</span>
            <span className="font-medium">{invoiceData.payment.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Đã thanh toán:</span>
            <span className="text-green-600 font-medium">{invoiceData.payment.paid}</span>
          </div>
        </div>
      </div>

      {/* Support info */}
      <div className="border border-gray-300 rounded p-8">
        <div className="flex items-center text-blue-600 font-bold mb-8">
          <span className="inline-block w-6 h-6 bg-blue-600 mr-3"></span>
          THÔNG TIN HỖ TRỢ
        </div>

        <div className="space-y-6 text-xl">
          <div className="flex items-start">
            <span className="inline-block w-6 h-6 mr-3">📞</span>
            <div>
              <p>Số điện thoại của hãng:</p>
              <p className="text-red-600">{invoiceData.support.phone}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-6 h-6 mr-3">📍</span>
            <div>
              <p>Địa chỉ của hãng:</p>
              <p>{invoiceData.support.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}