"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/user/products/productCard/page";
import { API_URL } from "@/utils/api";
import { Loader2, Filter, ChevronDown, X, Star, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { UserProduct } from "@/types/product";
import { Category } from "@/types/category";

// Shadcn UI Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Filter Types
interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  brands: string[];
  discount: boolean;
  rating: number;
  inStock: boolean;
}

interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

// Simple Collapsible Component
interface CollapsibleTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  isOpen?: boolean;
}

const Collapsible: React.FC<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === CollapsibleTrigger) {
        return React.cloneElement(child, { 
          onClick: () => setIsOpen(!isOpen),
          isOpen 
        } as CollapsibleTriggerProps);
      }
      if (child.type === CollapsibleContent) {
        return isOpen ? React.cloneElement(child) : null;
      }
    }
    return child;
  });

  return (
    <div className="border-b border-gray-200 pb-4">
      {childrenWithProps}
    </div>
  );
};

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ children, onClick, isOpen }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-2 hover:bg-gray-50 rounded-md px-2 transition-colors"
  >
    {children}
    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const CollapsibleContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="mt-4 space-y-4">
    {children}
  </div>
);

// Format currency helper
const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN") + "đ";
};



const ProductListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  
  // States
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string>("");

  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    colors: [],
    sizes: [],
    brands: [],
    discount: false,
    rating: 0,
    inStock: false,
  });
  
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Mới nhất', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'price-low', label: 'Giá thấp → cao' },
    { value: 'price-high', label: 'Giá cao → thấp' },
    { value: 'name-asc', label: 'Tên A → Z' },
    { value: 'name-desc', label: 'Tên Z → A' },
    { value: 'rating', label: 'Đánh giá cao nhất', icon: <Star className="w-4 h-4" /> },
  ];

  // Extract unique values for filters
  const uniqueValues = useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const brands = new Set<string>();
    const prices = products.map(p => p.originalPrice || 0);

    products.forEach(product => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(c => colors.add(c));
      }
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(s => sizes.add(s));
      }
      if (product.brand) brands.add(product.brand);
    });

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000000;

    return {
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
      brands: Array.from(brands).sort(),
      minPrice,
      maxPrice,
    };
  }, [products]);

  // Cập nhật price range khi products thay đổi
  useEffect(() => {
    if (products.length > 0 && uniqueValues.maxPrice > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, uniqueValues.maxPrice]
      }));
    }
  }, [products, uniqueValues.maxPrice]);

  // Fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        // Lấy thông tin category
        const catRes = await fetch(`${API_URL}/categories/slug/${categorySlug}`);
        
        if (!catRes.ok) {
          throw new Error("Không tìm thấy danh mục");
        }
        
        const catData = await catRes.json();
        setCategory(catData.data);
        
        // Lấy sản phẩm trực tiếp theo slug category (API mới)
        const res = await fetch(`${API_URL}/products/category/slug/${categorySlug}?limit=100`);
        
        if (!res.ok) {
          throw new Error("Không tìm thấy sản phẩm");
        }
        
        const data = await res.json();
        const productsArray = data.data.products || [];
        setProducts(productsArray);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    filtered = filtered.filter(product => {
      const price = product.originalPrice || 0;
      const hasDiscount = product.salePrice > 0;
      const rating = product.rating || 0;
      const inStock = (product.stock || 0) > 0;

      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      const colorMatch = filters.colors.length === 0 || (product.colors && product.colors.some(c => filters.colors.includes(c)));
      const sizeMatch = filters.sizes.length === 0 || (product.sizes && product.sizes.some(s => filters.sizes.includes(s)));
      const brandMatch = filters.brands.length === 0 || (product.brand && filters.brands.includes(product.brand));
      const discountMatch = !filters.discount || hasDiscount;
      const ratingMatch = !filters.rating || rating >= filters.rating;
      const stockMatch = !filters.inStock || inStock;

      return priceMatch && colorMatch && sizeMatch && brandMatch && discountMatch && ratingMatch && stockMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'price-low':
          return (a.originalPrice || 0) - (b.originalPrice || 0);
        case 'price-high':
          return (b.originalPrice || 0) - (a.originalPrice || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter handlers
  const handleFilterChange = useCallback((key: keyof FilterState, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, uniqueValues.maxPrice || 5000000],
      colors: [],
      sizes: [],
      brands: [],
      discount: false,
      rating: 0,
      inStock: false,
    });
  }, [uniqueValues.maxPrice]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/user" className="text-purple-600 hover:text-purple-800">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/user" className="text-purple-600 hover:text-purple-800">
                    Sản phẩm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">
                  {category?.name || "Danh mục"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        {category && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {category.image && (
                  <div className="relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-100 to-red-100 flex items-center justify-center border-2 border-white shadow-lg';
                          fallback.innerHTML = '<svg class="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
                    {category.description || `Khám phá bộ sưu tập ${category.name} chất lượng cao với đa dạng mẫu mã và giá cả phù hợp.`}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {products.length} sản phẩm
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      Còn hàng
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Filters Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Lọc nhanh:</span>
            <Button
              variant={filters.discount ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('discount', !filters.discount)}
              className="text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Giảm giá
            </Button>
            <Button
              variant={filters.inStock ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('inStock', !filters.inStock)}
              className="text-xs"
            >
              Còn hàng
            </Button>
            {filters.colors.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('colors', [])}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Xóa màu sắc
              </Button>
            )}
            {(filters.colors.length > 0 || filters.sizes.length > 0 || filters.brands.length > 0 || filters.discount || filters.inStock) && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="lg:w-56">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs"
                >
                  Đặt lại
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <Collapsible defaultOpen={true}>
                  <CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">Khoảng giá</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-4">
                      {/* Price Range Slider */}
                      <div className="space-y-3">
                        <Slider
                          value={filters.priceRange}
                          onValueChange={(value) => handleFilterChange('priceRange', value)}
                          max={uniqueValues.maxPrice}
                          min={uniqueValues.minPrice}
                          step={100000}
                          className="w-full"
                        />
                        <div className="flex justify-between gap-2">
                          <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg px-2 py-1.5 min-w-0">
                            <div className="text-xs text-purple-600 font-semibold truncate text-center">
                              {formatCurrency(filters.priceRange[0])}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-400 text-xs font-medium">
                            -
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg px-2 py-1.5 min-w-0">
                            <div className="text-xs text-purple-600 font-semibold truncate text-center">
                              {formatCurrency(filters.priceRange[1])}
                            </div>
                          </div>
                        </div>
                      </div>
                      

                      

                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Colors */}
                {uniqueValues.colors.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Màu sắc</span>
                        {filters.colors.length > 0 && (
                          <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 text-xs">
                            {filters.colors.length} đã chọn
                          </Badge>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {uniqueValues.colors.map((color) => (
                            <div key={color} className="flex items-center space-x-2">
                              <Checkbox
                                id={`color-${color}`}
                                checked={filters.colors.includes(color)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('colors', [...filters.colors, color]);
                                  } else {
                                    handleFilterChange('colors', filters.colors.filter(c => c !== color));
                                  }
                                }}
                              />
                              <label htmlFor={`color-${color}`} className="text-sm text-gray-700 font-medium truncate">
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <Separator />

                {/* Sizes */}
                {uniqueValues.sizes.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Kích thước</span>
                        {filters.sizes.length > 0 && (
                          <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-700 text-xs">
                            {filters.sizes.length} đã chọn
                          </Badge>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {uniqueValues.sizes.map((size) => (
                            <div key={size} className="flex items-center space-x-2">
                              <Checkbox
                                id={`size-${size}`}
                                checked={filters.sizes.includes(size)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('sizes', [...filters.sizes, size]);
                                  } else {
                                    handleFilterChange('sizes', filters.sizes.filter(s => s !== size));
                                  }
                                }}
                              />
                              <label htmlFor={`size-${size}`} className="text-sm text-gray-700 font-medium truncate">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <Separator />

                {/* Brands */}
                {uniqueValues.brands.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Thương hiệu</span>
                        {filters.brands.length > 0 && (
                          <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700 text-xs">
                            {filters.brands.length} đã chọn
                          </Badge>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          {uniqueValues.brands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={filters.brands.includes(brand)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange('brands', [...filters.brands, brand]);
                                  } else {
                                    handleFilterChange('brands', filters.brands.filter(b => b !== brand));
                                  }
                                }}
                              />
                              <label htmlFor={`brand-${brand}`} className="text-sm text-gray-700 font-medium truncate">
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with Sort and View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredProducts.length} sản phẩm
                </span>
                {(filters.colors.length > 0 || filters.sizes.length > 0 || filters.brands.length > 0 || filters.discount || filters.inStock) && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Đã lọc
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Sắp xếp
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={sortBy === option.value ? "bg-purple-50 text-purple-700" : ""}
                      >
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center min-h-[40vh]">
                <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <span className="text-lg text-red-500 font-semibold mb-2">{error}</span>
                <span className="text-gray-500">Vui lòng thử lại hoặc chọn danh mục khác.</span>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Image 
                  src="/empty-box.svg" 
                  alt="No products" 
                  width={128}
                  height={128}
                  className="w-32 h-32 mb-4 opacity-80" 
                />
                <span className="text-lg font-semibold text-gray-700 mb-1">Không tìm thấy sản phẩm phù hợp.</span>
                <span className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc quay lại sau.</span>
                <Button onClick={resetFilters} className="mt-4">
                  Đặt lại bộ lọc
                </Button>
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <>
                <div className="grid 
                  gap-4 
                  sm:gap-6 
                  lg:gap-8 
                  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                ">
                  {paginatedProducts.map((product) => (
                    <div key={product._id} className="flex justify-center">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Trước
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;