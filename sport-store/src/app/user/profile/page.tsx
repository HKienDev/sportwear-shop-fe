'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import ProfileUser from "@/components/user/profileUser/userProfileForm";
import OrderUserPage from "@/components/user/orderUser/orderUserPage";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

function ProfilePageContent() {
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const completeParam = searchParams.get('complete');
  const [activeTab, setActiveTab] = useState(tabParam === 'orders' ? 'orders' : 'profile');
  const router = useRouter();
  const { user, loading } = useAuth();

  // Handle scroll effect for the sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === 'orders') {
      setActiveTab('orders');
    }
  }, [tabParam]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/auth/login');
      else if (user.role === 'admin') router.replace('/admin/dashboard');
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Blue Accent */}
      <div className={`sticky top-0 z-10 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "py-4"
      }`}>
        {/* Header content can be added here */}
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-16">
        {/* Profile Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-64 h-24 sm:h-32 md:h-64 bg-white opacity-5 rounded-full -mr-8 sm:-mr-10 md:-mr-20 -mt-8 sm:-mt-10 md:-mt-20"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 bg-black opacity-10 rounded-full -ml-4 sm:-ml-5 md:-ml-10 -mb-4 sm:-mb-5 md:-mb-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 md:gap-0">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">Quản lý thông tin cá nhân</h2>
              <p className="mt-1 sm:mt-2 text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed">Cập nhật thông tin và kiểm tra đơn hàng của bạn</p>
            </div>
            
            {/* User Avatar - Optional */}
            <div className="mt-2 md:mt-0 flex justify-start md:justify-end">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center border-2 sm:border-3 md:border-4 border-blue-300 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto flex-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`py-2 sm:py-3 px-3 sm:px-4 md:px-6 font-medium text-xs sm:text-sm transition-colors focus:outline-none whitespace-nowrap flex-shrink-0 ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-1 sm:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Thông tin cá nhân</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-2 sm:py-3 px-3 sm:px-4 md:px-6 font-medium text-xs sm:text-sm transition-colors focus:outline-none whitespace-nowrap flex-shrink-0 ${
              activeTab === 'orders' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-1 sm:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Lịch sử đơn hàng</span>
            </div>
          </button>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-t-4 border-blue-600 transform transition hover:shadow-xl h-full">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-1 sm:p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7z" />
                </svg>
              </div>
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 ml-2 sm:ml-3">Thông tin cá nhân</h2>
            </div>
            
            {/* Special notification for completing profile */}
            {completeParam === 'true' && (
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border-l-4 border-yellow-500">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-2 sm:ml-3">
                    <h3 className="text-xs sm:text-sm font-medium text-yellow-800">Hoàn thiện thông tin cá nhân</h3>
                    <p className="mt-1 text-xs sm:text-sm text-yellow-700 leading-relaxed">
                      Chào mừng bạn đến với Sport Store! Vui lòng hoàn thiện thông tin cá nhân để có thể sử dụng đầy đủ các tính năng của hệ thống.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border-l-4 border-blue-500">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Cập nhật thông tin cá nhân của bạn để trải nghiệm mua sắm thuận tiện hơn. Thông tin của bạn sẽ được bảo mật an toàn.
                </p>
              </div>
            </div>
            
            <ProfileUser />
          
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-t-4 border-blue-600 transform transition hover:shadow-xl">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-1 sm:p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 ml-2 sm:ml-3">Lịch sử đơn hàng</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border-l-4 border-blue-500">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Theo dõi và quản lý các đơn hàng của bạn. Bạn có thể kiểm tra trạng thái, theo dõi đơn hàng và xem lịch sử mua sắm.
                </p>
              </div>
            </div>
            
            <OrderUserPage />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}