"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { X, ShoppingCart, Box } from "lucide-react";
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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Box className="mr-3 text-blue-600" size={32} />
            Chi Tiết Sản Phẩm
          </h1>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="btn-secondary whitespace-nowrap"
            >
              <X className="mr-2" size={18} />
              Hủy bỏ
            </button>
            <button 
              className="btn-primary whitespace-nowrap"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <ShoppingCart className="mr-2" size={18} />
              {isSubmitting ? 'Đang xử lý...' : 'Xuất bản sản phẩm'}
            </button>
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
    </div>
  );
}