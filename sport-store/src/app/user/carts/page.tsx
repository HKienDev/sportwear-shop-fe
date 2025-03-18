// app/cart/page.jsx
'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Header from "@/components/user/userLayout/header/page";
import Footer from "@/components/user/userLayout/footer/page";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ['latin'] });

export default function CartPage() {
    const router = useRouter();
    // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Adidas Predator Freak FG',
      size: 'UK 36',
      image: '/shoes.png',
      price: 1000000,
      originalPrice: 1500000,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      image: '/shoes.png',
      price: 1000000,
      originalPrice: 1500000,
      quantity: 1,
    },
    {
      id: 3,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      image: '/shoes.png',
      price: 2000000,
      originalPrice: 1500000,
      quantity: 1,
    },
    {
      id: 4,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      image: '/shoes.png',
      price: 2000000,
      originalPrice: 1500000,
      quantity: 1,
    },
  ]);

  // Shipping info state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shippingInfo, setShippingInfo] = useState({
    name: 'HOÀNG TIẾN TRUNG KIÊN',
    phone: '0378809999',
    province: 'HÀ NỘI',
    district: 'NAM TỪ LIÊM',
    ward: 'MỸ ĐÌNH 2',
    address: '01, LÊ ĐỨC THỌ',
  });

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 1000000;
  const total = subtotal - discount;
  
  // Handle quantity change
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
  
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Handle remove item
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };
  
  return (
    <>
        <Header />
        <div className={`${inter.className} max-w-7xl mx-auto px-4 py-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">GIỎ HÀNG CỦA BẠN</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-12 px-4 py-3 bg-gray-50">
                    <div className="col-span-6 font-medium">Sản phẩm</div>
                    <div className="col-span-2 text-center font-medium">Số lượng</div>
                    <div className="col-span-4 text-right font-medium">Thành tiền</div>
                </div>
                
                {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 px-4 py-4 items-center">
                    <div className="col-span-1">
                        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-white"
                            defaultChecked 
                        />
                        </div>
                    </div>
                    
                    <div className="col-span-5 flex items-center space-x-3">
                        <div className="w-16 h-16 relative flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                        />
                        </div>
                        <div>
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <button 
                            className="flex items-center text-red-500 text-sm mt-1"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                            <span className="text-red-500 mr-1">🗑️</span>
                            Xóa sản phẩm
                        </button>
                        </div>
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                            className="px-3 py-1 text-gray-600"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                            -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button 
                            className="px-3 py-1 text-gray-600"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                            +
                        </button>
                        </div>
                    </div>
                    
                    <div className="col-span-4 text-right">
                        <div className="font-medium">{formatCurrency(item.price)} Vnd</div>
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(item.originalPrice)}Vnd</div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
            
            {/* Order Summary Section */}
            <div className="lg:col-span-1">
            <div className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">THÔNG TIN NHẬN HÀNG</h2>
                
                <div className="space-y-4">
                    <div>
                    <label className="block text-xs text-gray-500">TÊN NGƯỜI NHẬN</label>
                    <div className="font-medium">{shippingInfo.name}</div>
                    </div>
                    
                    <div>
                    <label className="block text-xs text-gray-500">SĐT NGƯỜI NHẬN</label>
                    <div className="font-medium">{shippingInfo.phone}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500">TỈNH / THÀNH PHỐ</label>
                        <select className="w-full border border-gray-300 rounded-md px-2 py-1">
                        <option>{shippingInfo.province}</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-500">QUẬN / HUYỆN</label>
                        <select className="w-full border border-gray-300 rounded-md px-2 py-1">
                        <option>{shippingInfo.district}</option>
                        </select>
                    </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500">PHƯỜNG / XÃ</label>
                        <select className="w-full border border-gray-300 rounded-md px-2 py-1">
                        <option>{shippingInfo.ward}</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-500">SỐ NHÀ, TÊN ĐƯỜNG</label>
                        <div className="font-medium">{shippingInfo.address}</div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Discount Code */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">MÃ GIẢM GIÁ</h2>
                
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá (Chỉ áp dụng 1 lần)"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 text-sm">
                        ÁP DỤNG
                    </button>
                    </div>
                    
                    <button className="w-full bg-red-500 text-white rounded-md py-3 text-sm">
                    HOẶC CHỌN MÃ GIẢM GIÁ SẴN CÓ
                    </button>
                </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG (TẠM TÍNH)</h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between">
                    <span>Tổng tiền hàng</span>
                    <span className="font-medium">{formatCurrency(subtotal)} Vnd</span>
                    </div>
                    
                    <div className="flex justify-between">
                    <span>Giảm giá trực tiếp</span>
                    <span className="text-green-500">-{formatCurrency(discount)} Vnd</span>
                    </div>
                    
                    <div className="flex justify-between">
                    <span>Mã khuyến mại của cửa hàng</span>
                    <span>0 Vnd</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                        <span className="font-medium">Tổng tiền thanh toán</span>
                        <span className="text-xl text-red-600 font-bold">{formatCurrency(total)}0 Vnd</span>
                    </div>
                    
                    <div className="text-right text-green-500 text-sm">
                        Tiết kiệm {formatCurrency(discount)} Vnd
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                        (Đã bao gồm thuế VAT nếu có)
                    </div>
                    </div>
                    
                    <button
                        className="w-full bg-black text-white rounded-md py-3 text-sm mt-4 uppercase"
                        onClick={() => router.push("/user/checkout")}
                        >
                        Tiếp tục
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </>
  );
}