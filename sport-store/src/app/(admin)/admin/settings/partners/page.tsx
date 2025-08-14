'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Crown, Sparkles, CheckCircle, XCircle, X, Trophy, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { adminBrandService } from '@/services/adminBrandService';
import { Brand, BrandFilters } from '@/types/brand';
import BrandForm from './BrandForm';

export default function PartnersPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [filters] = useState<BrandFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');


  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching brands with filters:', filters, 'page:', currentPage);
      const response = await adminBrandService.getBrands(filters, currentPage, 10);
      console.log('Fetch brands response:', response);
      
      if (response.success) {
        setBrands(response.data.brands || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalBrands(response.data.pagination?.total || 0);
        console.log('Set brands:', response.data.brands || []);
      } else {
        toast.error('Không thể tải danh sách thương hiệu');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;

    try {
      const response = await adminBrandService.deleteBrand(id);
      if (response.success) {
        toast.success('Xóa thương hiệu thành công');
        fetchBrands();
      } else {
        toast.error(response.message || 'Xóa thương hiệu thất bại');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Có lỗi xảy ra khi xóa thương hiệu');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await adminBrandService.toggleBrandStatus(id);
      if (response.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchBrands();
      } else {
        toast.error(response.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error toggling brand status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleBulkDelete = async () => {
    console.log('Bulk delete clicked, selectedBrands:', selectedBrands);
    if (selectedBrands.length === 0) {
      toast.error('Vui lòng chọn thương hiệu để xóa');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedBrands.length} thương hiệu đã chọn?`)) return;

    try {
      console.log('Calling deleteMultipleBrands with:', selectedBrands);
      const response = await adminBrandService.deleteMultipleBrands(selectedBrands);
      console.log('Delete response:', response);
      if (response.success) {
        toast.success(`Xóa ${selectedBrands.length} thương hiệu thành công`);
        setSelectedBrands([]);
        fetchBrands();
      } else {
        toast.error(response.message || 'Xóa thương hiệu thất bại');
      }
    } catch (error) {
      console.error('Error bulk deleting brands:', error);
      toast.error('Có lỗi xảy ra khi xóa thương hiệu');
    }
  };



  const handleSelectBrand = (id: string) => {
    console.log('Selecting brand with id:', id);
    setSelectedBrands(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(brandId => brandId !== id)
        : [...prev, id];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const handleFormSubmit = async (brandData: Brand) => {
    try {
      let response;
      if (editingBrand) {
        response = await adminBrandService.updateBrand(editingBrand._id!, brandData);
      } else {
        response = await adminBrandService.createBrand(brandData);
      }

      if (response.success) {
        toast.success(editingBrand ? 'Cập nhật thương hiệu thành công' : 'Tạo thương hiệu thành công');
        setShowForm(false);
        setEditingBrand(null);
        fetchBrands();
      } else {
        toast.error(response.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error('Error submitting brand:', error);
      toast.error('Có lỗi xảy ra khi lưu thương hiệu');
    }
  };

  const renderStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Không hoạt động
      </span>
    );
  };

  const renderFeatureBadges = (brand: Brand) => {
    const badges = [];
    // Không hiển thị PREMIUM badge ở đây vì đã hiển thị ở trên
    if (brand.isTrending) badges.push({ 
      icon: TrendingUp, 
      text: 'TRENDING', 
      gradient: 'from-red-400 to-pink-500',
      shadow: 'shadow-red-500/25'
    });
    if (brand.isNew) badges.push({ 
      icon: Sparkles, 
      text: 'NEW', 
      gradient: 'from-green-400 to-emerald-500',
      shadow: 'shadow-green-500/25'
    });
    
    return badges.map((badge, index) => (
      <span 
        key={index} 
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.gradient} shadow-lg ${badge.shadow} transition-all duration-200 hover:scale-105 hover:shadow-xl`}
      >
        <badge.icon className="w-3 h-3 mr-1.5" />
        {badge.text}
      </span>
    ));
  };

  // Calculate stats
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const premiumBrands = brands.filter(b => b.isPremium).length;
  const featuredBrands = brands.filter(b => b.featured).length;

  if (loading && brands.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản Lý Thương Hiệu Đối Tác
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Quản lý danh sách thương hiệu đối tác của hệ thống với giao diện hiện đại
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Brands */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tổng Thương Hiệu</p>
                <p className="text-3xl font-bold text-slate-900">{totalBrands}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Brands */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đang Hoạt Động</p>
                <p className="text-3xl font-bold text-slate-900">{activeBrands}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Premium Brands */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-yellow-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Thương Hiệu Premium</p>
                <p className="text-3xl font-bold text-slate-900">{premiumBrands}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Featured Brands */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Thương Hiệu Nổi Bật</p>
                <p className="text-3xl font-bold text-slate-900">{featuredBrands}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative mb-8">
          {/* Glass Morphism Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          
          {/* Main Container */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Search Section */}
              <div className="flex-1 w-full lg:max-w-xl group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên thương hiệu, mô tả..."
                    className="block w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-300 border-slate-200 hover:border-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  {searchTerm && (
                    <button 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters & Actions Section */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Status Filter */}
                <div className="relative w-full sm:w-48 group">
                  <select
                    className="block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>



                {/* Add Brand Button */}
                <button
                  className="group relative inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transform hover:scale-105"
                  onClick={handleCreateBrand}
                >
                  <Plus size={20} className="mr-2 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
                  Thêm Thương Hiệu
                  <Sparkles size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions - With Enhanced Animation */}
        {selectedBrands.length > 0 && (
          <div 
            className="mb-6 relative overflow-hidden" 
            style={{
              animation: "slideInFromTop 0.4s ease-out forwards"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/60 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                    <span className="text-white font-bold text-lg">{selectedBrands.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 font-semibold">thương hiệu đã được chọn</span>
                    <p className="text-sm text-slate-500">Sẵn sàng thực hiện thao tác hàng loạt</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20 flex items-center text-sm font-medium shadow-sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Bỏ chọn tất cả
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="group px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/30 flex items-center text-sm font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transform hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Xóa đã chọn ({selectedBrands.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => {
            console.log('Rendering brand:', brand.name, 'with _id:', brand._id);
            return (
              <div
                key={brand._id || brand.name}
                className={`group relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                  selectedBrands.includes(brand._id || '') 
                    ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                } overflow-hidden`}
              >

                {/* Checkbox with Premium Styling */}
                <div className="p-4 pb-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand._id || '')}
                      onChange={() => handleSelectBrand(brand._id || '')}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-200"
                    />
                    {brand.isPremium && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                        <Crown className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">PREMIUM</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Brand Logo */}
                <div className="px-4 pb-4">
                  <div className="relative aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-6 mb-4 border border-gray-200">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Premium Badge */}
                    {brand.isPremium && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {brand.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{brand.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {brand.description}
                    </p>

                    {/* Stats Display */}
                    <div className="text-center py-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {brand.productsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Sản phẩm</div>
                    </div>

                    {/* Feature Badges with Enhanced Styling */}
                    <div className="flex flex-wrap gap-2">
                      {renderFeatureBadges(brand)}
                    </div>

                    {/* Status and Actions with Premium Styling */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(brand.status)}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(brand._id || '')}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title={brand.status === 'active' ? 'Ẩn' : 'Hiện'}
                        >
                          {brand.status === 'active' ? 
                            <EyeOff className="w-4 h-4" /> : 
                            <Eye className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand._id || '')}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalBrands)} của {totalBrands} thương hiệu
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {/* Brand Form Modal */}
        {showForm && (
          <BrandForm
            brand={editingBrand}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingBrand(null);
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 