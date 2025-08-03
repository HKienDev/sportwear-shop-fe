import { useAuthModal } from '@/context/authModalContext';

// Global auth modal instance (sẽ được set từ component)
let authModalInstance: ReturnType<typeof useAuthModal> | null = null;

export const setAuthModalInstance = (instance: ReturnType<typeof useAuthModal>) => {
  authModalInstance = instance;
};

export const handleAuthRedirect = (action?: string, data?: any) => {
  // Nếu có auth modal instance, mở modal thay vì redirect
  if (authModalInstance) {
    const configs = {
      'addToCart': {
        title: 'Đăng nhập để thêm vào giỏ hàng',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
      },
      'buyNow': {
        title: 'Đăng nhập để mua hàng',
        description: 'Vui lòng đăng nhập để tiếp tục mua hàng'
      },
      'addToFavorites': {
        title: 'Đăng nhập để thêm vào yêu thích',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích'
      },
      'viewCart': {
        title: 'Đăng nhập để xem giỏ hàng',
        description: 'Vui lòng đăng nhập để xem giỏ hàng của bạn'
      },
      'checkout': {
        title: 'Đăng nhập để thanh toán',
        description: 'Vui lòng đăng nhập để tiếp tục thanh toán'
      },
      'default': {
        title: 'Đăng nhập để tiếp tục',
        description: 'Vui lòng đăng nhập để sử dụng tính năng này'
      }
    };

    const config = configs[action as keyof typeof configs] || configs.default;
    
    authModalInstance.openModal({
      ...config,
      pendingAction: {
        type: action as any,
        data,
        callback: () => {
          // Thực hiện lại action sau khi đăng nhập
          if (action && data) {
            // Có thể thêm logic thực hiện lại action ở đây
          }
        }
      }
    });
    return true; // Đã xử lý bằng modal
  }

  // Fallback: redirect về login nếu không có modal
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
  return false;
};

// Kiểm tra xem có nên redirect hay không
export const shouldRedirectToLogin = (currentPath: string): boolean => {
  // Các trang cần bảo vệ - luôn redirect về login
  const protectedRoutes = [
    '/admin',
    '/user/profile',
    '/user/checkout',
    '/user/orders'
  ];

  // Các trang cho phép khách vãng lai - không redirect
  const publicRoutes = [
    '/',
    '/user',
    '/user/products',
    '/auth/login',
    '/auth/register'
  ];

  // Nếu đang ở trang cần bảo vệ, redirect
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    return true;
  }

  // Nếu đang ở trang public, không redirect
  if (publicRoutes.some(route => currentPath.startsWith(route))) {
    return false;
  }

  // Mặc định: không redirect cho khách vãng lai
  return false;
}; 