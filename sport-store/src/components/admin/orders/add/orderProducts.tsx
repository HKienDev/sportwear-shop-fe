"use client";

import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { usePromo } from "@/context/promoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Package, ShoppingCart, CheckCircle, Info } from "lucide-react";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Product } from "@/types/product";
import Image from "next/image";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  minimumPurchaseAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  usageCount: number;
  usageLimit: number;
}

interface CouponWithDiscount extends Coupon {
  discountAmount: number;
}

export default function OrderProducts() {
  const { items: cartItems, addItem, removeItem } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();
  const { shippingMethod, setShippingMethod } = useShippingMethod();
  const { promoDetails, setPromoDetails } = usePromo();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const fetchProduct = async (productId: string) => {
    try {
      if (!productId) {
        throw new Error('Vui lòng nhập mã sản phẩm');
      }

      console.log("🔍 [fetchProduct] Tìm sản phẩm với SKU:", productId);
      const response = await fetchWithAuth<{ product: Product }>(`/products/${productId}`);
      console.log("🔍 [fetchProduct] Kết quả:", response);
      
      if (!response.success || !response.data?.product) {
        throw new Error(response.message || 'Không thể tìm thấy sản phẩm');
      }

      return response.data.product;
    } catch (error) {
      console.error('❌ [fetchProduct] Lỗi:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Không thể tìm thấy sản phẩm');
    }
  };

  const handleProductIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProductId = e.target.value.trim();
    setSearchTerm(newProductId);
    setSize("");
    setColor("");
    setAvailableSizes([]);
    setAvailableColors([]);
    setSelectedProduct(null);
    setError("");

    if (newProductId) {
      try {
        const product = await fetchProduct(newProductId);
        setSelectedProduct(product);
        setAvailableSizes(product.sizes || []);
        setAvailableColors(product.colors || []);
        setError("");
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Không thể tìm thấy sản phẩm');
        setSelectedProduct(null);
        setAvailableSizes([]);
        setAvailableColors([]);
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
      _id: Date.now().toString(),
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice || product.originalPrice,
        stock: product.stock,
        categoryId: product.categoryId,
        isActive: product.isActive,
        mainImage: product.mainImage || "/images/placeholder.png",
        subImages: product.subImages || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        sku: product.sku,
        slug: product.sku.toLowerCase(),
        tags: product.tags || [],
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        viewCount: product.viewCount || 0,
        soldCount: product.soldCount || 0,
        reviews: (product.reviews || []).map(review => ({
          ...review,
          createdAt: new Date(review.createdAt)
        })),
        createdAt: new Date(product.createdAt || Date.now()),
        updatedAt: new Date(product.updatedAt || Date.now())
      },
      quantity: quantity,
      color: color,
      size: size,
      totalPrice: (product.salePrice || product.originalPrice) * quantity
    };

    addItem(cartItem);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.product._id === productId);
    if (!item) return;

    if (newQuantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    if (newQuantity > item.product.stock) {
      toast.error(`Số lượng vượt quá tồn kho (${item.product.stock})`);
      return;
    }

    const updatedItem = {
      ...item,
      quantity: newQuantity,
      totalPrice: (item.product.salePrice || item.product.originalPrice) * newQuantity
    };

    removeItem(productId);
    addItem(updatedItem);
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    // Tính tổng tiền sản phẩm
    const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    
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
    if (!promoCode) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
      const response = await fetchWithAuth<ApiResponse<Coupon>>(`/coupons/code/${promoCode}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể áp dụng mã giảm giá");
      }

      // Đảm bảo TypeScript hiểu rằng response.data là một Coupon
      const couponData = response.data as unknown as Coupon;

      // Kiểm tra điều kiện áp dụng
      if (subtotal < couponData.minimumPurchaseAmount) {
        throw new Error(`Đơn hàng phải có giá trị tối thiểu ${couponData.minimumPurchaseAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`);
      }

      // Tính số tiền giảm giá
      let discountAmount = 0;
      if (couponData.type === 'percentage') {
        discountAmount = (subtotal * couponData.value) / 100;
      } else if (couponData.type === 'fixed') {
        discountAmount = couponData.value;
      }

      // Cập nhật thông tin giảm giá
      const couponWithDiscount: CouponWithDiscount = {
        _id: couponData._id,
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        minimumPurchaseAmount: couponData.minimumPurchaseAmount,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        status: couponData.status,
        usageCount: couponData.usageCount,
        usageLimit: couponData.usageLimit,
        discountAmount
      };

      setPromoDetails(couponWithDiscount);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      console.error('❌ [handleApplyPromoCode] Lỗi:', error);
      setPromoDetails(null);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể áp dụng mã giảm giá");
      }
    }
  };

  const handleRemovePromoCode = () => {
    setPromoDetails(null);
    setPromoCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header with stylish gradient */}
      <div className="p-6 text-white">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Info className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Search and Add Product Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Search size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Tìm kiếm sản phẩm</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Input
                  value={searchTerm}
                  onChange={handleProductIdChange}
                  placeholder="Nhập tên sản phẩm"
                  className="w-full"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Nhập số lượng"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
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

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
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
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image 
                      src={selectedProduct.mainImage} 
                      alt={selectedProduct.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      style={{ width: 80, height: 80 }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                    <div className="mt-2">
                      {selectedProduct.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-gray-400">{selectedProduct.originalPrice.toLocaleString()}đ</span>
                          <span className="text-orange-500 font-medium">{selectedProduct.salePrice.toLocaleString()}đ</span>
                        </div>
                      ) : (
                        <span className="text-orange-500 font-medium">{selectedProduct.originalPrice.toLocaleString()}đ</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Tồn kho: {selectedProduct.stock}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={() => handleAddToCart(selectedProduct as Product)} 
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Thêm sản phẩm
            </Button>
          </div>

          {/* Cart Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShoppingCart size={18} className="text-orange-500" />
                <h3 className="text-gray-700 font-medium ml-2">Giỏ hàng</h3>
              </div>
              <div className="text-sm text-gray-500">
                {cartItems.length} sản phẩm
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={item.product.mainImage} 
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        style={{ width: 64, height: 64 }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.size} - {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-orange-500 font-medium">
                          {item.totalPrice.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment and Shipping Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Package size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Phương thức thanh toán & vận chuyển</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
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
          </div>

          {/* Promo Code Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Package size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Mã giảm giá</h3>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  disabled={!!promoDetails}
                  className="w-full"
                />
              </div>
              {promoDetails ? (
                <Button 
                  onClick={handleRemovePromoCode} 
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                >
                  Xóa
                </Button>
              ) : (
                <Button 
                  onClick={handleApplyPromoCode}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Áp dụng
                </Button>
              )}
            </div>

            {promoDetails && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={18} />
                  <span className="font-medium">Đã áp dụng mã giảm giá: {promoDetails.code}</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-green-600">
                  <p>Giảm giá: {promoDetails?.type === 'percentage' ? `${promoDetails?.value}%` : `${promoDetails?.value?.toLocaleString()}đ`}</p>
                  <p>Số tiền giảm: {promoDetails?.discountAmount?.toLocaleString()}đ</p>
                  <p>Giá trị đơn hàng tối thiểu: {promoDetails?.minimumPurchaseAmount?.toLocaleString()}đ</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Package size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Tổng đơn hàng</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{cartItems.reduce((total, item) => total + item.totalPrice, 0).toLocaleString("vi-VN")}đ</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
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
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Tổng cộng:</span>
                  <span className="text-xl font-bold text-orange-500">{total.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}