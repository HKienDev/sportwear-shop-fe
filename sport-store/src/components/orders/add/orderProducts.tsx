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
  quantity: number;
  size: string;
  color: string;
  image?: string;
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

  const handleAddProduct = async () => {
    if (!productId || !size || !color) {
      setError("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    try {
      // Lấy thông tin sản phẩm từ API
      const productData = await fetchProduct(productId);
      
      const newItem: CartItem = {
        id: productId,
        name: productData.name,
        price: productData.price,
        quantity,
        size,
        color,
        image: productData.image
      };

      addToCart(newItem);

      // Reset form
      setProductId("");
      setQuantity(1);
      setSize("");
      setColor("");
      setError("");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(e.target.value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value < 1 ? 1 : value);
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
                onChange={(e) => handleInputChange(e, setProductId)}
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
              <Input
                id="size"
                value={size}
                onChange={(e) => handleInputChange(e, setSize)}
                placeholder="Nhập kích thước"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => handleInputChange(e, setColor)}
                placeholder="Nhập màu sắc"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleAddProduct} className="w-full">
            Thêm sản phẩm
          </Button>
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
          <h3 className="font-medium">Sản phẩm đã thêm</h3>
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có sản phẩm nào</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.size} - {item.color} x {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút hủy */}
        <Button variant="outline" className="w-full">
          Hủy
        </Button>
      </CardContent>
    </Card>
  );
}