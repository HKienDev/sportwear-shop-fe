import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';
import { fetchApi } from '@/utils/api';

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export default function CategoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchApi('/categories/admin', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!response.success) {
        throw new Error(response.message || 'Có lỗi xảy ra khi thêm thể loại');
      }

      toast.success('Thêm thể loại thành công!');
      router.push('/admin/categories/list');
    } catch (error) {
      console.error('Lỗi khi thêm thể loại:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thêm thể loại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Thêm Thể Loại Mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên thể loại
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Nhập tên thể loại"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="Nhập mô tả thể loại"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Hiển thị thể loại
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 