'use client';

import React from 'react';
import ChatManagerAdmin from '@/components/common/chat/ChatManagerAdmin/ChatManagerAdmin';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Chat</h1>
        <p className="text-gray-600 mt-2">
          Quản lý và trả lời tin nhắn từ khách hàng
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ChatManagerAdmin />
      </div>
    </div>
  );
} 