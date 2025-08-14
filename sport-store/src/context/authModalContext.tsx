"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthModalContextType {
  isModalOpen: boolean;
  openModal: (options?: AuthModalOptions) => void;
  closeModal: () => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  executePendingAction: () => void;
}

interface AuthModalOptions {
  title?: string;
  description?: string;
  defaultMode?: 'login' | 'register';
  pendingAction?: PendingAction;
}

interface PendingAction {
  type: 'addToCart' | 'buyNow' | 'addToFavorites' | 'addToWishlist' | 'checkout' | 'viewCart';
  data?: any;
  callback?: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const openModal = useCallback((options: AuthModalOptions = {}) => {
    if (options.pendingAction) {
      setPendingAction(options.pendingAction);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const executePendingAction = useCallback(() => {
    if (pendingAction?.callback) {
      pendingAction.callback();
    }
    setPendingAction(null);
  }, [pendingAction]);

  const value: AuthModalContextType = {
    isModalOpen,
    openModal,
    closeModal,
    pendingAction,
    setPendingAction,
    executePendingAction,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}; 