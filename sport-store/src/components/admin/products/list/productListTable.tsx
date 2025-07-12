import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, Power, AlertCircle, Star, Clock, Eye, Copy, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductStatusBadge from "./productStatusBadge";
import FeaturedProductModal, { FeaturedProductConfig } from "../featuredProductModal";
import { toast } from "sonner";
import Pagination from "./pagination";

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
  isFeatured: boolean;
  sku: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  rating: number;
  numReviews: number;
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
  onToggleFeatured: (sku: string, isFeatured: boolean) => void;
  onSetupFeatured: (sku: string, config: FeaturedProductConfig) => void;
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
    onToggleFeatured,
    onSetupFeatured,
    categories
  }: ProductListTableProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isFeaturedModalOpen, setIsFeaturedModalOpen] = React.useState(false);
    const [selectedProductForSetup, setSelectedProductForSetup] = React.useState<Product | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
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

    // Handle delete confirmation
    const handleDeleteClick = (product: Product) => {
      setProductToDelete(product);
      setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (!productToDelete) return;
      
      try {
        await onDelete(productToDelete.sku);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm');
      }
    };

    // Handle copy SKU
    const handleCopySKU = async (sku: string) => {
      try {
        await navigator.clipboard.writeText(sku);
        toast.success('Đã sao chép SKU vào clipboard');
      } catch (error) {
        console.error('Error copying SKU:', error);
        toast.error('Không thể sao chép SKU');
      }
    };

    // Calculate statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(product => product.isActive && product.stock > 0).length;
    const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 10).length;
    const featuredProducts = products.filter(product => product.isFeatured).length;

    return (
      <div className="space-y-6">
        {/* Enhanced Statistics Cards with Glass Morphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Tổng Sản Phẩm</p>
                  <p className="text-3xl font-bold text-slate-800">{totalProducts.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Đang Bán</p>
                  <p className="text-3xl font-bold text-slate-800">{activeProducts.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Sắp Hết</p>
                  <p className="text-3xl font-bold text-slate-800">{lowStockProducts.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <AlertTriangle size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Nổi Bật</p>
                  <p className="text-3xl font-bold text-slate-800">{featuredProducts.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Star size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Summary */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            {selectedProducts.length > 0 && (
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-200/60 animate-pulse">
                Đã chọn {selectedProducts.length} sản phẩm
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Table Container with Glass Morphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/60">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-64">Sản Phẩm</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">Giá</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Tồn Kho</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-48">Danh Mục</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-44">Trạng Thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product._id} className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                      }`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => onToggleSelectProduct(product._id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-slate-200/60">
                                <Image
                                  src={product.mainImage || '/default-image.png'}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/admin/products/details/${product.sku}`}
                                className="group/link inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-200"
                              >
                                <span className="text-sm font-medium text-slate-800 truncate">
                                  {product.name}
                                </span>
                                <Eye size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                              </Link>
                              <p className="text-xs text-slate-500 font-mono">SKU: {product.sku.replace('VJUSPORTPRODUCT-', '')}</p>
                              {product.isFeatured && (
                                <div className="flex items-center mt-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-yellow-600 ml-1">Nổi bật</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-semibold text-slate-800">
                              {product.salePrice.toLocaleString()}₫
                            </p>
                            {product.originalPrice > product.salePrice && (
                              <p className="text-xs text-slate-500 line-through">
                                {product.originalPrice.toLocaleString()}₫
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-800">
                            {product.stock || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">
                            {getCategoryName(product.categoryId)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ProductStatusBadge isActive={product.isActive} stock={product.stock} />
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={() => window.open(`/admin/products/details/${product.sku}`, '_blank')}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Xem chi tiết</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(product._id)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleCopySKU(product.sku)}
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Sao chép SKU</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onToggleStatus(product._id, !product.isActive)}
                                className={`cursor-pointer ${product.isActive ? "text-yellow-600" : "text-green-600"}`}
                              >
                                <Power className="mr-2 h-4 w-4" />
                                <span>{product.isActive ? "Ngừng bán" : "Kích hoạt"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onToggleFeatured(product.sku, !product.isFeatured)}
                                className={`cursor-pointer ${product.isFeatured ? "text-yellow-600" : "text-green-600"}`}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                <span>{product.isFeatured ? "Hủy đặt làm nổi bật" : "Đặt làm nổi bật"}</span>
                              </DropdownMenuItem>
                              {product.isFeatured && (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedProductForSetup(product);
                                    setIsFeaturedModalOpen(true);
                                  }}
                                  className="cursor-pointer text-blue-600"
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  <span>Setup countdown</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Xóa sản phẩm</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
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
        </div>

        {/* Pagination Component */}
        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            totalItems={products.length}
            itemsPerPage={productsPerPage}
          />
        )}

        {/* Featured Product Setup Modal */}
        <FeaturedProductModal
          product={selectedProductForSetup}
          isOpen={isFeaturedModalOpen}
          onClose={() => {
            setIsFeaturedModalOpen(false);
            setSelectedProductForSetup(null);
          }}
          onSave={(config) => {
            if (selectedProductForSetup) {
              onSetupFeatured(selectedProductForSetup.sku, config);
            }
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm &quot;{productToDelete?.name}&quot;? 
                Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa sản phẩm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

ProductListTable.displayName = "ProductListTable";

export default ProductListTable; 