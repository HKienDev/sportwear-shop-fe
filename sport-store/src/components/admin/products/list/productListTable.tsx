import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, Power, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ProductStatusBadge from "./productStatusBadge";

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
  categoryId: string;
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

interface ProductListTableProps {
  products: Product[];
  selectedProducts: string[];
  onToggleSelectAll: () => void;
  onToggleSelectProduct: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (sku: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  categories: Category[];
}

const ProductListTable = React.memo(
  ({ 
    products, 
    selectedProducts, 
    onToggleSelectAll,
    onToggleSelectProduct,
    onEdit,
    onDelete,
    onToggleStatus,
    categories
  }: ProductListTableProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const productsPerPage = 10;

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Handle pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getCategoryName = (categoryId: string) => {
      if (!categories || !Array.isArray(categories)) return categoryId || "Chưa phân loại";
      
      // Tìm danh mục theo categoryId
      const category = categories.find(cat => cat.categoryId === categoryId);
      
      // Nếu không tìm thấy theo categoryId, thử tìm theo _id
      if (!category) {
        const categoryById = categories.find(cat => cat._id === categoryId);
        return categoryById ? categoryById.name : categoryId || "Chưa phân loại";
      }
      
      return category.name;
    };

    return (
      <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng Sản Phẩm</p>
                  <p className="text-2xl font-bold text-slate-800">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <span className="text-teal-500 text-xl font-bold">Σ</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Đang Bán</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {products.filter(product => product.isActive && product.stock > 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <span className="text-indigo-500 text-xl font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Sắp Hết</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {products.filter(product => product.stock > 0 && product.stock <= 10).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-500 text-xl font-bold">⚠</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hết Hàng</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {products.filter(product => product.stock === 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                  <span className="text-red-500 text-xl font-bold">×</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Summary & Selection */}
          <div className="flex flex-wrap justify-between items-center mb-2">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
                {currentProducts.length} sản phẩm
              </span>
              {selectedProducts.length > 0 && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium animate-pulse">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
              )}
            </div>
          </div>

          {/* Products Table with Card Design */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 mb-4">
            <div className="w-full">
              <table className="w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-2 py-3 w-[5%]">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[10%]">SKU</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[30%]">Sản Phẩm</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[10%]">Giá</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[10%]">Tồn Kho</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[15%]">Danh Mục</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[10%]">Trạng Thái</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[10%]">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50 transition-colors duration-150`}>
                        <td className="px-2 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => onToggleSelectProduct(product._id)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <Link
                            href={`/admin/products/details/${product._id}`}
                            className="text-teal-600 hover:text-teal-800 hover:underline font-medium font-mono text-sm"
                          >
                            {product.sku || "N/A"}
                          </Link>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                              <Image
                                src={product.mainImage || "/default-image.png"}
                                alt={product.name || "Product Image"}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="ml-2 min-w-0">
                              <div className="font-medium text-slate-800 truncate text-sm">
                                {product.name || "Sản phẩm chưa thêm"}
                              </div>
                              <div className="text-slate-500 text-xs">
                                {new Date(product.createdAt).toLocaleDateString() || "Chưa có ngày tạo"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-slate-800">
                              {product.salePrice === 0 
                                ? `${product.originalPrice?.toLocaleString() || 0}₫` 
                                : `${product.salePrice?.toLocaleString() || 0}₫`}
                            </div>
                            {product.salePrice > 0 && product.salePrice < product.originalPrice && (
                              <div className="text-xs text-slate-500 line-through">
                                {product.originalPrice?.toLocaleString() || 0}₫
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-sm font-medium text-slate-800">
                            {product.stock || 0}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-sm text-slate-600 truncate">
                            {getCategoryName(product.categoryId)}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <ProductStatusBadge isActive={product.isActive} stock={product.stock} />
                        </td>
                        <td className="px-2 py-3">
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
                                onClick={() => onDelete(product.sku)}
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
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-4 p-4 rounded-full bg-slate-100">
                            <AlertCircle size={32} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy sản phẩm</p>
                          <p className="text-slate-500">Hiện tại chưa có sản phẩm nào trong hệ thống</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-sm text-slate-600 mb-2 sm:mb-0">
                Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    currentPage === 1
                      ? "text-slate-300 cursor-not-allowed bg-slate-50"
                      : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => paginate(pageToShow)}
                      className={`w-10 h-10 rounded-lg text-center ${
                        currentPage === pageToShow
                          ? "bg-teal-500 text-white font-medium"
                          : "text-slate-600 hover:bg-teal-50 bg-white border border-slate-200"
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    currentPage === totalPages
                      ? "text-slate-300 cursor-not-allowed bg-slate-50"
                      : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProductListTable.displayName = "ProductListTable";

export default ProductListTable; 