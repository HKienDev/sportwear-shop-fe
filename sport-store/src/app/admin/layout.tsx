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
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
