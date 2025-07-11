"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import ProductListTable from "@/components/admin/products/list/productListTable";
import ProductListFilters from "@/components/admin/products/list/productListFilters";
import { toast } from "sonner";
import { TOKEN_CONFIG } from '@/config/token';
import { AdminProduct, AdminCategory } from '@/types/product';
import { FeaturedProductConfig } from "@/components/admin/products/featuredProductModal";

export default function ProductListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
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
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }
      const queryParams = new URLSearchParams({
        search: searchTerm,
        category: categoryFilter,
      });
      const response = await fetch(
        `/api/products/admin?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      
      const data = await response.json();
      
      if (response.status === 404) {
        // Xử lý trường hợp không tìm thấy sản phẩm
        console.log("Không tìm thấy sản phẩm hoặc danh sách trống");
        setProducts([]);
        return;
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          router.push('/auth/login');
          return;
        }
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách sản phẩm");
      }
      
      if (data.success) {
        setProducts(data.data.products || []);
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi tải danh sách sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách sản phẩm");
    }
  }, [searchTerm, categoryFilter, router]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryFilterChange = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);

  const handleAddProduct = useCallback(() => {
    toast.success("Chuyển hướng đến trang thêm sản phẩm");
    router.push("/admin/products/add");
  }, [router]);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedProducts(prev =>
      prev.length === products.length ? [] : products.map(p => p._id)
    );
  }, [products]);

  const handleToggleSelectProduct = useCallback((id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  }, []);

  const handleEditProduct = useCallback((id: string) => {
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
      const product = products.find(p => p.sku === sku);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }
      const toastId = toast.loading(`Đang xóa sản phẩm "${product.name}"...`);
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
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

  const handleToggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const product = products.find(p => p._id === id);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }
      
      console.log('Toggling status for product:', { 
        id, 
        sku: product.sku, 
        name: product.name, 
        isActive 
      });
      
      const toastId = toast.loading(`Đang ${isActive ? 'kích hoạt' : 'ngừng bán'} sản phẩm "${product.name}"...`);
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Calling API:', `/api/products/sku/${product.sku}`);
      console.log('Request body:', { isActive });
      
      const response = await fetch(`/api/products/sku/${product.sku}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isActive: Boolean(isActive) })
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm";
        try {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Success data:', data);
      
      if (data.success) {
        toast.success(`Đã ${isActive ? 'kích hoạt' : 'ngừng bán'} sản phẩm "${product.name}" thành công`, { id: toastId });
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm";
      toast.error(errorMessage);
    }
  }, [fetchProducts, products]);

  const handleToggleFeatured = useCallback(async (sku: string, isFeatured: boolean) => {
    try {
      const product = products.find(p => p.sku === sku);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }
      const toastId = toast.loading(`Đang ${isFeatured ? 'đặt làm nổi bật' : 'hủy nổi bật'} sản phẩm "${product.name}"...`);
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/products/sku/${sku}/featured`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isFeatured: Boolean(isFeatured) })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi cập nhật trạng thái nổi bật");
      }
      const data = await response.json();
      if (data.success) {
        toast.success(`Đã ${isFeatured ? 'đặt làm nổi bật' : 'hủy nổi bật'} sản phẩm "${product.name}" thành công`, { id: toastId });
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật trạng thái nổi bật", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nổi bật:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái nổi bật");
    }
  }, [fetchProducts, products]);

  const handleBulkDeleteProducts = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }

    try {
      const toastId = toast.loading(`Đang xóa ${selectedProducts.length} sản phẩm...`);
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/products/bulk-delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ productIds: selectedProducts })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi xóa sản phẩm");
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`Đã xóa ${data.data.deletedCount} sản phẩm thành công`, { id: toastId });
        setSelectedProducts([]);
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi xóa sản phẩm", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm");
    }
  }, [selectedProducts, fetchProducts]);

  const handleSetupFeatured = useCallback(async (sku: string, config: FeaturedProductConfig) => {
    try {
      const product = products.find(p => p.sku === sku);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm");
        return;
      }
      
      const toastId = toast.loading(`Đang setup countdown cho sản phẩm "${product.name}"...`);
      
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/products/sku/${sku}/featured-config`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi setup countdown");
      }
      
      const data = await response.json();
      if (data.success) {
        toast.success(`Đã setup countdown cho sản phẩm "${product.name}" thành công`, { id: toastId });
        fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi setup countdown", { id: toastId });
      }
    } catch (error) {
      console.error("Lỗi khi setup countdown:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi setup countdown");
    }
  }, [fetchProducts, products]);

  // Check if should redirect after all hooks are defined
  const shouldRedirect = !loading && (!isAuthenticated || user?.role !== 'admin');

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/admin/login');
    }
  }, [shouldRedirect, router]);

  if (shouldRedirect) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-600 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-white tracking-tight relative">
                Quản lý sản phẩm
                <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
              </h1>
              <p className="text-indigo-50 mt-2 max-w-2xl text-opacity-90">Xem và quản lý tất cả sản phẩm trong hệ thống</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6">
          <ProductListFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={handleCategoryFilterChange}
            onAddProduct={handleAddProduct}
            categories={categories}
          />
        </div>

        {/* Bulk Actions - With Animation */}
        {selectedProducts.length > 0 && (
          <div 
            className="mb-6 relative overflow-hidden" 
            style={{
              animation: "slideInFromTop 0.3s ease-out forwards"
            }}
          >
            <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform -rotate-1"></div>
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-rose-100 p-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-semibold mr-3">
                    {selectedProducts.length}
                  </span>
                  <span className="text-slate-700">sản phẩm đã được chọn</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Bỏ chọn
                  </button>
                  <button
                    onClick={handleBulkDeleteProducts}
                    className="group px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 flex items-center text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30"
                  >
                    Xóa đã chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Container with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-500 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            {products.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-medium text-slate-800">Không tìm thấy sản phẩm</h3>
                <p className="mt-2 text-slate-500 max-w-sm">
                  Hiện không có sản phẩm nào phù hợp với điều kiện tìm kiếm của bạn.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                  }}
                  className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-600 rounded-lg hover:from-indigo-100 hover:to-emerald-100 transition-all duration-200 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto relative">
                {/* Table Scroll Shadow Effect */}
                <div className="absolute pointer-events-none inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute pointer-events-none inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                {/* Enhanced Table */}
                <div className="min-w-full">
                  <ProductListTable
                    products={products}
                    selectedProducts={selectedProducts}
                    onToggleSelectAll={handleToggleSelectAll}
                    onToggleSelectProduct={handleToggleSelectProduct}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleStatus={handleToggleStatus}
                    onToggleFeatured={handleToggleFeatured}
                    onSetupFeatured={handleSetupFeatured}
                    categories={categories}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}