'use client';
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import ProfileUser from "@/components/profileUser/UserProfileForm";
import MembershipTier from "@/components/membershipTier/membershipTier";
import WishlistPage from "@/components/wishlistPage/WishlistPage";
import OrderUserPage from "@/components/orderUser/OrderUserPage";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Tiêu đề "HỒ SƠ CÁ NHÂN" */}
        <h1 className="text-2xl font-bold mb-4">HỒ SƠ CÁ NHÂN</h1>
        {/* Phần Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Phần thông tin cá nhân */}
          <ProfileUser />
          {/* Phần hạng thành viên */}
          <MembershipTier />
        </div>
        {/* Phần Yêu Thích */}
        <WishlistPage />
        {/* Phần Đơn Hàng */}
        <OrderUserPage />
      </div>
      <Footer />
    </>
  );
}