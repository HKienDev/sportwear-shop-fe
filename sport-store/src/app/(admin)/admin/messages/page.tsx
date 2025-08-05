'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Users, Clock, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { adminMessageService, MessageStats } from '@/services/adminMessageService';
import ChatManagerAdmin from '@/components/common/chat/ChatManagerAdmin/ChatManagerAdmin';

export default function MessagesPage() {
  const [stats, setStats] = useState<MessageStats>({
    totalMessages: 0,
    pendingMessages: 0,
    repliedMessages: 0,
    completedMessages: 0,
    totalConversations: 0,
    activeConversations: 0,
    averageResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch message stats
  const fetchStats = useCallback(async () => {
    if (hasLoaded) return; // Tránh duplicate calls
    
    try {
      setIsLoading(true);
      console.log('🔍 MessagesPage - Fetching message stats...');
      
      const response = await adminMessageService.getMessageStats();
      console.log('🔍 MessagesPage - Stats response:', response);
      
      if (response.success) {
        setStats(response.data);
        setHasLoaded(true);
        console.log('🔍 MessagesPage - Stats set:', response.data);
      } else {
        console.error('🔍 MessagesPage - Response not successful:', response);
        toast.error(response.message || "Lỗi khi tải thống kê tin nhắn");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê tin nhắn:", error);
      toast.error("Có lỗi xảy ra khi lấy thống kê tin nhắn");
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded]);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản lý tin nhắn
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Hỗ trợ và tương tác với khách hàng qua chat với giao diện hiện đại
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="relative">
          {/* Glass Morphism Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          
          {/* Main Container */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Search Section */}
              <div className="flex-1 w-full lg:max-w-xl group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên khách hàng, nội dung tin nhắn..."
                    className="block w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-300 border-slate-200 hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Filters & Actions Section */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Status Filter */}
                <div className="relative w-full sm:w-72 group">
                  <select
                    className="block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Đang chờ</option>
                    <option value="replied">Đã trả lời</option>
                    <option value="closed">Đã đóng</option>
                  </select>
                </div>

                {/* Add Conversation Button */}
                <button className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Tạo cuộc trò chuyện mới
                </button>
              </div>
            </div>
          </div>
        </div>

                 {/* Statistics Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
             <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-600 mb-1">Tổng Tin Nhắn</p>
                   <p className="text-3xl font-bold text-slate-800">
                     {isLoading ? '...' : stats.totalMessages.toLocaleString()}
                   </p>
                 </div>
                 <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
                   <MessageSquare size={24} className="text-white" />
                 </div>
               </div>
             </div>
           </div>

           <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
             <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-600 mb-1">Chờ Xử Lý</p>
                   <p className="text-3xl font-bold text-slate-800">
                     {isLoading ? '...' : stats.pendingMessages.toLocaleString()}
                   </p>
                 </div>
                 <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                   <Users size={24} className="text-white" />
                 </div>
               </div>
             </div>
           </div>

           <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
             <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-600 mb-1">Đang Trả Lời</p>
                   <p className="text-3xl font-bold text-slate-800">
                     {isLoading ? '...' : stats.repliedMessages.toLocaleString()}
                   </p>
                 </div>
                 <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                   <Clock size={24} className="text-white" />
                 </div>
               </div>
             </div>
           </div>

           <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
             <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-slate-600 mb-1">Đã Hoàn Thành</p>
                   <p className="text-3xl font-bold text-slate-800">
                     {isLoading ? '...' : stats.completedMessages.toLocaleString()}
                   </p>
                 </div>
                 <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                   <TrendingUp size={24} className="text-white" />
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* Chat Manager */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl overflow-hidden h-[calc(100vh-400px)] min-h-[700px]">
          <ChatManagerAdmin />
        </div>
      </div>
    </div>
  );
} 