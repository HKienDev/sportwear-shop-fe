'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CartState, CartItem } from '@/types/cart';
import { cartService } from '@/services/cartService';
import { PaymentMethod, ShippingMethod } from '@/types/order';
import { ShippingAddress } from '@/types/order';
import { Coupon } from '@/types/coupon';
import OrderItems from '@/components/user/checkout/OrderItems';
import OrderSummary from '@/components/user/checkout/OrderSummary';
import DeliveryMethod, { SHIPPING_FEES } from '@/components/user/checkout/DeliveryMethod';
import PaymentMethodComponent from '@/components/user/checkout/PaymentMethod';
import DeliveryInfo from '@/components/user/checkout/DeliveryInfo';
import CouponSection from '@/components/user/checkout/CouponSection';
import { ArrowLeft } from 'lucide-react';

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
          
          setSubtotal(totalOriginalPrice);
          setDiscount(totalDirectDiscount);
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
      // Kiểm tra giỏ hàng
      if (!cart || cart.items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      // Kiểm tra địa chỉ giao hàng
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: cart.items.map(item => ({
          sku: item.product.sku,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: {
            province: shippingAddress.address.province,
            district: shippingAddress.address.district,
            ward: shippingAddress.address.ward,
            street: shippingAddress.address.street
          }
        },
        paymentMethod: selectedPaymentMethod,
        shippingMethod: selectedShippingMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };

      console.log('📦 Dữ liệu đơn hàng:', orderData);

      // Gọi API tạo đơn hàng
      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await cartService.clearCart();
        
        toast.success('Đặt hàng thành công');
        
        // Chuyển hướng đến trang hóa đơn của đơn hàng vừa tạo
        const orderId = response.data.data._id;
        router.push(`/user/invoice/${orderId}`);
      } else {
        throw new Error(response.data.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể tạo đơn hàng');
    }
  };

  // Tính tổng tiền thanh toán
  const total = totalAfterDiscount - couponDiscount + shipping;

  const handleGoBack = () => {
    router.back();
  };

  return (
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
  );
}