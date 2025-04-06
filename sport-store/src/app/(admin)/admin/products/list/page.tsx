"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import ProductTable from "@/components/admin/products/list/productTable";
import ProductSearch from "@/components/admin/products/list/productSearch";
import DeleteButton from "@/components/admin/products/list/deleteButton";
import ProductPagination from "@/components/admin/products/list/pagination";
import { toast } from "sonner";
import { TOKEN_CONFIG } from '@/config/token';

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

export default function ProductListPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập trang này");
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Kiểm tra token có tồn tại không
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/categories', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách danh mục");
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Categories fetched:', data.data);
        setCategories(data.data.categories || []);
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách danh mục");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách danh mục");
    }
  }, [router]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Kiểm tra token có tồn tại không
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }

      // Chuẩn bị query params
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "5",
        ...searchParams,
      });

      console.log("Fetching products with params:", queryParams.toString());
      console.log("Search param value:", searchParams.search);
      console.log("Token:", token ? "Token exists" : "No token");

      // Sử dụng API route của Next.js thay vì gọi trực tiếp đến backend
      const response = await fetch(
        `/api/products/admin?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        // Xử lý lỗi Unauthorized
        if (response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          router.push('/auth/login');
          return;
        }
        
        // Đọc dữ liệu lỗi
        let errorMessage = "Có lỗi xảy ra khi tải danh sách sản phẩm";
        let errorDetails = {};
        
        try {
          const text = await response.text();
          console.error("API error response text:", text);
          
          if (text) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorMessage;
              errorDetails = errorData.details || {};
            } catch (e) {
              console.error("Failed to parse error response as JSON:", e);
            }
          }
        } catch (e) {
          console.error("Failed to read error response:", e);
        }
        
        console.error("API error details:", errorDetails);
        throw new Error(errorMessage);
      }

      // Đọc dữ liệu response
      let data;
      try {
        const text = await response.text();
        console.log("API response text:", text);
        
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse response as JSON:", e);
            throw new Error("Dữ liệu không hợp lệ từ máy chủ");
          }
        } else {
          throw new Error("Không có dữ liệu từ máy chủ");
        }
      } catch (e) {
        console.error("Failed to read response:", e);
        throw new Error("Không thể đọc dữ liệu từ máy chủ");
      }

      console.log("Products data:", data);

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams, router]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    toast.loading("Đang tìm kiếm sản phẩm...");
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = useCallback(() => {
    toast.success("Chuyển hướng đến trang thêm sản phẩm");
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
    // Tìm sản phẩm theo ID
    const product = products.find(p => p._id === id);
    if (!product) {
      toast.error("Không tìm thấy sản phẩm");
      return;
    }
    
    toast.success("Chuyển hướng đến trang chỉnh sửa sản phẩm");
    router.push(`/admin/products/edit?sku=${product.sku}`);
  }, [router, products]);

  const handleDeleteProduct = useCallback(async (sku: string) => {
    try {
      // Tìm sản phẩm theo SKU
      const product = products.find(p => p.sku === sku);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }

      // Hiển thị toast đang xóa
      const toastId = toast.loading(`Đang xóa sản phẩm "${product.name}"...`);

      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Thêm token vào header nếu có
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/products/sku/${sku}`, {
        method: "DELETE",
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi xóa sản phẩm");
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Đã xóa sản phẩm "${product.name}" thành công`, { id: toastId });
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi xóa sản phẩm", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm");
    }
  }, [fetchProducts, products]);

  const handleDeleteSelected = useCallback(async () => {
    try {
      if (selectedProducts.length === 0) {
        toast.error("Vui lòng chọn ít nhất một sản phẩm để xóa");
        return;
      }

      // Lấy danh sách tên sản phẩm đã chọn
      const selectedProductNames = selectedProducts
        .map(id => products.find(p => p._id === id)?.name)
        .filter(Boolean);

      // Hiển thị toast đang xóa
      const toastId = toast.loading(`Đang xóa ${selectedProducts.length} sản phẩm: ${selectedProductNames.join(', ')}...`);

      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Thêm token vào header nếu có
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Xóa từng sản phẩm một
      let successCount = 0;
      let failCount = 0;
      const failedProducts: string[] = [];

      for (const id of selectedProducts) {
        // Tìm sản phẩm theo ID
        const product = products.find(p => p._id === id);
        if (!product) {
          console.error(`Không tìm thấy sản phẩm ${id}`);
          failCount++;
          continue;
        }

        try {
          const response = await fetch(`/api/products/sku/${product.sku}`, {
            method: "DELETE",
            headers
          });

          if (!response.ok) {
            failCount++;
            failedProducts.push(product.name);
            continue;
          }

          const data = await response.json();
          
          if (data.success) {
            successCount++;
          } else {
            failCount++;
            failedProducts.push(product.name);
          }
        } catch (error) {
          console.error(`Lỗi khi xóa sản phẩm ${product._id}:`, error);
          failCount++;
          failedProducts.push(product.name);
        }
      }

      // Hiển thị thông báo kết quả
      if (successCount > 0) {
        toast.success(`Đã xóa thành công ${successCount} sản phẩm`, { id: toastId });
      }

      if (failCount > 0) {
        toast.error(
          `Không thể xóa ${failCount} sản phẩm: ${failedProducts.join(", ")}`,
          { duration: 5000 }
        );
      }

      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm");
    }
  }, [selectedProducts, fetchProducts, products]);

  const handleToggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const product = products.find(p => p._id === id);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }

      const toastId = toast.loading("Đang cập nhật trạng thái...");
      const action = isActive ? "kích hoạt" : "vô hiệu hóa";

      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        toast.error("Vui lòng đăng nhập lại", { id: toastId });
        router.push('/auth/login');
        return;
      }

      // Log để debug
      console.log('Toggling product status:', {
        productId: id,
        productSku: product.sku,
        currentStatus: product.isActive,
        newStatus: isActive
      });

      const response = await fetch(
        `/api/products/sku/${product.sku}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: isActive
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", { id: toastId });
          router.push('/auth/login');
          return;
        }
        
        // Đọc dữ liệu lỗi
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`Đã ${action} sản phẩm "${product.name}" thành công`, { id: toastId });
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật trạng thái", { id: toastId });
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm");
    }
  }, [products, fetchProducts, router]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    toast.loading(`Đang tải trang ${page}...`);
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
              searchQuery={searchParams.search}
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
        {loading ? (
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
              categories={categories}
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