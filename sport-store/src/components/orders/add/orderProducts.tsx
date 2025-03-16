"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/app/context/cartContext";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";

export default function OrderProducts() {
  const [newProductId, setNewProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Sản phẩm không tồn tại!");
        } else {
          setError("Lỗi kết nối đến server");
        }
        return null;
      }
  
      const productData = await response.json();
  
      if (!productData._id || !productData.name || !productData.price) {
        setError("Dữ liệu sản phẩm không hợp lệ!");
        return null;
      }
  
      return {
        id: productData._id,
        name: productData.name,
        price: productData.price,
        quantity: 1,
      };
    } catch {
      setError("Đã có lỗi xảy ra khi kết nối API");
      return null;
    }
  };

  const addProduct = async () => {
    // Kiểm tra các trường bắt buộc
    if (!newProductId) {
      setError("Vui lòng nhập ID sản phẩm");
      return;
    }

    if (!selectedSize) {
      setError("Vui lòng chọn size");
      return;
    }

    if (!selectedColor) {
      setError("Vui lòng chọn màu");
      return;
    }

    if (quantity < 1) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    setError(null);

    const product = await fetchProduct(newProductId);
    if (!product) return;

    addToCart({
      ...product,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
    });

    setNewProductId("");
    setQuantity(1);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleCancel = () => {
    clearCart();
    setNewProductId("");
    setQuantity(1);
    setSelectedSize("");
    setSelectedColor("");
    setError(null);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">SẢN PHẨM ĐƠN HÀNG</h2>

      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
      )}

      {/* Form thêm sản phẩm */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          value={newProductId}
          onChange={(e) => setNewProductId(e.target.value.toUpperCase())}
          placeholder="ID sản phẩm (VD: SP001)"
          className="border border-gray-300 px-3 py-2 rounded col-span-1"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            setQuantity(value < 1 ? 1 : value); // Ngăn số lượng < 1
          }}
          placeholder="Số lượng"
          className="border border-gray-300 px-3 py-2 rounded col-span-1"
          min={1}
        />
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded col-span-1 md:col-span-1"
        >
          <option value="">Chọn size</option>
          {["S", "M", "L", "XL"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded col-span-1 md:col-span-1"
        >
          <option value="">Chọn màu</option>
          {["Đỏ", "Xanh", "Trắng", "Đen"].map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <button
          onClick={addProduct}
          disabled={
            !newProductId || // ID trống
            !selectedSize || // Size chưa chọn
            !selectedColor || // Màu chưa chọn
            quantity < 1 // Số lượng không hợp lệ
          }
          className="bg-black text-white px-4 py-2 rounded-lg font-medium col-span-1 md:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Thêm Sản Phẩm
        </button>
      </div>

      {/* Dropdown chọn phương thức thanh toán */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phương thức thanh toán:
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full"
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="Stripe">Thanh toán qua Stripe</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      {cartItems.length > 0 ? (
        <div className="mb-6">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size || "none"}-${item.color || "none"}`}
              className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.size && `Size: ${item.size} `}
                  {item.color && `Màu: ${item.color}`}
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">
                  {item.quantity} x {item.price.toLocaleString()}đ
                </span>
                <X
                  size={18}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4 text-lg font-semibold">
            Tổng tiền:{" "}
            <span className="text-red-500 ml-2">
              {totalPrice.toLocaleString()}đ
            </span>
          </div>
        </div>
      ) : (
        <p>Không có sản phẩm nào trong đơn hàng</p>
      )}

      {/* Button Hủy Bỏ */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-300 text-black rounded-lg font-medium hover:bg-gray-400 transition"
        >
          Hủy Bỏ
        </button>
      </div>
    </div>
  );
}