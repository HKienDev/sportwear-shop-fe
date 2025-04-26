import { useEffect } from 'react';
import { useAuth } from '@/context/authContext';

export const useAuthState = () => {
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        console.log("🔄 Component auth state updated:", {
            timestamp: new Date().toISOString(),
            hasUser: !!user,
            userData: user,
            isAuthenticated,
            loading
        });
    }, [user, isAuthenticated, loading]);

    return { user, isAuthenticated, loading };
}; 