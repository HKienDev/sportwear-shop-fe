import React from "react";
import { Edit, Power, Trash } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryStatusCardsProps {
  categories: Category[];
}

export default function CategoryStatusCards({ categories }: CategoryStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tổng Danh Mục</p>
              <p className="text-3xl font-bold text-slate-800">{categories.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Edit size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Đang Hoạt Động</p>
              <p className="text-3xl font-bold text-slate-800">{categories.filter((category) => category.isActive).length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <Power size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tạm Dừng</p>
              <p className="text-3xl font-bold text-slate-800">{categories.filter((category) => !category.isActive).length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Trash size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Có Sản Phẩm</p>
              <p className="text-3xl font-bold text-slate-800">{categories.filter((category) => category.productCount > 0).length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Edit size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 