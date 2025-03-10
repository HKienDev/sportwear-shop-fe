"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function OrderProducts() {
  const [products, setProducts] = useState<{ name: string; quantity: number }[]>([]);
  const [newProduct, setNewProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [voucher, setVoucher] = useState("");
  const [shipping, setShipping] = useState("GIAO HÀNG TIẾT KIỆM");
  const [payment, setPayment] = useState("MOMO");

  // Thêm sản phẩm
  const addProduct = () => {
    if (newProduct.trim()) {
      setProducts([...products, { name: newProduct, quantity }]);
      setNewProduct("");
      setQuantity(1);
    }
  };

  // Xóa sản phẩm
  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Thêm size
  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  // Xóa size
  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  // Thêm màu
  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  // Xóa màu
  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  return (
    <div className="w-1/2 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">SẢN PHẨM ĐƠN HÀNG</h2>

      {/* Nhập sản phẩm */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          placeholder="Nhập sản phẩm"
          className="border border-gray-300 px-3 py-2 w-[60%] rounded"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="SL"
          className="border border-gray-300 px-3 py-2 w-[70px] rounded text-center"
          min={1}
          max={99999}
        />
        <button onClick={addProduct} className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Thêm Sản Phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      {products.length > 0 && (
        <div className="mb-6">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between bg-gray-100 p-2 rounded mb-2">
              <span>{product.name} (x{product.quantity})</span>
              <X size={16} className="cursor-pointer" onClick={() => removeProduct(index)} />
            </div>
          ))}
        </div>
      )}

      {/* Nhập mã giảm giá */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="border border-gray-300 px-3 py-2 w-[calc(60%+70px)] rounded"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Thêm Voucher
        </button>
      </div>

      {/* Nhập size */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Nhập size mới"
          className="border border-gray-300 px-3 py-2 w-[calc(60%+70px)] rounded"
        />
        <button onClick={addSize} className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Thêm Size
        </button>
      </div>

      {/* Danh sách Size */}
      {sizes.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded">
              <span>{size}</span>
              <X size={16} className="ml-2 cursor-pointer" onClick={() => removeSize(size)} />
            </div>
          ))}
        </div>
      )}

      {/* Nhập màu */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Nhập màu mới"
          className="border border-gray-300 px-3 py-2 w-[calc(60%+70px)] rounded"
        />
        <button onClick={addColor} className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Thêm Màu
        </button>
      </div>

      {/* Danh sách Màu */}
      {colors.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded">
              <span>{color}</span>
              <X size={16} className="ml-2 cursor-pointer" onClick={() => removeColor(color)} />
            </div>
          ))}
        </div>
      )}

      {/* Vận chuyển */}
      <div className="mb-4 flex items-center gap-2">
        <select
          className="border border-gray-300 px-3 py-2 w-[calc(60%+70px)] rounded"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
        >
          <option>GIAO HÀNG TIẾT KIỆM</option>
          <option>GHN</option>
          <option>Viettel Post</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Chọn Giao Hàng
        </button>
      </div>

      {/* Thanh toán */}
      <div className="mb-8 flex items-center gap-2">
        <select
          className="border border-gray-300 px-3 py-2 w-[calc(60%+70px)] rounded"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option>MOMO</option>
          <option>COD</option>
          <option>Chuyển Khoản</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded-lg w-[180px] font-medium">
          + Chọn Thanh Toán
        </button>
      </div>
    </div>
  );
}