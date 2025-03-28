"use client";

import { useState } from "react";
import { X, ShoppingCart, Box } from "lucide-react";
import BasicInfo from "@/components/admin/products/add/BasicInfo";
import ProductImages from "@/components/admin/products/add/ProductImages";
import ProductOrganization from "@/components/admin/products/add/ProductOrganization";
import PricingAndInventory from "@/components/admin/products/add/PricingAndInventory";
import SizesAndColors from "@/components/admin/products/add/SizesAndColors";

export default function AddProductPage() {
  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Images
  const [mainImage, setMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  // Organization
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [specialOffer, setSpecialOffer] = useState("");
  const [tag, setTag] = useState("");

  // Pricing and Inventory
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(0);

  // Sizes and Colors
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log({
      name,
      description,
      mainImage,
      additionalImages,
      category,
      supplier,
      specialOffer,
      tag,
      originalPrice,
      salePrice,
      stock,
      sizes,
      colors,
    });
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
            <button className="btn-secondary whitespace-nowrap">
              <X className="mr-2" size={18} />
              Hủy bỏ
            </button>
            <button 
              className="btn-primary whitespace-nowrap"
              onClick={handleSubmit}
            >
              <ShoppingCart className="mr-2" size={18} />
              Xuất bản sản phẩm
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <BasicInfo
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
            <ProductImages
              mainImage={mainImage}
              additionalImages={additionalImages}
              onMainImageChange={setMainImage}
              onAdditionalImagesChange={setAdditionalImages}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <ProductOrganization
              category={category}
              supplier={supplier}
              specialOffer={specialOffer}
              tag={tag}
              onCategoryChange={setCategory}
              onSupplierChange={setSupplier}
              onSpecialOfferChange={setSpecialOffer}
              onTagChange={setTag}
            />
            <PricingAndInventory
              originalPrice={originalPrice}
              salePrice={salePrice}
              stock={stock}
              onOriginalPriceChange={setOriginalPrice}
              onSalePriceChange={setSalePrice}
              onStockChange={setStock}
            />
            <SizesAndColors
              sizes={sizes}
              colors={colors}
              onSizesChange={setSizes}
              onColorsChange={setColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}