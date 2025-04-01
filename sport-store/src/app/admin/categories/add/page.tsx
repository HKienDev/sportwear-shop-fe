"use client";

import CategoryForm from "@/components/admin/categories/add/categoryForm";

export default function AddCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6">
        <CategoryForm />
      </div>
    </div>
  );
} 