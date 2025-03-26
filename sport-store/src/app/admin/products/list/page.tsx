"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductSearch from "@/components/admin/products/list/productSearch";
import ProductTable from "@/components/admin/products/list/productTable";
import Pagination from "@/components/admin/products/list/pagination";
import DeleteButton from "@/components/admin/products/list/deleteButton";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Category {
  _id: string;
  name: string;
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
}

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Thêm state cho categories
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
      const { data, ok, status } = await fetchWithAuth("/products");

      if (!ok) {
        if (status === 401 || status === 403) {
          toast.error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập");
          router.push("/login");
          return;
        }
        throw new Error("Lỗi khi lấy danh sách sản phẩm");
      }

      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Lấy danh sách categories từ API
  const fetchCategories = useCallback(async () => {
    try {
      const { data, ok, status } = await fetchWithAuth("/categories");

      if (!ok) {
        if (status === 401 || status === 403) {
          toast.error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập");
          router.push("/login");
          return;
        }
        throw new Error("Lỗi khi lấy danh sách thể loại");
      }

      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      toast.error("Không thể tải danh sách thể loại");
    }
  }, [router]);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const filtered = products.filter((product) => {
      // Tìm kiếm theo tên sản phẩm
      const nameMatch = product.name?.toLowerCase().includes(lowercaseQuery);
      // Tìm kiếm theo mô tả sản phẩm
      const descriptionMatch = product.description?.toLowerCase().includes(lowercaseQuery);
      // Tìm kiếm theo giá sản phẩm
      const priceMatch = product.price?.toString().includes(query);

      return nameMatch || descriptionMatch || priceMatch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products]);

  // Xử lý chọn/bỏ chọn sản phẩm
  const handleSelectProduct = useCallback((id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  }, []);

  // Xử lý xóa sản phẩm đã chọn
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedProducts.length) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?
Lưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      // Xóa tuần tự để có thể xử lý lỗi cho từng sản phẩm
      for (const id of selectedProducts) {
        const response = await fetchWithAuth(`/products/admin/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Nếu có lỗi với sản phẩm nào đó, dừng quá trình xóa
          if (response.status === 403) {
            toast.error("Bạn không có quyền xóa sản phẩm");
            return;
          }
          if (response.status === 404) {
            toast.error(`Không tìm thấy sản phẩm với ID: ${id}`);
            continue;
          }
          throw new Error("Có lỗi xảy ra khi xóa sản phẩm");
        }
      }

      toast.success(`Đã xóa thành công ${selectedProducts.length} sản phẩm`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa một số sản phẩm. Vui lòng thử lại sau");
    }
  }, [selectedProducts, fetchProducts]);

  // Tải danh sách sản phẩm và categories khi component được mount
  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Gọi hàm lấy danh sách categories
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        DANH SÁCH SẢN PHẨM
        {isLoading && <span className="ml-2 text-gray-500 text-sm">(Đang tải...)</span>}
      </h1>

      <div className="flex justify-between mb-4">
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
        />
        <DeleteButton
          selectedCount={selectedProducts.length}
          onDelete={handleDeleteSelected}
        />
      </div>

      {/* Truyền categories vào ProductTable */}
      <ProductTable
        products={currentProducts}
        categories={categories} // Thêm dòng này
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}