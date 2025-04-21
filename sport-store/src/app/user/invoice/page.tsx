'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, Home, CreditCard, Phone, Mail, MapPin, Share2, Download, Printer, ArrowLeft } from 'lucide-react';

export default function CreativeInvoice() {
  const [activeSection, setActiveSection] = useState('details');
  const [isPrinting, setIsPrinting] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateItems(true);
    }, 100);
  }, []);
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Calculate order timeline (for display purposes)
  const orderDate = new Date(2025, 0, 15); // Jan 15, 2025
  const processingDate = new Date(2025, 0, 15);
  const shippingDate = new Date(2025, 0, 16);
  const deliveryDate = new Date(2025, 0, 18);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getTimelineStatus = () => {
    // In a real app this would be dynamic based on actual order status
    return 'delivered'; // Options: processing, shipping, delivered
  };
  
  const currentStatus = getTimelineStatus();

  return (
    <div className={`min-h-screen bg-gray-50 ${isPrinting ? 'print-mode' : ''}`}>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .receipt-card { box-shadow: none !important; }
          .print-mt-0 { margin-top: 0 !important; }
          .print-break-avoid { break-inside: avoid; }
          .animated-scale { transform: none !important; }
        }
      `}</style>
      
      {/* Navigation header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="flex items-center text-gray-500 hover:text-gray-700 mr-6">
              <ArrowLeft size={18} className="mr-1" />
              <span>Quay lại</span>
            </button>
            <h1 className="text-xl font-medium text-gray-900">Hóa đơn #123456</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={() => setActiveSection('details')} 
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'details' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
              Chi tiết
            </button>
            <button onClick={() => setActiveSection('shipping')} 
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'shipping' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
              Vận chuyển
            </button>
            <button onClick={() => setActiveSection('support')} 
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'support' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
              Hỗ trợ
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Share2 size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Download size={18} />
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 print-mt-0">
        {/* Order status card */}
        <div className={`receipt-card bg-white rounded-2xl shadow-lg overflow-hidden mb-6 ${animateItems ? 'animated-scale' : ''} transition-transform duration-500 print-break-avoid`}
             style={{transformOrigin: 'center top', transform: animateItems ? 'scale(1)' : 'scale(0.97)'}}>
          
          {/* Top gradient banner and status */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold">HÓA ĐƠN</div>
                <div className="text-sm mt-1 text-red-100">Cảm ơn bạn đã mua hàng tại VJU SPORT</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">#123456</div>
                <div className="text-sm mt-1 text-red-100">15.1.2025</div>
              </div>
            </div>
          </div>
          
          {/* Status timeline */}
          <div className="px-6 py-5 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
              {/* Order confirmed */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <CreditCard size={20} />
                </div>
                <div className="text-xs font-medium mt-2 text-center">Đã thanh toán</div>
                <div className="text-xs text-gray-500">{formatDate(orderDate)}</div>
              </div>
              
              {/* Processing connector */}
              <div className={`h-1 flex-1 mx-1 ${currentStatus === 'processing' || currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              
              {/* Processing */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'processing' || currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Package size={20} />
                </div>
                <div className="text-xs font-medium mt-2 text-center">Xử lý</div>
                <div className="text-xs text-gray-500">{formatDate(processingDate)}</div>
              </div>
              
              {/* Shipping connector */}
              <div className={`h-1 flex-1 mx-1 ${currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              
              {/* Shipping */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Truck size={20} />
                </div>
                <div className="text-xs font-medium mt-2 text-center">Vận chuyển</div>
                <div className="text-xs text-gray-500">{formatDate(shippingDate)}</div>
              </div>
              
              {/* Delivered connector */}
              <div className={`h-1 flex-1 mx-1 ${currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              
              {/* Delivered */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Home size={20} />
                </div>
                <div className="text-xs font-medium mt-2 text-center">Đã giao</div>
                <div className="text-xs text-gray-500">{formatDate(deliveryDate)}</div>
              </div>
            </div>
          </div>
          
          {/* Order summary section */}
          <div className="p-6">
            {/* Addresses */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-700 mb-3">Thông tin cửa hàng</h3>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">VJU SPORT</div>
                  <div className="text-gray-600 mt-1">+84 362 195 258</div>
                  <div className="text-gray-600 mt-1">Đường Lưu Hữu Phước, Phường Cầu Diễn,</div>
                  <div className="text-gray-600">Quận Nam Từ Liêm, Hà Nội</div>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-700 mb-3">Địa chỉ nhận hàng</h3>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Hoàng Tiến Trung Kiên</div>
                  <div className="text-gray-600 mt-1">Số 94 (Công khắc số 2006), Đường Phú Mỹ,</div>
                  <div className="text-gray-600">Mỹ Đình 2, Nam Từ Liêm, Hà Nội</div>
                  <div className="text-gray-600 mt-1">+84 362 195 258</div>
                </div>
              </div>
            </div>
            
            {/* Product cards */}
            <h3 className="font-medium text-gray-700 mb-4">Các sản phẩm đã mua</h3>
            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={`flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-hidden ${animateItems ? 'animated-fade-in' : ''}`}
                     style={{
                       opacity: animateItems ? 1 : 0, 
                       transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
                       transition: `all 0.5s ease-out ${0.1 + item * 0.1}s`
                     }}>
                  <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-400 to-green-300 flex items-center justify-center">
                    <span className="text-white font-medium">Nike</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Nike Air Zoom Mercurial Superfly X Elite FG</h4>
                      <div className="mt-1 text-sm text-gray-500">Giày sân cỏ tự nhiên • Mặc định • Kích cỡ: 43</div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end">
                      <div className="font-medium text-gray-900">4.000.000 VND</div>
                      <div className="text-sm text-gray-500">Số lượng: 2</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Payment summary card */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-medium text-gray-700 mb-4">Tổng thanh toán</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền sản phẩm:</span>
                  <span className="font-medium">16.000.000 VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium">0 VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">30.000 VND</span>
                </div>
                <div className="my-3 border-b border-gray-200"></div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Phải thanh toán:</span>
                  <span className="font-semibold text-gray-900">16.030.000 VND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="font-medium text-green-600">16.030.000 VND</span>
                </div>
                <div className="mt-4 flex items-center justify-center bg-green-50 py-2 px-4 rounded-lg">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-700">Đã hoàn tất thanh toán</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact and support */}
        <div className={`receipt-card bg-white rounded-2xl shadow-lg overflow-hidden ${animateItems ? 'animated-scale' : ''} transition-transform duration-500 delay-300 print-break-avoid`} 
             style={{transformOrigin: 'center top', transform: animateItems ? 'scale(1)' : 'scale(0.97)'}}>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin hỗ trợ</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-start">
                <Phone size={20} className="text-red-500 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Số điện thoại</div>
                  <a href="tel:+84865206198" className="text-red-600 hover:text-red-700">+84 865 206 198</a>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-start">
                <Mail size={20} className="text-red-500 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Email</div>
                  <a href="mailto:support@vjusport.vn" className="text-red-600 hover:text-red-700">support@vjusport.vn</a>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-start">
                <MapPin size={20} className="text-red-500 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Địa chỉ</div>
                  <div className="text-gray-600">Đường Lưu Hữu Phước, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội</div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500">© 2025 VJU SPORT • Cảm ơn quý khách đã mua hàng!</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Loading overlay for printing */}
      {isPrinting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mr-3"></div>
              <span className="text-lg">Đang chuẩn bị bản in...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}