'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TOKEN_CONFIG } from '@/config/token';
import type { Coupon } from '@/types/coupon';
import { toast } from 'sonner';

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  onSubmitCoupon: (e: React.FormEvent<HTMLFormElement>) => void;
  showCouponOptions: boolean;
  setShowCouponOptions: (show: boolean) => void;
}

export default function CouponSection({
  couponCode,
  setCouponCode,
  onSubmitCoupon,
  showCouponOptions,
  setShowCouponOptions,
}: CouponSectionProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!showCouponOptions) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        const res = await fetch('http://localhost:4000/api/coupons', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: 'include',
        });
        
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          setError('Phiên đăng nhập đã hết hạn');
          return;
        }
        
        const data = await res.json();
        
        if (data.success && data.data && data.data.coupons) {
          // Lọc các mã giảm giá còn hoạt động và chưa hết hạn
          const availableCoupons = data.data.coupons.filter((coupon: Coupon) => {
            return coupon.isAvailable && !coupon.isExpired;
          });
          
          setCoupons(availableCoupons);
        } else {
          setError('Không thể tải danh sách mã giảm giá');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải mã giảm giá');
        console.error('Error fetching coupons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [showCouponOptions]);

  const handleApplyCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setApplyError('Vui lòng nhập mã giảm giá');
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }
    
    setApplyingCoupon(true);
    setApplyError(null);
    
    try {
      // Kiểm tra xem mã giảm giá có tồn tại trong danh sách không
      const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase());
      
      if (!coupon) {
        setApplyError('Mã giảm giá không tồn tại');
        toast.error('Mã giảm giá không tồn tại');
        return;
      }
      
      if (!coupon.isAvailable) {
        setApplyError('Mã giảm giá đã hết hạn hoặc tạm dừng');
        toast.error('Mã giảm giá đã hết hạn hoặc tạm dừng');
        return;
      }
      
      if (coupon.isExpired) {
        setApplyError('Mã giảm giá đã hết hạn');
        toast.error('Mã giảm giá đã hết hạn');
        return;
      }
      
      // Nếu mã giảm giá hợp lệ, gọi hàm onSubmitCoupon từ props
      onSubmitCoupon(e);
      toast.success(`Áp dụng mã giảm giá ${coupon.code} thành công!`);
    } catch (err) {
      setApplyError('Đã xảy ra lỗi khi áp dụng mã giảm giá');
      toast.error('Đã xảy ra lỗi khi áp dụng mã giảm giá');
      console.error('Error applying coupon:', err);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const formatCouponValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `Giảm ${coupon.value}%`;
    } else {
      return `Giảm ${coupon.value.toLocaleString('vi-VN')}đ`;
    }
  };

  const formatCouponDescription = (coupon: Coupon) => {
    const minAmount = coupon.minimumPurchaseAmount.toLocaleString('vi-VN');
    return `Áp dụng cho đơn hàng từ ${minAmount}đ`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">MÃ GIẢM GIÁ</h2>
        <button
          type="button"
          onClick={() => setShowCouponOptions(!showCouponOptions)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          {showCouponOptions ? (
            <>
              <span className="mr-1">Ẩn mã phổ biến</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="mr-1">Xem mã phổ biến</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleApplyCoupon} className="flex flex-col">
        <div className="flex">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Nhập mã giảm giá (Chỉ áp dụng 1 lần)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={applyingCoupon}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {applyingCoupon ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              'Áp dụng'
            )}
          </button>
        </div>
        
        {applyError && (
          <p className="mt-2 text-sm text-red-500">{applyError}</p>
        )}
      </form>

      {showCouponOptions && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Mã giảm giá phổ biến:</p>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Đang tải...</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Đang tải mã giảm giá...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Không có mã giảm giá nào khả dụng</p>
            </div>
          ) : (
            <div className={`space-y-2 ${coupons.length > 3 ? 'max-h-60 overflow-y-auto pr-2' : ''}`}>
              {coupons.map((coupon) => (
                <button
                  key={coupon._id}
                  onClick={() => setCouponCode(coupon.code)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-600">{coupon.code}</span>
                    <span className="text-sm text-gray-500">{formatCouponValue(coupon)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatCouponDescription(coupon)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 