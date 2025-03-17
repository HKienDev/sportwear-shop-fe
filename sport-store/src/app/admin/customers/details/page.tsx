'use client';

import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import UserProfileComponent from '@/components/profileUser/UserProfileForm';
import MembershipComponent from '@/components/membershipTier/MembershipTier';
import WishlistComponent from '@/components/wishlistPage/WishlistPage';
import OrderUserComponent from '@/components/orderUser/OrderUserPage';

interface User {
  name: string;
  id: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface Membership {
  tier: string;
  totalPoints: string;
  minimumSpend: string;
  discountPercentage: number;
  freeShipping: boolean;
}

const CustomerDetails: React.FC = () => {
  // Khai báo dữ liệu khách hàng
  const user: User = {
    name: "Hoàng Tiến Trung Kiên",
    id: "#1273657",
    phone: "0378809999",
    province: "HÀ NỘI",
    district: "NAM TỪ LIÊM",
    ward: "MỸ ĐÌNH 2",
    address: "01, LÊ ĐỨC THỌ",
  };

  const membership: Membership = {
    tier: "Kim Cương",
    totalPoints: "123.324.000 VND",
    minimumSpend: "50 triệu đồng",
    discountPercentage: 1,
    freeShipping: true,
  };

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">CHI TIẾT KHÁCH HÀNG</h1>

      {/* Info cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-2 min-w-52">
          <div className="p-2 bg-gray-100 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-600">Tổng Đơn Hàng</div>
            <div className="font-semibold">45</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-2 min-w-52">
          <div className="p-2 bg-gray-100 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-600">Tổng Chi Tiêu</div>
            <div className="font-semibold">123.324.000 VND</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-2 min-w-52">
          <div className="p-2 bg-gray-100 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-600">Ngày Tham Gia</div>
            <div className="font-semibold">17/08/2022</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 text-white bg-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            <Trash2 size={20} />
            <span>Xoá Khách Hàng</span>
          </button>
        </div>
      </div>

      {/* Profile section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column - User profile */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {React.createElement(UserProfileComponent, { user })}
        </div>

        {/* Right column - Membership info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {React.createElement(MembershipComponent, { membership })}
        </div>
      </div>

      {/* Added sections: Orders and Wishlist */}
      <div className="grid grid-cols-1 gap-6">
        {/* Orders section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {React.createElement(OrderUserComponent, { userId: user.id })}
        </div>

        {/* Wishlist section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {React.createElement(WishlistComponent, { userId: user.id })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-xl font-semibold">Xác nhận xóa</h3>
            </div>
            
            <p className="mb-6">Bạn có chắc chắn muốn xóa khách hàng <span className="font-semibold">{user.name}</span>? Hành động này không thể hoàn tác.</p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  // Add delete logic here
                  setShowDeleteModal(false);
                }}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;