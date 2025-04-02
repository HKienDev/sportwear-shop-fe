"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import ProductTable from "@/components/admin/products/list/productTable";
import ProductSearch from "@/components/admin/products/list/productSearch";
import DeleteButton from "@/components/admin/products/list/deleteButton";
import ProductPagination from "@/components/admin/products/list/pagination";
import { toast } from "react-hot-toast";

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

export default function ProductListPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/products/admin?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi lấy danh sách sản phẩm");
      }

      if (!data.success) {
        throw new Error(data.message || "Có lỗi xảy ra khi lấy danh sách sản phẩm");
      }

      setProducts(data.data.products || []);
      setTotalPages(data.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  }, []);

  const handleAddProduct = useCallback(() => {
    router.push("/admin/products/add");
  }, [router]);

  const handleSelectProduct = useCallback((id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  }, []);

  const handleEditProduct = useCallback((id: string) => {
    router.push(`/admin/products/edit/${id}`);
  }, [router]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/products/admin/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Có lỗi xảy ra khi xóa sản phẩm");

      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  }, [fetchProducts]);

  const handleDeleteSelected = useCallback(async () => {
    try {
      const response = await fetch("/api/products/admin/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedProducts }),
      });

      if (!response.ok) throw new Error("Có lỗi xảy ra khi xóa sản phẩm");

      toast.success("Xóa sản phẩm thành công");
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  }, [selectedProducts, fetchProducts]);

  const handleToggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/products/admin/${id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error("Có lỗi xảy ra khi cập nhật trạng thái");

      toast.success("Cập nhật trạng thái thành công");
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  }, [fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] p-6">
            <h1 className="text-2xl font-bold text-white">Quản lý sản phẩm</h1>
            <p className="text-white/80 mt-1">Xem và quản lý tất cả sản phẩm trong hệ thống</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
            />
            <div className="flex items-center gap-4">
              {selectedProducts.length > 0 && (
                <DeleteButton
                  selectedCount={selectedProducts.length}
                  onDelete={handleDeleteSelected}
                />
              )}
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] hover:from-[#2C7A6C] hover:to-[#1A4A3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4EB09D] transition-all duration-200"
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4EB09D] mx-auto"></div>
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
            />
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}