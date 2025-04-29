'use client';

import { useState, useEffect } from 'react';
import InvoiceHeader from '@/components/user/invoice/InvoiceHeader';
import OrderStatusTimeline from '@/components/user/invoice/OrderStatusTimeline';
import AddressInfo from '@/components/user/invoice/AddressInfo';
import ProductList from '@/components/user/invoice/ProductList';
import PaymentSummary from '@/components/user/invoice/PaymentSummary';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  mainImage?: string;
  category?: {
    name: string;
  };
  color?: string;
  size?: string;
}

interface Order {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      street: string;
      ward: {
        name: string;
        code: number;
      };
      district: {
        name: string;
        code: number;
      };
      province: {
        name: string;
        code: number;
      };
    };
  };
}

export default function CreativeInvoice() {
  const [activeSection, setActiveSection] = useState('details');
  const [isPrinting, setIsPrinting] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [order, setOrder] = useState<Order>({
    shippingAddress: {
      fullName: 'Hoàng Tiến Trung Kiên',
      phone: '+84 362 195 258',
      address: {
        street: 'Số 94 (Công khắc số 2006), Đường Phú Mỹ',
        ward: {
          name: 'Mỹ Đình 2',
          code: 1
        },
        district: {
          name: 'Nam Từ Liêm',
          code: 1
        },
        province: {
          name: 'Hà Nội',
          code: 1
        }
      }
    }
  });
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/orders/my-orders/123');
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, []);
  
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
  const products: Product[] = [
    {
      id: 1,
      name: 'Nike Air Zoom Mercurial Superfly X Elite FG',
      description: 'Giày sân cỏ tự nhiên • Mặc định • Kích cỡ: 43',
      price: 4000000,
      quantity: 2,
      brand: 'Nike',
      mainImage: 'https://res.cloudinary.com/dta6mizzm/image/upload/v1745478577/sport-store/products/yfn8aufsp4amjws4ger6.png',
      category: {
        name: 'Giày đá banh'
      },
      color: 'Đen/Trắng',
      size: '43'
    }
  ];

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
            statusHistory={[
              { status: 'pending', updatedAt: orderDate.toISOString(), updatedBy: 'system', note: '', _id: '1' },
              { status: 'confirmed', updatedAt: processingDate.toISOString(), updatedBy: 'system', note: '', _id: '2' },
              { status: 'shipped', updatedAt: shippingDate.toISOString(), updatedBy: 'system', note: '', _id: '3' },
              { status: 'delivered', updatedAt: deliveryDate.toISOString(), updatedBy: 'system', note: '', _id: '4' }
            ]}
          />
          
          <div className="p-6">
            <AddressInfo 
              storeAddress={{
                name: 'VJU SPORT',
                phone: '+84 362 195 258',
                address: [
                  'Đường Lưu Hữu Phước, Phường Cầu Diễn,',
                  'Quận Nam Từ Liêm, Hà Nội'
                ]
              }}
              deliveryAddress={{
                name: order.shippingAddress.fullName,
                phone: order.shippingAddress.phone,
                address: {
                  street: order.shippingAddress.address.street,
                  ward: order.shippingAddress.address.ward,
                  district: order.shippingAddress.address.district,
                  province: order.shippingAddress.address.province
                }
              }}
            />
            
            <ProductList 
              products={products.map(p => ({
                ...p,
                image: p.mainImage || '/images/placeholder.jpg',
                categoryName: p.category?.name || 'Thể thao',
                color: p.color || 'Mặc định',
                size: p.size || 'Mặc định'
              }))}
              animateItems={animateItems}
            />
            
            <PaymentSummary 
              subtotal={16000000}
              discount={0}
              couponDiscount={0}
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