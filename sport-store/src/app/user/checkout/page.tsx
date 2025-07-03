'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CartItem } from '@/types/cart';
import { PaymentMethod, ShippingMethod, OrderStatus } from '@/types/order';
import { ShippingAddress } from '@/types/order';
import { Coupon } from '@/types/coupon';
import OrderItems from '@/components/user/checkout/OrderItems';
import OrderSummary from '@/components/user/checkout/OrderSummary';
import DeliveryMethod, { SHIPPING_FEES } from '@/components/user/checkout/DeliveryMethod';
import PaymentMethodComponent from '@/components/user/checkout/PaymentMethod';
import DeliveryInfo from '@/components/user/checkout/DeliveryInfo';
import CouponSection from '@/components/user/checkout/CouponSection';
import { ArrowLeft } from 'lucide-react';
import { useCartOptimized } from '@/hooks/useCartOptimized';
import { validateSelectedItems } from '@/utils/checkoutUtils';
import { useAuth } from '@/context/authContext';

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Sử dụng Zustand store thay vì local state
  const {
    cart,
    loading,
    error,
    cartTotals,
    updateCartItem,
    removeFromCart,
    fetchCart,
  } = useCartOptimized();

  // Selected items state - lấy từ localStorage
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('items');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: {
      province: {
        name: '',
        code: 0
      },
      district: {
        name: '',
        code: 0
      },
      ward: {
        name: '',
        code: 0
      },
      street: ''
    }
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponOptions, setShowCouponOptions] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [currentCartTotal, setCurrentCartTotal] = useState(0);

  // Load selected items từ localStorage khi mount
  useEffect(() => {
    const savedSelectedItems = localStorage.getItem('checkout_selected_items');
    if (savedSelectedItems) {
      try {
        const parsed = JSON.parse(savedSelectedItems);
        setSelectedItems(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing selected items:', error);
        setSelectedItems([]);
      }
    }
  }, []);

  // Hook đã tự động fetch cart khi mount, không cần gọi thêm

  // Tính toán cart items được chọn
  const selectedCartItems = useCallback(() => {
    if (!cart?.items || selectedItems.length === 0) {
      return [];
    }
    return cart.items.filter(item => selectedItems.includes(item._id));
  }, [cart?.items, selectedItems]);

  // Tính toán totals cho selected items
  const selectedItemsTotals = useCallback(() => {
    const items = selectedCartItems();
    let totalOriginalPrice = 0;
    let totalSalePrice = 0;
    
    items.forEach((item: CartItem) => {
      const originalPrice = item.product.originalPrice;
      const salePrice = item.product.salePrice;
      const quantity = item.quantity;
      
      totalOriginalPrice += originalPrice * quantity;
      totalSalePrice += salePrice * quantity;
    });
    
    return {
      originalTotal: totalOriginalPrice,
      subtotal: totalSalePrice,
      discount: totalOriginalPrice - totalSalePrice,
      itemCount: items.length
    };
  }, [selectedCartItems]);

  // Cập nhật totals khi selected items hoặc cart thay đổi
  useEffect(() => {
    const totals = selectedItemsTotals();
    setOriginalTotal(totals.originalTotal);
    setSubtotal(totals.subtotal);
    setCurrentCartTotal(totals.subtotal);
    setDiscount(totals.discount);
    
    // Reset coupon nếu không có items được chọn
    if (totals.itemCount === 0) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode('');
    }
  }, [selectedItemsTotals]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Lấy phí vận chuyển từ DeliveryMethod
  const getShippingFee = useCallback(() => {
    const shippingMethod = SHIPPING_FEES.find(fee => fee.method === selectedShippingMethod);
    return shippingMethod ? shippingMethod.fee : 0;
  }, [selectedShippingMethod]);

  // Cập nhật phí vận chuyển khi thay đổi phương thức vận chuyển
  useEffect(() => {
    setShipping(getShippingFee());
  }, [getShippingFee]);

  // Cập nhật coupon discount khi subtotal thay đổi
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      if (appliedCoupon.type === 'percentage') {
        const discountAmount = (subtotal * appliedCoupon.value) / 100;
        setCouponDiscount(Math.round(discountAmount));
      } else {
        setCouponDiscount(appliedCoupon.value);
      }
    } else if (!appliedCoupon) {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon]);

  const handleSubmitCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Gọi API get coupon by code
      const response = await api.get(`/coupons/${encodeURIComponent(couponCode.trim())}`);

      if (response.data.success && response.data.data) {
        const coupon = response.data.data;

        // Kiểm tra trạng thái
        if (coupon.status !== "Hoạt động") {
          throw new Error("Mã giảm giá không hoạt động");
        }

        // Kiểm tra ngày hiệu lực
        const now = new Date();
        // Xử lý ngày tháng từ API một cách an toàn
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        
        console.log('Thời gian hiện tại:', now);
        console.log('Ngày bắt đầu:', startDate);
        console.log('Ngày kết thúc:', endDate);

        if (now < startDate) {
          throw new Error("Mã giảm giá chưa có hiệu lực");
        }

        if (now > endDate) {
          throw new Error("Mã giảm giá đã hết hạn");
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usageCount >= coupon.usageLimit) {
          throw new Error("Mã giảm giá đã hết lượt sử dụng");
        }

        // Kiểm tra số lần sử dụng của user
        const userUsageCount = coupon.usedBy.filter((usage: { user: string }) => 
          usage.user === "67ef8e3547b8f021b9855447" // TODO: Thay bằng ID của user hiện tại
        ).length;

        if (userUsageCount >= coupon.userLimit) {
          throw new Error("Bạn đã sử dụng hết lượt cho mã giảm giá này");
        }

        // Tính tổng giá dựa trên subtotal
        const productSubtotal = subtotal;

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (coupon.minimumPurchaseAmount > 0 && productSubtotal < coupon.minimumPurchaseAmount) {
          throw new Error(`Đơn hàng tối thiểu ${coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ để áp dụng mã này`);
        }

        // Nếu tất cả điều kiện đều hợp lệ, cập nhật state
        setAppliedCoupon(coupon);
        // Coupon discount sẽ được tính tự động trong useEffect
        
        toast.success(`Áp dụng mã giảm giá ${coupon.code} thành công!`);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể áp dụng mã giảm giá');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate user authentication
      if (!user?._id) {
        toast.error('Vui lòng đăng nhập để đặt hàng');
        router.push('/auth/login');
        return;
      }

      // Validate selected items
      const validation = validateSelectedItems(cart?.items || [], selectedItems);
      if (!validation.isValid) {
        toast.error(validation.message || 'Vui lòng chọn sản phẩm để thanh toán');
        return;
      }

      // Kiểm tra giỏ hàng
      if (!cart || cart.items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      // Validate shipping address
      if (!shippingAddress.fullName || !shippingAddress.phone || 
          !shippingAddress.address.province.name || !shippingAddress.address.district.name || 
          !shippingAddress.address.ward.name || !shippingAddress.address.street) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }

      // Lọc ra các sản phẩm được chọn
      const selectedCartItems = cart.items.filter(item => selectedItems.includes(item._id));
      
      if (selectedCartItems.length === 0) {
        toast.error('Không tìm thấy sản phẩm đã chọn');
        return;
      }

      // Create order data với format đúng backend schema
      const orderData = {
        user: user?._id || "",
        items: selectedCartItems.map(item => ({
          sku: item.product.sku,
          quantity: Number(item.quantity),
          color: item.product.colors?.[0] || 'Mặc định',
          size: item.product.sizes?.[0] || 'Mặc định'
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: {
            province: {
              name: shippingAddress.address.province.name,
              code: shippingAddress.address.province.code
            },
            district: {
              name: shippingAddress.address.district.name,
              code: shippingAddress.address.district.code
            },
            ward: {
              name: shippingAddress.address.ward.name,
              code: shippingAddress.address.ward.code
            },
            street: shippingAddress.address.street
          }
        },
        paymentMethod: selectedPaymentMethod.toUpperCase(),
        shippingMethod: selectedShippingMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        totalAmount: total,
        shippingFee: shipping,
        discount: discount + couponDiscount,
        coupon: appliedCoupon?.code || '',
        note: ''
      };

      console.log('📦 Dữ liệu đơn hàng:', orderData);

      // Tăng timeout lên 30s và thêm retry logic
      const createOrder = async (retryCount = 0) => {
        try {
          const response = await api.post('/orders', orderData, {
            timeout: 30000 // 30 seconds
          });
          return response;
        } catch (error: unknown) {
          const err = error as { code?: string };
          if (err.code === 'ECONNABORTED' && retryCount < 2) {
            // Retry với delay tăng dần
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return createOrder(retryCount + 1);
          }
          throw error;
        }
      };

      const response = await createOrder();

      if (response.data.success) {
        // Xóa các item đã thanh toán khỏi giỏ hàng
        const promises = selectedCartItems.map(item => 
          removeFromCart({
            sku: item.product.sku,
            color: item.color,
            size: item.size,
          })
        );
        
        try {
          await Promise.all(promises);
        } catch (error) {
          console.error('Error removing ordered items from cart:', error);
          // Không block order success nếu remove cart fail
        }
        
        // Xóa selected items khỏi localStorage
        localStorage.removeItem('checkout_selected_items');
        
        toast.success('Đặt hàng thành công!');
        const { orderId } = response.data.data;
        
        // Chuyển hướng đến trang invoice
        router.push(`/user/invoice/${orderId}`);
      } else {
        toast.error(response.data.message || 'Không thể tạo đơn hàng');
      }
    } catch (error: unknown) {
      console.error('Error creating order:', error);
      const err = error as { code?: string; response?: { data?: { message?: string } } };
      if (err.code === 'ECONNABORTED') {
        toast.error('Quá thời gian xử lý, vui lòng thử lại');
      } else {
        toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra khi tạo đơn hàng');
      }
    }
  };

  // Tính tổng tiền thanh toán
  const total = subtotal - couponDiscount + shipping;

  const handleGoBack = () => {
    router.back();
  };

  const handleCartUpdate = useCallback((items: CartItem[]) => {
    // Không cần update local state nữa vì đã dùng store
    // Store sẽ tự động update khi có thay đổi
  }, []);

  const handleCartTotalChange = useCallback((newTotal: number) => {
    setCurrentCartTotal(newTotal);
    setSubtotal(newTotal);
    
    // Tính lại discount dựa trên giá gốc
    const items = selectedCartItems();
    if (items.length > 0) {
      const totalOriginalPrice = items.reduce((sum: number, item: CartItem) => sum + (item.product.originalPrice * item.quantity), 0);
      setDiscount(totalOriginalPrice - newTotal);
      setOriginalTotal(totalOriginalPrice);
    }
    
    // Reset coupon nếu tổng tiền thay đổi đáng kể
    if (appliedCoupon && Math.abs(newTotal - subtotal) > 1000) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode('');
      toast.info('Mã giảm giá đã được reset do thay đổi giỏ hàng');
    }
  }, [selectedCartItems, appliedCoupon, currentCartTotal]);

  // Hiển thị loading nếu đang fetch cart
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Đang tải giỏ hàng...</div>
        </div>
      </div>
    );
  }

  // Hiển thị error nếu có lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Lỗi: {error}</div>
          <button 
            onClick={() => fetchCart()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu không có selected items
  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Không có sản phẩm nào được chọn để thanh toán</div>
          <button 
            onClick={() => router.push('/user/cart')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-500 hover:text-gray-700 mr-6"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột bên trái - 8/12 */}
          <div className="lg:col-span-8 space-y-6">
            <DeliveryMethod
              expandedSection={expandedSection}
              deliveryMethod={selectedShippingMethod}
              setDeliveryMethod={setSelectedShippingMethod}
              toggleSection={toggleSection}
              formatPrice={formatPrice}
            />

            <OrderItems
              cartItems={selectedCartItems()}
              onTotalChange={handleCartTotalChange}
              loading={false}
            />

            <PaymentMethodComponent
              expandedSection={expandedSection}
              paymentMethod={selectedPaymentMethod}
              setPaymentMethod={setSelectedPaymentMethod}
              toggleSection={toggleSection}
            />
          </div>

          {/* Cột bên phải - 4/12 */}
          <div className="lg:col-span-4 space-y-6">
            <DeliveryInfo 
              onAddressChange={setShippingAddress}
            />

            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onSubmitCoupon={handleSubmitCoupon}
              showCouponOptions={showCouponOptions}
              setShowCouponOptions={setShowCouponOptions}
            />

            <OrderSummary
              originalTotal={originalTotal}
              subtotal={subtotal}
              discount={discount}
              couponDiscount={couponDiscount}
              shipping={shipping}
              total={total}
              formatPrice={formatPrice}
              onPlaceOrder={handlePlaceOrder}
              appliedCoupon={appliedCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}