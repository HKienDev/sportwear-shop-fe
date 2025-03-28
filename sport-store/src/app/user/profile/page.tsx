'use client';
import ProfileUser from "@/components/user/profileUser/userProfileForm";
import MembershipTier from "@/components/admin/customers/details/membershipTier";
import WishlistPage from "@/components/user/wishlistPage/wishlistPage";
import OrderUserPage from "@/components/user/orderUser/orderUserPage";

export default function ProfilePage() {
  return (
    <>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Tiêu đề "HỒ SƠ CÁ NHÂN" */}
        <h1 className="text-2xl font-bold mb-4">HỒ SƠ CÁ NHÂN</h1>
        {/* Phần Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Phần thông tin cá nhân */}
          <ProfileUser />
          {/* Phần hạng thành viên */}
          <MembershipTier currentSpent={500000} nextTierThreshold={1000000} />
        </div>
        {/* Phần Yêu Thích */}
        <WishlistPage />
        {/* Phần Đơn Hàng */}
        <OrderUserPage />
      </div>
    </>
  );
}