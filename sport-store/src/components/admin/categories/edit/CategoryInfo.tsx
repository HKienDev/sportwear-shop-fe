"use client";

import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface CategoryInfoProps {
  category: Category;
}

export default function CategoryInfo({ category }: CategoryInfoProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Mã: {category.categoryId}</p>
        </div>
        <Badge variant={category.isActive ? "success" : "destructive"}>
          {category.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Mô tả</h3>
            <p className="mt-2 text-sm text-gray-900">{category.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Slug</h3>
            <p className="mt-2 text-sm text-gray-900">{category.slug}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
            <p className="mt-2 text-sm text-gray-900">
              {formatDate(category.createdAt)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngày cập nhật</h3>
            <p className="mt-2 text-sm text-gray-900">
              {formatDate(category.updatedAt)}
            </p>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
} 