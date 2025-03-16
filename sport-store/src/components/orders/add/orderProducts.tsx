"use client";

import { useState, ChangeEvent } from "react";
import { useCart } from "@/app/context/cartContext";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";
import { useShippingMethod } from "@/app/context/shippingMethodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
}

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
}

export default function OrderProducts() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();
  const { shippingMethod, setShippingMethod } = useShippingMethod();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
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
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  };

  const handleProductIdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newProductId = e.target.value;
    setProductId(newProductId);
    setSize("");
    setColor("");
    setAvailableSizes([]);
    setAvailableColors([]);
    setProduct(null);

    if (newProductId) {
      try {
        const productData = await fetchProduct(newProductId);
        setProduct(productData);
        setAvailableSizes(productData.size);
        setAvailableColors(productData.color);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy thông tin sản phẩm");
      }
    }
  };

  const handleAddProduct = async () => {
    if (!productId || !size || !color) {
      setError("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    if (!product) {
      setError("Không tìm thấy thông tin sản phẩm");
      return;
    }

    // Kiểm tra size và color có hợp lệ không
    if (!product.size.includes(size)) {
      setError("Size không hợp lệ cho sản phẩm này");
      return;
    }

    if (!product.color.includes(color)) {
      setError("Màu sắc không hợp lệ cho sản phẩm này");
      return;
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > product.stock) {
      setError(`Số lượng trong kho chỉ còn ${product.stock}`);
      return;
    }

    try {
      const newItem: CartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity,
        size,
        color,
        image: product.images.main
      };

      addToCart(newItem);

      // Reset form
      setProductId("");
      setQuantity(1);
      setSize("");
      setColor("");
      setError("");
      setProduct(null);
      setAvailableSizes([]);
      setAvailableColors([]);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  // Tính tổng tiền với giá khuyến mãi và mã giảm giá
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
    return subtotal - promoDiscount;
  };

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
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form thêm sản phẩm */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Mã sản phẩm</Label>
              <Input
                id="productId"
                value={productId}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
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
                <SelectTrigger>
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

          {product && (
            <div className="text-sm text-gray-600">
              <p>Sản phẩm: {product.name}</p>
              <p>Giá: {product.discountPrice ? product.discountPrice.toLocaleString() : product.price.toLocaleString()} VNĐ</p>
              <p>Tồn kho: {product.stock}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleAddProduct} className="w-full">
            Thêm sản phẩm
          </Button>
        </div>

        {/* Mã khuyến mãi */}
        <div className="space-y-2">
          <Label htmlFor="promoCode">Mã khuyến mãi</Label>
          <div className="flex gap-2">
            <Input
              id="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Nhập mã khuyến mãi"
            />
            <Button onClick={handleApplyPromoCode}>Áp dụng</Button>
          </div>
          {promoDiscount > 0 && (
            <p className="text-sm text-green-600">
              Giảm giá: {promoDiscount.toLocaleString()} VNĐ
            </p>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="space-y-2">
          <Label>Phương thức thanh toán</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
              <SelectItem value="Stripe">Thanh toán qua Stripe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phương thức vận chuyển */}
        <div className="space-y-2">
          <Label>Phương thức vận chuyển</Label>
          <Select value={shippingMethod} onValueChange={setShippingMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phương thức vận chuyển" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Vận chuyển thường</SelectItem>
              <SelectItem value="Express">Vận chuyển nhanh</SelectItem>
              <SelectItem value="SameDay">Vận chuyển trong ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          <h3 className="font-medium">Danh sách sản phẩm</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Chưa có sản phẩm nào</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Màu: {item.color} | SL: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {(item.discountPrice || item.price).toLocaleString()} VNĐ
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tổng tiền */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{cartItems.reduce((total, item) => {
                const itemPrice = item.discountPrice || item.price;
                return total + (itemPrice * item.quantity);
              }, 0).toLocaleString()} VNĐ</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá:</span>
                <span>-{promoDiscount.toLocaleString()} VNĐ</span>
              </div>
            )}
            <div className="flex justify-between font-medium mt-2">
              <span>Tổng cộng:</span>
              <span>{calculateTotal().toLocaleString()} VNĐ</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}