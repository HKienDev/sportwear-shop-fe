import Image from "next/image";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: string;
  isActive: boolean;
}

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export default function ProductTable({ 
  products, 
  selectedProducts, 
  onSelectProduct,
  onEdit,
  onDelete,
  onToggleStatus
}: ProductTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  if (isChecked) {
                    products.forEach(product => onSelectProduct(product._id));
                  } else {
                    products.forEach(product => onSelectProduct(product._id));
                  }
                }}
                checked={selectedProducts.length === products.length && products.length > 0}
              />
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản Phẩm
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô Tả
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tồn Kho
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh Mục
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onSelectProduct(product._id)}
                  />
                </td>
                <td className="p-4 font-mono text-sm text-gray-600">
                  {product._id.slice(-6)}
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={product.imageUrl || "/default-image.png"}
                        alt={product.name || "Product Image"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {product.name || "Sản phẩm chưa thêm"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(product.createdAt).toLocaleDateString() || "Chưa có ngày tạo"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="max-w-xs truncate text-sm text-gray-600">
                    {product.description || "Chưa có mô tả"}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.price?.toLocaleString() || 0}₫
                  </div>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10 
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.stock || 0}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    {product.category || "Chưa phân loại"}
                  </div>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.isActive ? "Đang bán" : "Ngừng bán"}
                  </div>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(product._id)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onToggleStatus(product._id, !product.isActive)}
                        className={product.isActive ? "text-yellow-600" : "text-green-600"}
                      >
                        {product.isActive ? "Ngừng bán" : "Kích hoạt"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete(product._id)}
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-8">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">Không có sản phẩm nào</p>
                  <p className="text-sm mt-1">Thêm sản phẩm mới để bắt đầu</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}