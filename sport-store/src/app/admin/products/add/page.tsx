"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { X, ShoppingCart, Box, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import BasicInfo from "@/components/admin/products/add/BasicInfo";
import ProductImages from "@/components/admin/products/add/ProductImages";
import ProductOrganization from "@/components/admin/products/add/ProductOrganization";
import PricingAndInventory from "@/components/admin/products/add/PricingAndInventory";
import SizesAndColors from "@/components/admin/products/add/SizesAndColors";

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  sku: string;
  tags: string[];
  images: string[];
  category: string;
  subcategory: string;
  price: number;
  discountPrice: number;
  stock: number;
  sizes: string[];
  colors: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    sku: '',
    tags: [],
    images: [],
    category: '',
    subcategory: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    sizes: [],
    colors: [],
  });

  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  }, []);

  const handleBrandChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, brand: value }));
  }, []);

  const handleSkuChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, sku: value }));
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  }, []);

  const handleImagesChange = useCallback((images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  }, []);

  const handleSubcategoryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, subcategory: value }));
  }, []);

  const handlePriceChange = useCallback((value: number) => {
    setFormData(prev => ({ ...prev, price: value }));
  }, []);

  const handleDiscountPriceChange = useCallback((value: number) => {
    setFormData(prev => ({ ...prev, discountPrice: value }));
  }, []);

  const handleStockChange = useCallback((value: number) => {
    setFormData(prev => ({ ...prev, stock: value }));
  }, []);

  const handleSizesChange = useCallback((sizes: string[]) => {
    setFormData(prev => ({ ...prev, sizes }));
  }, []);

  const handleColorsChange = useCallback((colors: string[]) => {
    setFormData(prev => ({ ...prev, colors }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Create FormData object
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('brand', formData.brand);
      submitData.append('sku', formData.sku);
      submitData.append('price', formData.price.toString());
      submitData.append('discountPrice', formData.discountPrice.toString());
      submitData.append('stock', formData.stock.toString());
      submitData.append('category', formData.category);
      submitData.append('subcategory', formData.subcategory);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('sizes', JSON.stringify(formData.sizes));
      submitData.append('colors', JSON.stringify(formData.colors));
      submitData.append('images', JSON.stringify(formData.images));

      // Send request to API
      const response = await fetch('/api/products/admin', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast.success('Sản phẩm đã được tạo thành công');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Có lỗi xảy ra khi tạo sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-blue-600 transition-colors">
          <Home size={16} className="inline-block" />
          <span className="ml-1">Dashboard</span>
        </Link>
        <ChevronRight size={16} className="text-gray-400" />
        <Link href="/admin/products" className="text-gray-500 hover:text-blue-600 transition-colors">
          Sản phẩm
        </Link>
        <ChevronRight size={16} className="text-gray-400" />
        <span className="text-gray-900 font-medium">Thêm sản phẩm mới</span>
      </nav>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Box className="mr-3 text-blue-600" size={28} />
              Thêm Sản Phẩm Mới
            </h1>
            <p className="mt-2 text-gray-600">Điền thông tin chi tiết về sản phẩm của bạn</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="btn-secondary hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="mr-2" size={18} />
              Hủy bỏ
            </button>
            <button 
              className="btn-primary hover:bg-blue-700 transition-colors duration-200"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <ShoppingCart className="mr-2" size={18} />
              {isSubmitting ? 'Đang xử lý...' : 'Xuất bản sản phẩm'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfo
            name={formData.name}
            description={formData.description}
            brand={formData.brand}
            sku={formData.sku}
            tags={formData.tags}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onBrandChange={handleBrandChange}
            onSkuChange={handleSkuChange}
            onTagsChange={handleTagsChange}
          />
          <ProductImages
            images={formData.images}
            onImagesChange={handleImagesChange}
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          <ProductOrganization
            category={formData.category}
            subcategory={formData.subcategory}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
          />
          <PricingAndInventory
            price={formData.price}
            discountPrice={formData.discountPrice}
            stock={formData.stock}
            onPriceChange={handlePriceChange}
            onDiscountPriceChange={handleDiscountPriceChange}
            onStockChange={handleStockChange}
          />
          <SizesAndColors
            sizes={formData.sizes}
            colors={formData.colors}
            onSizesChange={handleSizesChange}
            onColorsChange={handleColorsChange}
          />
        </div>
      </div>
    </div>
  );
}