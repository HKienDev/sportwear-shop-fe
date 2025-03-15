// app/thanh-toan/page.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";

const inter = Inter({ subsets: ['latin'] });

export default function CheckoutPage() {
  // Trạng thái cho các lựa chọn
  const [deliveryMethod, setDeliveryMethod] = useState('tiet-kiem');
  const [paymentMethod, setPaymentMethod] = useState('khi-nhan-hang');
  const [discountCode, setDiscountCode] = useState('');
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  
  // Dữ liệu sản phẩm
  const products = [
    {
      id: 1,
      name: 'Adidas Predator Freak FG',
      image: '/shoes.png',
      size: 'UK 36',
      price: 1000000,
      originalPrice: 1500000,
    },
    {
      id: 2,
      name: 'Adidas Predator Freak FG',
      image: '/shoes.png',
      size: 'UK 36',
      price: 1000000,
      originalPrice: 1500000,
    },
    {
      id: 3,
      name: 'Adidas Predator Freak FG',
      image: '/shoes.png',
      size: 'UK 36',
      price: 2000000,
      originalPrice: 1500000,
    },
    {
      id: 4,
      name: 'Adidas Predator Freak FG',
      image: '/shoes.png',
      size: 'UK 36',
      price: 2000000,
      originalPrice: 1500000,
    },
  ];
  
  // Thông tin đơn hàng
  const orderInfo = {
    subtotal: 7000000,
    shippingFee: 30000,
    discount: 1000000,
    promotions: 0,
    total: 6030000,
    savings: 1000000,
  };
  
  // Thông tin người nhận
  const recipientInfo = {
    name: 'Hoàng Tiến Trung Kiên',
    phone: '0362195258',
    address: 'Số 94 (Cổng khác số 2006), Đường Phú Mỹ, Mỹ Đình 2, Nam Từ Liêm, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội',
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <>
      <Header />  
        <div className={`${inter.className} max-w-screen-xl mx-auto px-4 py-8`}>
        <h1 className="text-2xl font-bold mb-6">THANH TOÁN</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột trái - Phương thức và sản phẩm */}
            <div className="lg:col-span-2 space-y-6">
            {/* Hình thức giao hàng */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">HÌNH THỨC GIAO HÀNG</h2>
                
                {/* Giao hàng tiết kiệm */}
                <div className="mb-4">
                <label className="flex items-center p-4 rounded-lg bg-blue-50 cursor-pointer">
                    <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'tiet-kiem'}
                    onChange={() => setDeliveryMethod('tiet-kiem')}
                    className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 flex items-center">
                    <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </span>
                    <span className="font-medium">GIAO HÀNG TIẾT KIỆM</span>
                    </span>
                </label>
                </div>
                
                {/* Giao hàng hỏa tốc */}
                <div>
                <label className="flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer">
                    <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'hoa-toc'}
                    onChange={() => setDeliveryMethod('hoa-toc')}
                    className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 flex items-center">
                    <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </span>
                    <span className="font-medium">GIAO HÀNG HỎA TỐC</span>
                    </span>
                </label>
                </div>
                
                {/* Thông tin giao hàng */}
                <div className="mt-6">
                <div className="text-green-600 font-medium mb-2">
                    Giao hàng vào lúc: Thứ 7, 18/01/2025
                </div>
                <div className="flex justify-between items-center">
                    <div className="font-medium">GIAO HÀNG TIẾT KIỆM: 30.000 Vnđ</div>
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Được giao bởi Viettel Post
                    </div>
                </div>
                </div>
                
                {/* Danh sách sản phẩm */}
                <div className="mt-6 space-y-4">
                {products.map(product => (
                    <div key={product.id} className="flex items-start space-x-4 py-3 border-t border-gray-200">
                    <div className="w-16 h-16 relative flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                        <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">Size: {product.size}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-red-500 font-medium">{formatCurrency(product.price)} Vnđ</div>
                            <div className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)} Vnđ</div>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            
            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
                
                {/* Thanh toán khi nhận hàng */}
                <div className="mb-4">
                <label className="flex items-center p-4 rounded-lg bg-blue-50 cursor-pointer">
                    <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'khi-nhan-hang'}
                    onChange={() => setPaymentMethod('khi-nhan-hang')}
                    className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 flex items-center">
                    <span className="inline-block mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </span>
                    <span className="font-medium">THANH TOÁN KHI NHẬN HÀNG</span>
                    </span>
                </label>
                </div>
                
                {/* MoMo */}
                <div>
                <label className="flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer">
                    <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-2 flex items-center">
                    <span className="inline-block mr-2">
                        <div className="w-6 h-6 bg-pink-600 rounded-md flex items-center justify-center text-white text-xs font-bold">MoMo</div>
                    </span>
                    <span className="font-medium">MOMO</span>
                    </span>
                </label>
                </div>
            </div>
            </div>
            
            {/* Cột phải - Thông tin đơn hàng */}
            <div className="lg:col-span-1 space-y-6">
            {/* Thông tin giao tới */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">GIAO TỚI</h2>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                    <div className="font-medium">{recipientInfo.name}</div>
                    <div>{recipientInfo.phone}</div>
                </div>
                </div>
                
                <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">{recipientInfo.address}</p>
                </div>
            </div>
            
            {/* Mã giảm giá */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">MÃ GIẢM GIÁ</h2>
                
                <div className="space-y-3">
                <div className="flex space-x-2">
                    <input
                    type="text"
                    placeholder="Nhập mã giảm giá (Chỉ áp dụng 1 lần)"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    ÁP DỤNG
                    </button>
                </div>
                
                <button 
                    className="w-full flex items-center justify-between bg-red-500 text-white px-4 py-3 rounded-md"
                    onClick={() => setShowDiscountOptions(!showDiscountOptions)}
                >
                    <span>HOẶC CHỌN MÃ GIẢM GIÁ SẴN CÓ</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${showDiscountOptions ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                </div>
            </div>
            
            {/* Đơn hàng */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>
                
                <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Tổng tiền hàng</span>
                    <span className="font-medium">{formatCurrency(orderInfo.subtotal)} Vnđ</span>
                </div>
                
                <div className="flex justify-between">
                    <span>Tiền phí vận chuyển</span>
                    <span>{formatCurrency(orderInfo.shippingFee)} Vnđ</span>
                </div>
                
                <div className="flex justify-between">
                    <span>Giảm giá trực tiếp</span>
                    <span className="text-green-500">-{formatCurrency(orderInfo.discount)} Vnđ</span>
                </div>
                
                <div className="flex justify-between">
                    <span>Mã khuyến mại của cửa hàng</span>
                    <span>{formatCurrency(orderInfo.promotions)} Vnđ</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between mb-1">
                    <span className="font-medium">Tổng tiền thanh toán</span>
                    <span className="text-xl text-red-600 font-bold">{formatCurrency(orderInfo.total)}0 Vnđ</span>
                    </div>
                    
                    <div className="text-right text-green-500 text-sm">
                    Tiết kiệm {formatCurrency(orderInfo.savings)} Vnđ
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                    (Đã bao gồm thuế VAT nếu có)
                    </div>
                </div>
                
                <button className="w-full bg-black text-white font-medium py-3 rounded-md uppercase">
                    Thanh toán
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </>
  );
}