"use client";

import React, { memo } from "react";
import { AuthProvider } from "../context/authContext";
import { AuthModalProvider } from "../context/authModalContext";
import { CustomerProvider } from "../context/customerContext";
import { PaymentMethodProvider } from "../context/paymentMethodContext";
import { ShippingMethodProvider } from "../context/shippingMethodContext";
import { PromoProvider } from "../context/promoContext";
import { CartProvider } from "../context/cartContext";
import TokenManager from "../components/TokenManagerFixed";
import { AuthModal } from "../components/ui/AuthModal";
import { useAuthModal } from "../context/authModalContext";
import { setAuthModalInstance } from "../utils/authRedirect";

// Component để render AuthModal
const AuthModalWrapper = () => {
  const { isModalOpen, closeModal, pendingAction, openModal } = useAuthModal();
  
  // Set auth modal instance cho global use
  React.useEffect(() => {
    setAuthModalInstance({ openModal, closeModal, isModalOpen: false, pendingAction: null, setPendingAction: () => {}, executePendingAction: () => {} });
  }, [openModal, closeModal]);
  
  const getModalConfig = () => {
    if (!pendingAction) return {};
    
    const configs = {
      addToCart: {
        title: 'Đăng nhập để thêm vào giỏ hàng',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
      },
      buyNow: {
        title: 'Đăng nhập để mua hàng',
        description: 'Vui lòng đăng nhập để tiếp tục mua hàng'
      },
      addToFavorites: {
        title: 'Đăng nhập để thêm vào yêu thích',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích'
      },
      checkout: {
        title: 'Đăng nhập để thanh toán',
        description: 'Vui lòng đăng nhập để tiếp tục thanh toán'
      },
      viewCart: {
        title: 'Đăng nhập để xem giỏ hàng',
        description: 'Vui lòng đăng nhập để xem giỏ hàng của bạn'
      }
    };
    
    return configs[pendingAction.type] || {};
  };

  return (
    <AuthModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onSuccess={() => {
        // Execute pending action after successful login
        if (pendingAction?.callback) {
          pendingAction.callback();
        }
      }}
      {...getModalConfig()}
    />
  );
};

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = memo(function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <TokenManager>
          <CustomerProvider>
            <PaymentMethodProvider>
              <ShippingMethodProvider>
                <PromoProvider>
                  <CartProvider>
                    {children}
                    <AuthModalWrapper />
                  </CartProvider>
                </PromoProvider>
              </ShippingMethodProvider>
            </PaymentMethodProvider>
          </CustomerProvider>
        </TokenManager>
      </AuthModalProvider>
    </AuthProvider>
  );
});

export { Providers }; 