'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Star, 
  Crown, 
  TrendingUp, 
  Sparkles,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Brand, BrandFormData } from '@/types/brand';
import { adminBrandService } from '@/services/adminBrandService';
import { toast } from 'sonner';

interface BrandFormProps {
  brand?: Brand | null;
  onSubmit: (data: BrandFormData) => Promise<void>;
  onClose: () => void;
}

export default function BrandForm({ brand, onSubmit, onClose }: BrandFormProps) {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    logo: '',
    description: '',
    rating: 0,
    productsCount: 0,
    features: [],
    isPremium: false,
    isTrending: false,
    isNew: false,
    featured: false,
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        logo: brand.logo,
        description: brand.description,
        rating: brand.rating,
        productsCount: brand.productsCount,
        features: brand.features,
        isPremium: brand.isPremium,
        isTrending: brand.isTrending,
        isNew: brand.isNew,
        featured: brand.featured,
        status: brand.status
      });
    }
  }, [brand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Kiểm tra nếu đây là flag (cờ hiệu)
      const flagKeys = ['isPremium', 'isTrending', 'isNew', 'featured'];
      if (flagKeys.includes(name)) {
        if (checked) {
          // Đếm số flags hiện tại đã được chọn
          const currentFlags = flagKeys.filter(key => 
            key !== name && formData[key as keyof BrandFormData] as boolean
          ).length;
          
          // Nếu đã có 2 flags và đang cố gắng thêm flag mới
          if (currentFlags >= 2) {
            toast.error('Chỉ được chọn tối đa 2 cờ hiệu!');
            return;
          }
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File quá lớn! Kích thước tối đa: 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Không phải file ảnh! Chỉ chấp nhận: JPG, PNG, GIF, WEBP');
      return;
    }

    try {
      setUploadingLogo(true);
      const response = await adminBrandService.uploadBrandLogo(file);
      
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          logo: response.data.url
        }));
        toast.success('Upload logo thành công');
      } else {
        toast.error(response.message || 'Upload logo thất bại');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Có lỗi xảy ra khi upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.logo || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableFeatures = ['Chất Lượng Cao', 'Đổi Mới', 'Bền Vững', 'Hiệu Suất', 'Phong Cách', 'Công Nghệ', 'Thoải Mái', 'Truyền Thống'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/60">
        
        {/* Header with Premium Styling */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {brand ? <Crown className="w-5 h-5 text-white" /> : <Star className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {brand ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}
                </h2>
                <p className="text-indigo-100 text-sm">
                  {brand ? 'Cập nhật thông tin thương hiệu' : 'Tạo thương hiệu mới cho hệ thống'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form with Enhanced Styling */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 relative">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thông Tin Cơ Bản</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tên thương hiệu *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-lg"
                  placeholder="Nhập tên thương hiệu..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logo Section */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Logo thương hiệu *
                  </label>
                  <div className="space-y-4">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-300 shadow-lg">
                      {uploadingLogo ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="text-xs text-gray-500 mt-2 font-medium">Uploading...</span>
                        </div>
                      ) : formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <Upload className="w-10 h-10 text-gray-400" />
                      )}
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                        disabled={uploadingLogo}
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`inline-flex items-center gap-2 cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          uploadingLogo 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingLogo ? 'Đang upload...' : 'Chọn logo'}
                      </label>
                      <p className="text-xs text-gray-500 font-medium">
                        JPG, PNG, GIF, WEBP (tối đa 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mô tả thương hiệu *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
                    placeholder="Mô tả chi tiết về thương hiệu..."
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thống Kê</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Đánh giá
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          rating: star
                        }));
                      }}
                      className="p-1 hover:scale-110 transition-all duration-200"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'text-[#7C54F3] fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Số sản phẩm
                </label>
                <div>
                  <input
                    type="text"
                    value={formData.productsCount.toLocaleString()}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      const numValue = parseInt(value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        productsCount: numValue
                      }));
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-lg"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tính Năng</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {availableFeatures.map(feature => (
                <label key={feature} className="group relative flex items-center space-x-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:bg-purple-50/50">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-200">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cờ Hiệu</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: 'isPremium', label: 'Premium', icon: Crown, color: 'from-yellow-500 to-orange-500' },
                { key: 'isTrending', label: 'Trending', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
                { key: 'isNew', label: 'Mới', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
                { key: 'featured', label: 'Nổi bật', icon: Star, color: 'from-purple-500 to-pink-500' }
              ].map(flag => (
                <label key={flag.key} className="group relative flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
                  <input
                    type="checkbox"
                    name={flag.key}
                    checked={formData[flag.key as keyof BrandFormData] as boolean}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                  <div className={`w-8 h-8 bg-gradient-to-r ${flag.color} rounded-lg flex items-center justify-center`}>
                    <flag.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trạng Thái</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="group relative flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200 hover:bg-green-50/50">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                />
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-200">Hoạt động</span>
              </label>
              <label className="group relative flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all duration-200 hover:bg-red-50/50">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-red-600 border-2 border-gray-300 focus:ring-4 focus:ring-red-500/20 transition-all duration-200"
                />
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-red-700 transition-colors duration-200">Không hoạt động</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer with Premium Styling */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-b-3xl border-t border-gray-200/60">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : (brand ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 