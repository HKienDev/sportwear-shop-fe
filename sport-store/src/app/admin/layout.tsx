"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { ROUTES } from '@/config/constants';
import Sidebar from '@/components/admin/adminLayout/sidebar';
import Topbar from '@/components/admin/adminLayout/topbar';
import Footer from '@/components/admin/adminLayout/footer';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading, checkAuthStatus } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuthStatus();
                
                if (!loading && !user) {
                    console.log('❌ Chưa đăng nhập, chuyển hướng về trang login');
                    router.replace(ROUTES.LOGIN);
                    return;
                }

                if (user && user.role !== 'admin') {
                    console.log('❌ Không phải admin, chuyển hướng về trang chủ');
                    router.replace(ROUTES.HOME);
                    return;
                }
            } catch (error) {
                console.error('❌ Lỗi khi verify auth:', error);
                router.replace(ROUTES.LOGIN);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [user, loading, router, checkAuthStatus]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static lg:inset-0`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${
                isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
            }`}>
                {/* Topbar */}
                <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Main Content Area */}
                <main className="flex-1 pt-14 pb-16">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
