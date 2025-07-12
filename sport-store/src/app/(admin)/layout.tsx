"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { ROUTES } from '@/config/constants';
import Sidebar from '@/components/admin/adminLayout/sidebar';
import Footer from '@/components/admin/adminLayout/footer';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, checkAuthStatus } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile

    // Kiểm tra xem có đang ở messages page không
    const isMessagesPage = pathname === '/admin/messages';
    
    console.log('🔍 AdminLayout - Current pathname:', pathname);
    console.log('🔍 AdminLayout - isMessagesPage:', isMessagesPage);

    useEffect(() => {
        const verifyAuth = async () => {
            console.log('🔍 AdminLayout - Checking auth status...');
            await checkAuthStatus();
            
            // Đợi một chút để đảm bảo auth state đã được cập nhật
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };
        
        verifyAuth();
    }, [checkAuthStatus]);

    useEffect(() => {
        // Chỉ redirect khi không còn loading và user không phải admin
        if (!isLoading && !loading && (!user || user.role !== 'admin')) {
            console.log('❌ AdminLayout - User not admin, redirecting to login');
            router.replace(ROUTES.LOGIN);
        }
    }, [isLoading, loading, user, router]);

    // Auto-close sidebar on route change on mobile
    useEffect(() => {
        // Close sidebar on mobile when pathname changes
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        // Set initial state based on screen size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hiển thị loading khi đang kiểm tra auth
    if (isLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="h-[clamp(3rem,6vw,6rem)] w-[clamp(3rem,6vw,6rem)] animate-spin rounded-full border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    // Không hiển thị gì nếu user không phải admin (sẽ redirect)
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Header with Menu Button */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Sidebar - Fixed with responsive behavior */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 w-[280px]`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${
                isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'
            }`}>
                {/* Main Content Area */}
                <main className="flex-1 pt-[clamp(4rem,8vw,5rem)] pb-[clamp(2rem,4vw,3rem)] px-[clamp(0.75rem,3vw,1rem)] sm:px-[clamp(1rem,4vw,1.5rem)] lg:px-[clamp(1.5rem,5vw,2rem)] lg:pt-[clamp(2rem,4vw,3rem)]">
                    <div className="mx-auto max-w-[clamp(640px,95vw,1400px)]">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
