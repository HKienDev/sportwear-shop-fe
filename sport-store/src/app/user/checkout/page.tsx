'use client';

import { useState } from 'react';
import { ShoppingBag, Truck, CreditCard, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export default function Checkout() {
  const [couponCode, setCouponCode] = useState('');
  const [showCouponOptions, setShowCouponOptions] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [expandedSection, setExpandedSection] = useState<string | null>('items');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cartItems = [
    { id: 1, name: 'Adidas Predator Freak FG', size: 'UK 36', color: 'green/black', price: 1000000, originalPrice: 1500000, image: '/products/predator-green.png' },
    { id: 2, name: 'Adidas Predator Freak FG', size: 'UK 36', color: 'white/red', price: 1000000, originalPrice: 1500000, image: '/products/predator-white.png' },
    { id: 3, name: 'Adidas Predator Freak FG', size: 'UK 36', color: 'blue/orange', price: 2000000, originalPrice: 2000000, image: '/products/predator-blue.png' },
    { id: 4, name: 'Adidas Predator Freak FG', size: 'UK 36', color: 'green/white', price: 2000000, originalPrice: 2000000, image: '/products/predator-neon.png' },
  ];

  const popularCoupons = [
    { code: 'WELCOME10', discount: '10%', description: 'Giảm 10% cho đơn hàng đầu tiên' },
    { code: 'SPORT15', discount: '15%', description: 'Giảm 15% cho sản phẩm thể thao' },
    { code: 'FREESHIP', discount: 'Miễn phí', description: 'Miễn phí vận chuyển' },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = deliveryMethod === 'standard' ? 30000 : 60000;
  const discount = 1000000;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const handleSubmitCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle coupon validation
    console.log('Applying coupon:', couponCode);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">THANH TOÁN</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50"
                onClick={() => toggleSection('delivery')}
              >
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">HÌNH THỨC GIAO HÀNG</h2>
                </div>
                {expandedSection === 'delivery' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              
              {expandedSection === 'delivery' && (
                <div className="p-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <label className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="h-5 w-5 text-red-600"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">GIAO HÀNG TIẾT KIỆM</span>
                          <span className="ml-auto text-gray-700">{formatPrice(30000)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Giao hàng trong 3-5 ngày làm việc</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="h-5 w-5 text-red-600"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">GIAO HÀNG HỎA TỐC</span>
                          <span className="ml-auto text-gray-700">{formatPrice(60000)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Giao hàng trong 24 giờ</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600" />
                      <p className="ml-2 text-sm text-green-800">
                        Giao hàng vào lúc: <span className="font-semibold">Thứ 7, 18/01/2025</span>
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-green-800">
                      Được giao bởi Viettel Post
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50"
                onClick={() => toggleSection('items')}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">CHI TIẾT ĐƠN HÀNG</h2>
                </div>
                {expandedSection === 'items' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              
              {expandedSection === 'items' && (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                        <div className="h-full w-full bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          <div className="text-right">
                            <p className="text-base font-medium text-red-600">{formatPrice(item.price)}</p>
                            {item.originalPrice > item.price && (
                              <p className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50"
                onClick={() => toggleSection('payment')}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">PHƯƠNG THỨC THANH TOÁN</h2>
                </div>
                {expandedSection === 'payment' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              
              {expandedSection === 'payment' && (
                <div className="p-6 space-y-4">
                  <label className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-5 w-5 text-red-600"
                    />
                    <div className="ml-4">
                      <span className="font-medium text-gray-900">THANH TOÁN KHI NHẬN HÀNG</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="h-5 w-5 text-red-600"
                    />
                    <div className="ml-4 flex items-center">
                      <span className="font-medium text-gray-900">MOMO</span>
                      <div className="h-8 w-8 ml-2 bg-pink-600 rounded-md"></div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-5 w-5 text-red-600"
                    />
                    <div className="ml-4">
                      <span className="font-medium text-gray-900">THẺ TÍN DỤNG/GHI NỢ</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">GIAO TỚI</h2>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium text-gray-900">Hoàng Tiến Trung Kiên</h3>
                  <span className="text-gray-600">0362195258</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Số 94 (Công khác số 2006), Đường Phú Mỹ, Mỹ Đình 2, Nam Từ Liêm,
                  Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội
                </p>
              </div>
              
              <button className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">
                Thay đổi địa chỉ
              </button>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">MÃ GIẢM GIÁ</h2>
              <form onSubmit={handleSubmitCoupon} className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá (Chỉ áp dụng 1 lần)"
                  className="flex-1 min-w-0 border border-gray-300 rounded-l-md p-2 text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-r-md hover:bg-red-700"
                >
                  ÁP DỤNG
                </button>
              </form>
              
              <button 
                className="mt-4 w-full py-3 bg-gray-100 rounded-md text-gray-800 font-medium flex items-center justify-center"
                onClick={() => setShowCouponOptions(!showCouponOptions)}
              >
                <span>HOẶC CHỌN MÃ GIẢM GIÁ SẴN CÓ</span>
                {showCouponOptions ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
              </button>
              
              {showCouponOptions && (
                <div className="mt-4 space-y-3">
                  {popularCoupons.map((coupon) => (
                    <div 
                      key={coupon.code}
                      className="border border-gray-200 rounded-md p-3 hover:border-red-300 cursor-pointer"
                      onClick={() => setCouponCode(coupon.code)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{coupon.code}</span>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          {coupon.discount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ĐƠN HÀNG</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền phí vận chuyển</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-red-600">
                  <span>Giảm giá trực tiếp</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã khuyến mại của cửa hàng</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Tổng tiền thanh toán</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600">{formatPrice(total)}</span>
                      <p className="text-sm text-green-600 mt-1">Tiết kiệm {formatPrice(discount)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">(Đã bao gồm thuế VAT nếu có)</p>
                </div>
              </div>
              
              <button className="mt-6 w-full py-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition">
                THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}