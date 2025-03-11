"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function OrderProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductId, setNewProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [voucher, setVoucher] = useState("");
  const [shipping, setShipping] = useState("GIAO HÀNG TIẾT KIỆM");
  const [payment, setPayment] = useState("MOMO");
  const [error, setError] = useState<string | null>(null);

// Thay thế hàm mock bằng API thực tế
const fetchProduct = async (id: string): Promise<Product | null> => {
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
    return {
      id: productData._id, // Thay bằng field ID từ backend
      name: productData.name,
      price: productData.price,
      quantity: 1
    };
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    setError("Đã có lỗi xảy ra khi kết nối API");
    return null;
  }
};

  const addProduct = async () => {
    if (!newProductId) {
      setError("Vui lòng nhập ID sản phẩm");
      return;
    }

    try {
      const product = await fetchProduct(newProductId);
      if (!product) {
        setError("Sản phẩm không tồn tại!");
        return;
      }

      const existingProduct = products.find(p => p.id === newProductId);
      if (existingProduct) {
        setProducts(products.map(p =>
          p.id === newProductId 
            ? { ...p, quantity: p.quantity + quantity } 
            : p
        ));
      } else {
        setProducts([
          ...products,
          {
            ...product,
            quantity: quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined
          }
        ]);
      }

      setNewProductId("");
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
      setError(null);
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err); // Sử dụng biến err
      setError("Đã có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">SẢN PHẨM ĐƠN HÀNG</h2>

      {/* Thông báo lỗi */}
      {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}

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
          onChange={(e) => setQuantity(Number(e.target.value))}
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
          {["S", "M", "L", "XL"].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded col-span-1 md:col-span-1"
        >
          <option value="">Chọn màu</option>
          {["Đỏ", "Xanh", "Trắng", "Đen"].map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <button
          onClick={addProduct}
          className="bg-black text-white px-4 py-2 rounded-lg font-medium col-span-1 md:col-span-1"
        >
          + Thêm Sản Phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      {products.length > 0 && (
        <div className="mb-6">
          {products.map(product => (
            <div key={product.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">
                  {product.size && `Size: ${product.size} `}
                  {product.color && `Màu: ${product.color}`}
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">
                  {product.quantity} x {product.price.toLocaleString()}đ
                </span>
                <X 
                  size={18} 
                  className="cursor-pointer hover:text-red-500" 
                  onClick={() => removeProduct(product.id)} 
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4 text-lg font-semibold">
            Tổng tiền: <span className="text-red-500 ml-2">{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>
      )}

      {/* Voucher */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="border border-gray-300 px-3 py-2 w-full rounded"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium">
          + Áp dụng
        </button>
      </div>

      {/* Vận chuyển */}
      <div className="mb-4">
        <select
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-full rounded"
        >
          <option>GIAO HÀNG TIẾT KIỆM</option>
          <option>GHN</option>
          <option>Viettel Post</option>
        </select>
      </div>

      {/* Thanh toán */}
      <div className="mb-4">
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-full rounded"
        >
          <option>MOMO</option>
          <option>COD</option>
          <option>Chuyển khoản</option>
        </select>
      </div>
    </div>
  );
}