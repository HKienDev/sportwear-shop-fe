"use client";

import { useState, ChangeEvent } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  color: string[];
  size: string[];
  images: {
    main: string;
    sub: string[];
  };
  shortId: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: {
      main: string;
      sub: string[];
    };
    shortId: string;
  };
}

export default function OrderProducts() {
  const { items: cartItems, addToCart, removeFromCart } = useCart();
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
  const [promoDiscount, setPromoDiscount] = useState(0);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      const data = await response.json();
      if (!data.success || !data.product) {
        throw new Error(data.message || "Không tìm thấy sản phẩm");
      }
      return data.product;
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

    if (newProductId) {
      try {
        const productData = await fetchProduct(newProductId);
        setSelectedProduct(productData);
        setAvailableSizes(productData.size || []);
        setAvailableColors(productData.color || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy thông tin sản phẩm");
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images.main || "/images/placeholder.png",
      product: {
        _id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        images: {
          main: product.images.main || "/images/placeholder.png",
          sub: product.images.sub || []
        },
        shortId: product.shortId
      }
    };
    addToCart(cartItem);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Phí vận chuyển
  const shippingFee = shippingMethod === "Express" ? 50000 : shippingMethod === "SameDay" ? 100000 : 30000;

  // Tổng cộng
  const total = subtotal + shippingFee;

  const handleApplyPromoCode = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/promos/check/${promoCode}`);
      if (!response.ok) {
        throw new Error("Mã khuyến mãi không hợp lệ");
      }
      const data = await response.json();
      setPromoDiscount(data.discountAmount);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi kiểm tra mã khuyến mãi");
    }
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
                Giá: {selectedProduct.discountPrice ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">{selectedProduct.price.toLocaleString()}</span>
                    <span className="text-red-500">{selectedProduct.discountPrice.toLocaleString()}</span>
                  </>
                ) : (
                  selectedProduct.price.toLocaleString()
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
                  key={item._id}
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
                    onClick={() => removeFromCart(item._id)}
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
                <SelectItem value="Standard">Vận chuyển thường</SelectItem>
                <SelectItem value="Express">Vận chuyển nhanh</SelectItem>
                <SelectItem value="SameDay">Vận chuyển trong ngày</SelectItem>
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
              />
            </div>
            <Button onClick={handleApplyPromoCode}>
              Áp dụng
            </Button>
          </div>
          {promoDiscount > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Đã áp dụng giảm giá: {promoDiscount.toLocaleString()} VNĐ
            </p>
          )}
        </div>

        {/* Tổng tiền */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="text-xl font-bold">{total.toLocaleString()} VNĐ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}