"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod, PaymentMethod } from "@/context/paymentMethodContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Plus, Minus, Trash2, AlertCircle, CreditCard, Truck } from "lucide-react";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { AdminProduct } from "@/types/product";
import Image from "next/image";



export default function OrderProducts() {
  const { items: cartItems, addItem, removeItem } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();
  const { shippingMethod, setShippingMethod } = useShippingMethod();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const fetchProduct = useCallback(async (productId: string) => {
    try {
      if (!productId) {
        throw new Error('Vui lòng nhập mã sản phẩm');
      }

      // Tìm kiếm theo phần đuôi của mã sản phẩm
      let searchTerm = productId;
      if (productId.includes('-')) {
        // Nếu có dấu gạch ngang, lấy phần sau dấu gạch cuối cùng
        searchTerm = productId.split('-').pop() || productId;
      }

      console.log("🔍 [fetchProduct] Tìm sản phẩm với SKU:", productId, "Search term:", searchTerm);
      
      // Thử tìm kiếm theo SKU trước
      let response = await fetchWithAuth<{ product: AdminProduct }>(`/products/sku/${productId}`);
      
      // Nếu không tìm thấy, thử tìm theo phần đuôi
      if (!response.success || !response.data?.product) {
        console.log("🔍 [fetchProduct] Không tìm thấy theo SKU, thử tìm theo phần đuôi:", searchTerm);
        response = await fetchWithAuth<{ product: AdminProduct }>(`/products/sku/${searchTerm}`);
      }
      
      // Nếu vẫn không tìm thấy, thử tìm theo tên sản phẩm
      if (!response.success || !response.data?.product) {
        console.log("🔍 [fetchProduct] Không tìm thấy theo SKU, thử tìm theo tên:", productId);
        const searchResponse = await fetchWithAuth<{ products: AdminProduct[] }>(`/products/search/${productId}`);
        
        if (searchResponse.success && searchResponse.data?.products && searchResponse.data.products.length > 0) {
          // Trả về sản phẩm đầu tiên tìm thấy
          return searchResponse.data.products[0];
        }
      }
      
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
  }, []);

  const handleProductIdChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setIsLoadingProduct(true);
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
      } finally {
        setIsLoadingProduct(false);
      }
    }
  }, [fetchProduct]);

  const handleAddToCart = useCallback((product: AdminProduct) => {
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
        tags: product.tags || [],
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        viewCount: product.viewCount || 0,
        soldCount: product.soldCount || 0,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        discountPercentage: product.discountPercentage || 0,
        isOutOfStock: product.isOutOfStock || false,
        isLowStock: product.isLowStock || false
      },
      quantity: quantity,
      color: color,
      size: size,
      totalPrice: (product.salePrice || product.originalPrice) * quantity
    };

    addItem(cartItem);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
    
    // Reset form để có thể thêm sản phẩm khác
    setQuantity(1);
    setSize("");
    setColor("");
    setAvailableSizes([]);
    setAvailableColors([]);
    setSelectedProduct(null);
    setError("");
    // Không xóa searchTerm để có thể tìm kiếm sản phẩm khác
  }, [addItem, availableSizes.length, availableColors.length, quantity, size, color]);

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.product?._id === productId);
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
  }, [cartItems, removeItem, addItem]);





  return (
    <div className="p-6 lg:p-8">
      {/* Search Product Section */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
            <Search size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Tìm kiếm sản phẩm</h3>
            <p className="text-sm text-gray-500">Nhập mã SKU hoặc tên sản phẩm để tìm kiếm</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Nhập mã SKU hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={handleProductIdChange}
              className="h-14 pl-12 bg-gray-50 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {isLoadingProduct && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm">Lỗi tìm kiếm</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Selected Product */}
          {selectedProduct && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-start space-x-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-green-200">
                  <Image
                    src={selectedProduct.mainImage || "/images/placeholder.png"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Giá:</span>
                      <span className="text-lg font-bold text-green-600">
                        {selectedProduct.salePrice?.toLocaleString() || selectedProduct.originalPrice.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Tồn kho:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedProduct.stock}</span>
                    </div>
                  </div>

                  {/* Size Selection */}
                  {availableSizes.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Kích thước:</label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg">
                          <SelectValue placeholder="Chọn kích thước" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSizes.map((sizeOption) => (
                            <SelectItem key={sizeOption} value={sizeOption}>
                              {sizeOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Color Selection */}
                  {availableColors.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Màu sắc:</label>
                      <Select value={color} onValueChange={setColor}>
                        <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg">
                          <SelectValue placeholder="Chọn màu sắc" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColors.map((colorOption) => (
                            <SelectItem key={colorOption} value={colorOption}>
                              {colorOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Số lượng:</label>
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg"
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 h-10 text-center"
                        min="1"
                        max={selectedProduct.stock}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="w-10 h-10 rounded-lg"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus size={20} />
                      <span>Thêm vào đơn hàng</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Items Section */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Sản phẩm trong đơn hàng</h3>
            <p className="text-sm text-gray-500">{cartItems.length} sản phẩm đã chọn</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h4>
            <p className="text-gray-500">Vui lòng tìm kiếm và thêm sản phẩm vào đơn hàng</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.mainImage || "/images/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</h5>
                    <div className="flex items-center space-x-4 mt-1">
                      {item.color && (
                        <span className="text-xs text-gray-500">Màu: {item.color}</span>
                      )}
                      {item.size && (
                        <span className="text-xs text-gray-500">Size: {item.size}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-lg"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                          className="w-8 h-8 rounded-lg"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.totalPrice.toLocaleString()}₫
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.product.salePrice?.toLocaleString() || item.product.originalPrice.toLocaleString()}₫/cái
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.product._id)}
                    className="w-8 h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment & Shipping Methods */}
      <div className="mt-8 space-y-6">
        {/* Payment Method */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard size={18} className="mr-2 text-gray-600" />
            Phương thức thanh toán
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <Button
               type="button"
               variant={paymentMethod === PaymentMethod.COD ? "default" : "outline"}
               onClick={() => setPaymentMethod(PaymentMethod.COD)}
               className="h-12 justify-start"
             >
               <CreditCard size={16} className="mr-2" />
               Thanh toán khi nhận hàng
             </Button>
             <Button
               type="button"
               variant={paymentMethod === PaymentMethod.BANKING ? "default" : "outline"}
               onClick={() => setPaymentMethod(PaymentMethod.BANKING)}
               className="h-12 justify-start"
             >
               <CreditCard size={16} className="mr-2" />
               Chuyển khoản ngân hàng
             </Button>
             <Button
               type="button"
               variant={paymentMethod === PaymentMethod.MOMO ? "default" : "outline"}
               onClick={() => setPaymentMethod(PaymentMethod.MOMO)}
               className="h-12 justify-start"
             >
               <CreditCard size={16} className="mr-2" />
               Thanh toán qua Momo
             </Button>
          </div>
        </div>

        {/* Shipping Method */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck size={18} className="mr-2 text-gray-600" />
            Phương thức vận chuyển
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              type="button"
              variant={shippingMethod === ShippingMethod.STANDARD ? "default" : "outline"}
              onClick={() => setShippingMethod(ShippingMethod.STANDARD)}
              className="h-12 justify-start"
            >
              <Truck size={16} className="mr-2" />
              Vận chuyển thường (30k)
            </Button>
            <Button
              type="button"
              variant={shippingMethod === ShippingMethod.EXPRESS ? "default" : "outline"}
              onClick={() => setShippingMethod(ShippingMethod.EXPRESS)}
              className="h-12 justify-start"
            >
              <Truck size={16} className="mr-2" />
              Vận chuyển nhanh (45k)
            </Button>
            <Button
              type="button"
              variant={shippingMethod === ShippingMethod.SAME_DAY ? "default" : "outline"}
              onClick={() => setShippingMethod(ShippingMethod.SAME_DAY)}
              className="h-12 justify-start"
            >
              <Truck size={16} className="mr-2" />
              Giao trong ngày (60k)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}