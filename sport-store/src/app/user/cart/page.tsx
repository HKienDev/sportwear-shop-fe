'use client';

// pages/cart.js
import { useState, useEffect } from 'react';
import { MinusIcon, PlusIcon, XMarkIcon, ArrowRightIcon, ShoppingBagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Định nghĩa interfaces
interface Product {
  id: number;
  name: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  brand: string;
  color: string;
  selected?: boolean;
}

export default function ShoppingCart() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Adidas Predator Freak FG',
      size: 'UK 36',
      price: 1000000,
      originalPrice: 1500000,
      quantity: 1,
      image: '/default-image.png',
      brand: 'Adidas',
      color: 'Neon Green',
      selected: true
    },
    {
      id: 2, 
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      price: 1000000, 
      originalPrice: 1500000,
      quantity: 1,
      image: '/default-image.png',
      brand: 'Nike',
      color: 'White/Multi',
      selected: true
    },
    {
      id: 3,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      price: 2000000,
      originalPrice: 1500000,
      quantity: 1,
      image: '/default-image.png',
      brand: 'Nike',
      color: 'Blue/Orange',
      selected: true
    },
    {
      id: 4,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      size: 'UK 36',
      price: 2000000,
      originalPrice: 1500000,
      quantity: 1,
      image: '/default-image.png',
      brand: 'Nike',
      color: 'Neon Green',
      selected: true
    }
  ]);
  
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  
  useEffect(() => {
    setShowAnimation(true);
  }, []);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    setProducts(products.map(product => 
      product.id === id ? {...product, quantity: newQuantity} : product
    ));
  };
  
  const removeProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setProducts(products.map(product => ({...product, selected: newSelectAll})));
  };

  const toggleSelectProduct = (id: number) => {
    setProducts(products.map(product => 
      product.id === id ? {...product, selected: !product.selected} : product
    ));
    
    // Check if all products are selected
    const allSelected = products.every(product => 
      product.id === id ? !product.selected : product.selected
    );
    setSelectAll(allSelected);
  };
  
  const subtotal = products.reduce((sum, product) => 
    product.selected ? sum + product.price * product.quantity : sum, 0
  );
  const discount = 0;
  const shipping = 30000;
  const total = subtotal - discount + shipping;
  
  const featuredProducts = [
    { id: 101, name: 'Nike Phantom GX', price: 1200000, image: '/default-image.png' },
    { id: 102, name: 'Adidas Copa Pure', price: 1350000, image: '/default-image.png' },
    { id: 103, name: 'Puma Future Z', price: 980000, image: '/default-image.png' }
  ];

  const handleCheckout = () => {
    router.push('/user/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingBagIcon className="h-6 w-6 mr-2 text-red-600" />
            GIỎ HÀNG CỦA BẠN
          </h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showAnimation ? 1 : 0, y: showAnimation ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Sản phẩm ({products.length})</h2>
                  {products.length > 0 && (
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      Lưu giỏ hàng
                    </button>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Giỏ hàng của bạn đang trống</h3>
                    <p className="mt-1 text-gray-500">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Select All Checkbox */}
                    <div className="flex items-center pb-4 border-b border-gray-200">
                      <input 
                        type="checkbox" 
                        id="select-all"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-700">
                        Chọn tất cả ({products.filter(p => p.selected).length}/{products.length})
                      </label>
                    </div>
                    
                    {products.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex flex-col sm:flex-row ${index < products.length - 1 ? 'pb-6 border-b border-gray-200' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-full sm:w-36 h-36 bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={product.selected}
                              onChange={() => toggleSelectProduct(product.id)}
                              className="absolute top-2 left-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <Image
                              src={product.image}
                              alt={product.name}
                              className="object-contain h-32 w-32"
                              width={128}
                              height={128}
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                                {product.brand}
                              </span>
                              <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span>Size: {product.size}</span>
                                <span className="mx-2">•</span>
                                <span>Màu: {product.color}</span>
                              </div>
                              
                              <div className="mt-2">
                                {product.originalPrice > product.price && (
                                  <div className="inline-flex items-center bg-red-50 px-2 py-0.5 rounded text-xs font-medium text-red-800">
                                    Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-lg text-red-600">{product.price.toLocaleString()} VND</div>
                              {product.originalPrice > product.price && (
                                <div className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()} VND</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 flex justify-between items-center">
                            <button 
                              onClick={() => removeProduct(product.id)}
                              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              Xóa
                            </button>
                            
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                              <button
                                onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <input
                                type="text"
                                value={product.quantity}
                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center border-x border-gray-300 py-1"
                              />
                              <button
                                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Recommended Products */}
            {products.length > 0 && (
              <motion.div 
                className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showAnimation ? 1 : 0, y: showAnimation ? 0 : 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">Sản phẩm đề xuất</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-36 w-full bg-gray-100 relative">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                          <p className="mt-1 text-red-600 font-medium">{product.price.toLocaleString()} VND</p>
                          <button className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm">
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: showAnimation ? 1 : 0, x: showAnimation ? 0 : 20 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">ĐƠN HÀNG (TẠM TÍNH)</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tổng tiền hàng</span>
                    <span className="font-medium">{subtotal.toLocaleString()} VND</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Giảm giá trực tiếp</span>
                    <span className="font-medium text-green-600">-{discount.toLocaleString()} VND</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Phí vận chuyển</span>
                    <span className="font-medium">{shipping.toLocaleString()} VND</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Tổng tiền thanh toán</span>
                    <span className="text-xl font-bold text-red-600">{total.toLocaleString()} VND</span>
                  </div>
                  
                  <div className="text-green-600 text-right text-sm mt-1">
                    Tiết kiệm {discount.toLocaleString()} VND
                  </div>
                  
                  <div className="text-gray-500 text-right text-xs">
                    (Đã bao gồm thuế VAT nếu có)
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center justify-center"
                >
                  TIẾP TỤC THANH TOÁN
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Customer Support & Security */}
      <div className="mt-12 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
            <svg className="h-10 w-10 text-red-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-500">Miễn phí giao hàng toàn quốc cho đơn từ 500K</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
            <svg className="h-10 w-10 text-red-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Đảm bảo chất lượng</h3>
              <p className="text-sm text-gray-500">Sản phẩm chính hãng 100%, đổi trả trong 30 ngày</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm">
            <svg className="h-10 w-10 text-red-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-500">Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}