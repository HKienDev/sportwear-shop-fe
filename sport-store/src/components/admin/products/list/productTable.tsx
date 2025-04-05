import Image from "next/image";
import { MoreHorizontal, Edit, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  hasProducts?: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  category: Category;
  brand: string;
  mainImage: string;
  subImages: string[];
  createdAt: string;
  isActive: boolean;
  sku: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  soldCount: number;
  viewCount: number;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
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
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      products.forEach(product => {
                        if (!selectedProducts.includes(product._id)) {
                          onSelectProduct(product._id);
                        }
                      });
                    } else {
                      selectedProducts.forEach(id => {
                        onSelectProduct(id);
                      });
                    }
                  }}
                  checked={selectedProducts.length === products.length && products.length > 0}
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                SKU
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Sản Phẩm
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Giá
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Tồn Kho
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Danh Mục
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Trạng Thái
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
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
                    {product.sku || "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image
                          src={product.mainImage || "/default-image.png"}
                          alt={product.name || "Product Image"}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {product.name || "Sản phẩm chưa thêm"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {new Date(product.createdAt).toLocaleDateString() || "Chưa có ngày tạo"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {product.salePrice?.toLocaleString() || 0}₫
                      </div>
                      {product.salePrice < product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {product.originalPrice?.toLocaleString() || 0}₫
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
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
                    <div className="text-sm text-gray-600 truncate">
                      {product.category?.name || "Chưa phân loại"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
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
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(product._id)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onToggleStatus(product._id, !product.isActive)}
                          className={`cursor-pointer ${product.isActive ? "text-yellow-600" : "text-green-600"}`}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          <span>{product.isActive ? "Ngừng bán" : "Kích hoạt"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => onDelete(product._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}