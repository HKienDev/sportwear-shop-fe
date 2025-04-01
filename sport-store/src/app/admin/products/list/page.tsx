"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductSearch from "@/components/admin/products/list/productSearch";
import ProductTable from "@/components/admin/products/list/productTable";
import Pagination from "@/components/admin/products/list/pagination";
import DeleteButton from "@/components/admin/products/list/deleteButton";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  images: {
    main: string;
    sub: string[];
  };
  createdAt: string;
  isActive: boolean;
  brand: string;
  sku: string;
}

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
  brand: string;
  sku: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: ProductResponse[];
}

interface ToggleStatusResponse {
  success: boolean;
  message?: string;
  data: {
    isActive: boolean;
  };
}

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Tính toán số trang và danh sách sản phẩm hiện tại
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/products") as ApiResponse;

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi lấy danh sách sản phẩm");
      }

      // Chuyển đổi dữ liệu để phù hợp với interface Product
      const formattedProducts = response.data.map((product: ProductResponse) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category.name,
        imageUrl: product.images.main,
        createdAt: product.createdAt,
        isActive: product.isActive,
        brand: product.brand,
        sku: product.sku
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Xử lý khi thay đổi từ khóa tìm kiếm
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Xử lý khi submit form tìm kiếm
  const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(lowercaseQuery);
      const descriptionMatch = product.description.toLowerCase().includes(lowercaseQuery);
      const skuMatch = product.sku.toLowerCase().includes(lowercaseQuery);
      const brandMatch = product.brand.toLowerCase().includes(lowercaseQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowercaseQuery);

      return nameMatch || descriptionMatch || skuMatch || brandMatch || categoryMatch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery]);

  // Xử lý khi chọn/bỏ chọn sản phẩm
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  // Xử lý khi xóa nhiều sản phẩm
  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(
        selectedProducts.map((productId) =>
          fetchWithAuth(`/products/${productId}`, {
            method: "DELETE",
          })
        )
      );

      // Cập nhật danh sách sản phẩm
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product._id))
      );
      setFilteredProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product._id))
      );
      setSelectedProducts([]);

      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  }, [selectedProducts]);

  // Xử lý khi chỉnh sửa sản phẩm
  const handleEdit = useCallback((productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  }, [router]);

  // Xử lý khi xóa một sản phẩm
  const handleDelete = useCallback(async (productId: string) => {
    try {
      const response = await fetchWithAuth(`/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi xóa sản phẩm");
      }

      // Cập nhật danh sách sản phẩm
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setFilteredProducts((prev) => prev.filter((product) => product._id !== productId));
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));

      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  }, []);

  // Xử lý khi thay đổi trạng thái sản phẩm
  const handleToggleStatus = useCallback(async (productId: string, isActive: boolean) => {
    try {
      const response = await fetchWithAuth(`/products/${productId}/toggle-status`, {
        method: "PATCH",
      }) as ToggleStatusResponse;

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi cập nhật trạng thái sản phẩm");
      }

      // Cập nhật danh sách sản phẩm
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, isActive: response.data.isActive }
            : product
        )
      );
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, isActive: response.data.isActive }
            : product
        )
      );

      toast.success(response.message || "Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      toast.error("Không thể cập nhật trạng thái sản phẩm");
    }
  }, []);

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => router.push("/admin/products/add")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm sản phẩm mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <ProductTable
              products={currentProducts}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
            
            <div className="flex justify-between items-center mt-4">
              <DeleteButton
                selectedCount={selectedProducts.length}
                onDelete={handleDeleteSelected}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}