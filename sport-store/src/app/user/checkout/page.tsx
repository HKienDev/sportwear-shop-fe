'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CartState, CartItem } from '@/types/cart';
import { cartService } from '@/services/cartService';
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
import CheckoutStripePayment from '@/components/user/checkout/CheckoutStripePayment';
import StripePaymentForm from '@/components/user/checkout/StripePaymentForm';

export default function Checkout() {
  const [cart, setCart] = useState<CartState | null>(null);
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
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        if (response.success) {
          setCart(response.data);
          
          // Tính toán tổng tiền hàng và giảm giá
          let totalOriginalPrice = 0;
          let totalSalePrice = 0;
          let totalDirectDiscount = 0;
          
          console.log('🛒 Dữ liệu giỏ hàng:', response.data);
          
          response.data.items.forEach((item: CartItem) => {
            const originalPrice = item.product.originalPrice;
            const salePrice = item.product.salePrice;
            const quantity = item.quantity;
            
            console.log(`📦 Sản phẩm: ${item.product.name}`);
            console.log(`💰 Giá gốc: ${originalPrice}`);
            console.log(`💰 Giá khuyến mãi: ${salePrice}`);
            console.log(`🔢 Số lượng: ${quantity}`);
            console.log(`💵 Tổng tiền: ${salePrice * quantity}`);
            
            totalOriginalPrice += originalPrice * quantity;
            totalSalePrice += salePrice * quantity;
            totalDirectDiscount += (originalPrice - salePrice) * quantity;
          });
          
          console.log(`💰 Tổng tiền gốc: ${totalOriginalPrice}`);
          console.log(`💰 Tổng tiền sau giảm giá: ${totalSalePrice}`);
          console.log(`💰 Tổng giảm giá: ${totalDirectDiscount}`);
          
          setOriginalTotal(totalOriginalPrice);
          setSubtotal(totalSalePrice);
          setDiscount(totalOriginalPrice - totalSalePrice);
          setTotalAfterDiscount(totalSalePrice);
        } else {
          toast.error('Không thể tải thông tin giỏ hàng');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Không thể tải thông tin giỏ hàng');
      }
    };

    fetchCart();
  }, []);

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

        // Tính tổng giá dựa trên salePrice
        const productSubtotal = cart?.items.reduce((total, item) => {
          return total + (item.product.salePrice * item.quantity);
        }, 0) || 0;

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (coupon.minimumPurchaseAmount > 0 && productSubtotal < coupon.minimumPurchaseAmount) {
          throw new Error(`Đơn hàng tối thiểu ${coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ để áp dụng mã này`);
        }

        // Nếu tất cả điều kiện đều hợp lệ, cập nhật state
        setAppliedCoupon(coupon);
        
        // Tính giảm giá từ mã giảm giá dựa trên salePrice
        if (coupon.type === 'percentage') {
          // Tính giảm giá theo phần trăm
          const discountAmount = (productSubtotal * coupon.value) / 100;
          setCouponDiscount(Math.round(discountAmount)); // Làm tròn để tránh số thập phân
        } else {
          // Giảm giá cố định
          setCouponDiscount(coupon.value);
        }
        
        toast.success(`Áp dụng mã giảm giá ${coupon.code} thành công!`);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể áp dụng mã giảm giá');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!shippingAddress) {
        toast.error('Vui lòng nhập địa chỉ giao hàng');
        return;
      }

      // Nếu phương thức thanh toán là Stripe, không tạo đơn hàng ngay
      if (selectedPaymentMethod === PaymentMethod.STRIPE) {
        // Lưu thông tin đơn hàng để tạo sau khi thanh toán thành công
        const orderData = {
          items: cart?.items.map(item => ({
            sku: item.product.sku,
            quantity: item.quantity,
            color: item.color || 'Mặc định',
            size: item.size || 'Mặc định'
          })),
          shippingAddress,
          shippingMethod: selectedShippingMethod,
          paymentMethod: selectedPaymentMethod,
          couponCode: appliedCoupon?.code || '',
          notes: '',
          status: OrderStatus.PENDING
        };

        // Lưu orderData vào localStorage để sử dụng sau khi thanh toán thành công
        localStorage.setItem('pendingOrderData', JSON.stringify(orderData));
        
        // Mở modal thanh toán Stripe
        setIsStripeModalOpen(true);
        setAmount(total);
        toast.info('Vui lòng hoàn thành thanh toán để xác nhận đơn hàng');
        return;
      }

      // Nếu là COD, tạo đơn hàng ngay
      const orderData = {
        items: cart?.items.map(item => ({
          sku: item.product.sku,
          quantity: item.quantity,
          color: item.color || 'Mặc định',
          size: item.size || 'Mặc định'
        })),
        shippingAddress,
        shippingMethod: selectedShippingMethod,
        paymentMethod: selectedPaymentMethod,
        couponCode: appliedCoupon?.code || '',
        notes: '',
        status: OrderStatus.PENDING
      };

      console.log('📦 Dữ liệu đơn hàng:', orderData);

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        const { orderId } = response.data.data;
        // Nếu là COD, xóa giỏ hàng và chuyển hướng đến trang invoice
        await cartService.clearCart();
        toast.success('Đặt hàng thành công!');
        router.push(`/user/invoice/${orderId}`);
      } else {
        toast.error(response.data.message || 'Không thể tạo đơn hàng');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Quá thời gian xử lý đơn hàng, vui lòng thử lại');
      } else if (error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để đặt hàng');
        router.push('/auth/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Thông tin đơn hàng không hợp lệ');
      } else if (error.response?.status >= 500) {
        toast.error('Có lỗi xảy ra từ phía server. Vui lòng thử lại sau');
      } else if (error.message === 'Network Error') {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng');
      } else {
        toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi tạo đơn hàng');
      }
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Lấy thông tin đơn hàng từ localStorage
      const pendingOrderData = localStorage.getItem('pendingOrderData');
      
      if (!pendingOrderData) {
        toast.error('Không tìm thấy thông tin đơn hàng');
        setIsStripeModalOpen(false);
        return;
      }

      const orderData = JSON.parse(pendingOrderData);
      
      // Tạo đơn hàng sau khi thanh toán thành công
      console.log('📦 Tạo đơn hàng sau thanh toán thành công:', orderData);
      
      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        const { orderId } = response.data.data;
        
        // Xóa thông tin đơn hàng tạm thời
        localStorage.removeItem('pendingOrderData');
        
        // Xóa giỏ hàng sau khi thanh toán thành công
        await cartService.clearCart();
        toast.success('Thanh toán và đặt hàng thành công!');
        
        setIsStripeModalOpen(false);
        router.push(`/user/invoice/${orderId}`);
      } else {
        toast.error(response.data.message || 'Không thể tạo đơn hàng sau thanh toán');
        setIsStripeModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating order after payment:', error);
      toast.error('Thanh toán thành công nhưng không thể tạo đơn hàng. Vui lòng liên hệ hỗ trợ.');
      setIsStripeModalOpen(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  // Tính tổng tiền thanh toán
  const total = totalAfterDiscount - couponDiscount + shipping;

  const handleGoBack = () => {
    router.back();
  };

  const handleStripePayment = async (orderId: string, amount: number) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể tạo phiên thanh toán');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Lỗi khi tạo phiên thanh toán');
    }
  };

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
              expandedSection={expandedSection}
              toggleSection={toggleSection}
              formatPrice={formatPrice}
            />

            <PaymentMethodComponent
              expandedSection={expandedSection}
              paymentMethod={selectedPaymentMethod}
              setPaymentMethod={setSelectedPaymentMethod}
              toggleSection={toggleSection}
              orderId={createdOrderId ?? undefined}
              amount={totalAfterDiscount}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
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
      
      {isStripeModalOpen && (
        <CheckoutStripePayment
          isOpen={isStripeModalOpen}
          onClose={() => setIsStripeModalOpen(false)}
          amount={total}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      
      {clientSecret && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Thanh toán đơn hàng</h2>
          <StripePaymentForm clientSecret={clientSecret} amount={amount} />
        </div>
      )}
    </div>
  );
}