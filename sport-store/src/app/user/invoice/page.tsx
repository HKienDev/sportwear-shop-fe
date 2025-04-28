'use client';

import { useState, useEffect } from 'react';
import InvoiceHeader from '@/components/user/invoice/InvoiceHeader';
import OrderStatusTimeline from '@/components/user/invoice/OrderStatusTimeline';
import AddressInfo from '@/components/user/invoice/AddressInfo';
import ProductList from '@/components/user/invoice/ProductList';
import PaymentSummary from '@/components/user/invoice/PaymentSummary';

export default function CreativeInvoice() {
  const [activeSection, setActiveSection] = useState('details');
  const [isPrinting, setIsPrinting] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
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

  // Calculate order timeline
  const orderDate = new Date(2025, 0, 15);
  const processingDate = new Date(2025, 0, 15);
  const shippingDate = new Date(2025, 0, 16);
  const deliveryDate = new Date(2025, 0, 18);
  
  const getTimelineStatus = () => {
    return 'delivered';
  };
  
  const currentStatus = getTimelineStatus();

  // Mock data for products
  const products = [
    {
      id: 1,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      description: 'Giày sân cỏ tự nhiên • Mặc định • Kích cỡ: 43',
      price: 4000000,
      quantity: 2,
      brand: 'Nike'
    },
    // Add more products as needed
  ];

  // Mock data for addresses
  const storeAddress = {
    name: 'VJU SPORT',
    phone: '+84 362 195 258',
    address: [
      'Đường Lưu Hữu Phước, Phường Cầu Diễn,',
      'Quận Nam Từ Liêm, Hà Nội'
    ]
  };

  const deliveryAddress = {
    name: 'Hoàng Tiến Trung Kiên',
    address: [
      'Số 94 (Công khắc số 2006), Đường Phú Mỹ,',
      'Mỹ Đình 2, Nam Từ Liêm, Hà Nội'
    ],
    phone: '+84 362 195 258'
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isPrinting ? 'print-mode' : ''}`}>
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
      
      <InvoiceHeader 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handlePrint={handlePrint}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 print-mt-0">
        <div className={`receipt-card bg-white rounded-2xl shadow-lg overflow-hidden mb-6 ${animateItems ? 'animated-scale' : ''} transition-transform duration-500 print-break-avoid`}
             style={{transformOrigin: 'center top', transform: animateItems ? 'scale(1)' : 'scale(0.97)'}}>
          
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
          
          <OrderStatusTimeline 
            currentStatus={currentStatus}
            orderDate={orderDate}
            processingDate={processingDate}
            shippingDate={shippingDate}
            deliveryDate={deliveryDate}
          />
          
          <div className="p-6">
            <AddressInfo 
              storeAddress={storeAddress}
              deliveryAddress={deliveryAddress}
            />
            
            <ProductList 
              products={products}
              animateItems={animateItems}
            />
            
            <PaymentSummary 
              subtotal={16000000}
              discount={0}
              shipping={30000}
              total={16030000}
              paid={16030000}
            />
          </div>
        </div>
      </main>
    </div>
  );
}