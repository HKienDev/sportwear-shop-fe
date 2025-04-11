"use client";

import { useState, ChangeEvent } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { CartItem } from "@/types/cart";
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from "sonner";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  reviews: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

interface Coupon {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
  minimumPurchaseAmount: number;
}

export default function OrderProducts() {
  const { items: cartItems, addItem, removeItem } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();
  const { shippingMethod, setShippingMethod } = useShippingMethod();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoDetails, setPromoDetails] = useState<Coupon | null>(null);

  const fetchProduct = async (productId: string) => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Tìm kiếm sản phẩm bằng SKU
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      const data = await response.json();
      console.log("API Response:", data);
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (data.success === false) {
        throw new Error(data.message || "Không tìm thấy sản phẩm");
      }
      
      // Nếu dữ liệu trả về có cấu trúc khác
      if (data.product) {
        return data.product;
      } else if (data.data && data.data.product) {
        return data.data.product;
      } else if (data.data) {
        return data.data;
      } else {
        return data;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  };

  const handleProductIdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newProductId = e.target.value;
    setSearchTerm(newProductId);
    setSize("");
    setColor("");
    setAvailableSizes([]);
    setAvailableColors([]);
    setSelectedProduct(null);
    setError("");

    if (newProductId) {
      try {
        const productData = await fetchProduct(newProductId);
        console.log("Product Data:", productData);
        setSelectedProduct(productData);
        setAvailableSizes(productData.sizes || []);
        setAvailableColors(productData.colors || []);
      } catch (error) {
        console.error("Error in handleProductIdChange:", error);
        const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy thông tin sản phẩm";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!size && availableSizes.length > 0) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!color && availableColors.length > 0) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Số lượng vượt quá tồn kho (${product.stock})`);
      return;
    }

    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.salePrice || product.originalPrice,
      quantity: quantity,
      image: product.mainImage || "/images/placeholder.png",
      size: size,
      color: color
    };
    addItem(cartItem);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    // Tính tổng tiền sản phẩm
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    // Tính phí vận chuyển
    const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                       shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                       30000;
    
    // Tính giảm giá từ mã khuyến mãi (chỉ áp dụng cho giá sản phẩm, không áp dụng cho phí vận chuyển)
    let discountAmount = 0;
    if (promoDetails) {
      if (promoDetails.type === 'percentage') {
        discountAmount = (subtotal * promoDetails.value) / 100;
      } else if (promoDetails.type === 'fixed') {
        discountAmount = promoDetails.value;
      }
    }
    
    // Tổng cộng = (Giá sản phẩm - Giảm giá) + Phí vận chuyển
    return (subtotal - discountAmount) + shippingFee;
  };

  const total = calculateTotal();

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      // Tính tổng tiền sản phẩm (chưa bao gồm phí vận chuyển)
      const productSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      
      if (productSubtotal === 0) {
        toast.error("Vui lòng thêm sản phẩm vào giỏ hàng trước khi áp dụng mã giảm giá");
        return;
      }

      // Gọi API để kiểm tra mã giảm giá
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/code/${promoCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY)}`,
          },
        }
      );

      if (response.data.success) {
        const coupon = response.data.data;
        
        // Kiểm tra điều kiện áp dụng mã giảm giá
        if (coupon.status !== "active") {
          toast.error("Mã giảm giá không còn hoạt động");
          return;
        }

        // Kiểm tra thời hạn sử dụng
        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        
        // Chuyển đổi ngày tháng sang định dạng Việt Nam (DD/MM/YYYY HH:mm)
        const formatDateVN = (isoDate: Date) => {
          const vnTime = new Date(isoDate.getTime() + 7 * 60 * 60 * 1000);
          const day = vnTime.getUTCDate().toString().padStart(2, '0');
          const month = (vnTime.getUTCMonth() + 1).toString().padStart(2, '0');
          const year = vnTime.getUTCFullYear();
          const hours = vnTime.getUTCHours().toString().padStart(2, '0');
          const minutes = vnTime.getUTCMinutes().toString().padStart(2, '0');
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        };
        
        if (now < startDate) {
          toast.error(`Mã giảm giá sẽ có hiệu lực từ ${formatDateVN(startDate)}`);
          return;
        }
        
        if (now > endDate) {
          toast.error(`Mã giảm giá đã hết hạn từ ${formatDateVN(endDate)}`);
          return;
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usageCount >= coupon.usageLimit) {
          toast.error("Mã giảm giá đã hết lượt sử dụng");
          return;
        }

        // Kiểm tra giá trị đơn hàng tối thiểu (chỉ tính theo giá sản phẩm, chưa bao gồm phí vận chuyển)
        if (productSubtotal < coupon.minimumPurchaseAmount) {
          const remainingAmount = coupon.minimumPurchaseAmount - productSubtotal;
          toast.error(
            `Đơn hàng chưa đạt giá trị tối thiểu. Bạn cần mua thêm ${remainingAmount.toLocaleString('vi-VN')}đ để sử dụng mã giảm giá này (tối thiểu ${coupon.minimumPurchaseAmount.toLocaleString('vi-VN')}đ)`
          );
          return;
        }

        // Tính toán giá trị giảm giá (chỉ áp dụng cho giá sản phẩm, không áp dụng cho phí vận chuyển)
        let discountAmount = 0;
        if (coupon.type === "percentage") {
          discountAmount = (productSubtotal * coupon.value) / 100;
        } else if (coupon.type === "fixed") {
          discountAmount = coupon.value;
        }

        // Cập nhật state với thông tin mã giảm giá
        setPromoDetails({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discountAmount,
          minimumPurchaseAmount: coupon.minimumPurchaseAmount
        });

        toast.success(
          `Áp dụng mã giảm giá thành công! ${coupon.type === 'percentage' ? `Giảm ${coupon.value}%` : `Giảm ${coupon.value.toLocaleString('vi-VN')}đ`}`
        );
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Mã giảm giá không tồn tại");
        } else if (error.response?.status === 500) {
          toast.error("Lỗi hệ thống, vui lòng thử lại sau");
        } else {
          const errorMessage = error.response?.data?.message || "Không thể áp dụng mã giảm giá";
          toast.error(errorMessage);
        }
      } else {
        toast.error("Không thể áp dụng mã giảm giá, vui lòng thử lại");
      }
    }
  };

  const handleRemovePromoCode = () => {
    setPromoDetails(null);
    setPromoCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form thêm sản phẩm */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Mã sản phẩm</Label>
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={handleProductIdChange}
                placeholder="Nhập mã sản phẩm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kích thước" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent>
                  {availableColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedProduct && (
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Sản phẩm: {selectedProduct.name}</p>
              <p>
                Giá: {selectedProduct.salePrice ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">{selectedProduct.originalPrice.toLocaleString()}</span>
                    <span className="text-red-500">{selectedProduct.salePrice.toLocaleString()}</span>
                  </>
                ) : (
                  selectedProduct.originalPrice.toLocaleString()
                )} VNĐ
              </p>
              <p>Tồn kho: {selectedProduct.stock}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}

          <Button onClick={() => handleAddToCart(selectedProduct as Product)} className="w-full">
            Thêm sản phẩm
          </Button>
        </div>

        {/* Danh sách sản phẩm đã thêm */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Sản phẩm đã thêm</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {cartItems?.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Số lượng: {item.quantity}</p>
                      <p>Đơn giá: {item.price.toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Chưa có sản phẩm nào
              </div>
            )}
          </div>
        </div>

        {/* Phương thức thanh toán vận chuyển */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Phương thức thanh toán</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                <SelectItem value="Stripe">Thanh toán qua Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phương thức vận chuyển</Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phương thức vận chuyển" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ShippingMethod.STANDARD}>Vận chuyển thường</SelectItem>
                <SelectItem value={ShippingMethod.EXPRESS}>Vận chuyển nhanh</SelectItem>
                <SelectItem value={ShippingMethod.SAME_DAY}>Vận chuyển trong ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mã giảm giá */}
        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                disabled={!!promoDetails}
              />
            </div>
            {promoDetails ? (
              <Button onClick={handleRemovePromoCode} variant="destructive">
                Xóa
              </Button>
            ) : (
              <Button onClick={handleApplyPromoCode}>
                Áp dụng
              </Button>
            )}
          </div>
          {promoDetails && (
            <div className="mt-2 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-600 font-medium">
                Đã áp dụng mã giảm giá: {promoDetails.code}
              </p>
              <p className="text-sm text-green-600">
                Giảm giá: {promoDetails.type === 'percentage' ? `${promoDetails.value}%` : `${promoDetails.value.toLocaleString()}đ`}
              </p>
              <p className="text-sm text-green-600">
                Số tiền giảm: {promoDetails.discountAmount.toLocaleString()}đ
              </p>
              <p className="text-sm text-green-600">
                Giá trị đơn hàng tối thiểu: {promoDetails.minimumPurchaseAmount.toLocaleString()}đ
              </p>
            </div>
          )}
        </div>

        {/* Tổng tiền */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển ({shippingMethod === ShippingMethod.EXPRESS ? "Nhanh" : shippingMethod === ShippingMethod.SAME_DAY ? "Trong ngày" : "Thường"}):</span>
            <span>{(shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                   shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                   30000).toLocaleString("vi-VN")}đ</span>
          </div>
          {promoDetails && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá ({promoDetails.code}):</span>
              <span>-{promoDetails.discountAmount.toLocaleString("vi-VN")}đ</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-base pt-2 border-t">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}