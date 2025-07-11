import { useState, useEffect } from 'react';
import { Trash2, Key, Save, ArrowLeft, User } from 'lucide-react';

interface HeaderProps {
  onDelete: () => void;
  onResetPassword: () => void;
  onUpdate: () => void;
}

export default function Header({ onDelete, onResetPassword, onUpdate }: HeaderProps) {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  return (
    <div className="mb-8">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"></div>
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-60"></div>
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full opacity-40"></div>
        
        {/* Main Content */}
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 lg:p-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2 py-1 rounded-full">
                  Quản lý khách hàng
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                Chi tiết khách hàng
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Xem và chỉnh sửa thông tin chi tiết của khách hàng
              </p>
            </div>
          </div>
          
          {/* Control Panel */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            {/* Secondary Actions */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-200">
              {/* Delete Button */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveControl('delete')}
                onMouseLeave={() => setActiveControl(null)}
              >
                <button
                  onClick={onDelete}
                  className="relative z-10 h-full px-4 py-2.5 text-slate-600 rounded-lg hover:text-rose-600 transition-all duration-300 flex items-center gap-2 group"
                  aria-label="Xóa khách hàng"
                >
                  <Trash2 size={18} className="relative z-10 transition-all duration-300" />
                  <span className="relative z-10 hidden sm:block font-medium whitespace-nowrap text-sm">Xóa</span>
                </button>
                {activeControl === 'delete' && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rose-500 animate-pulse"></span>
                )}
              </div>
              
              {/* Separator */}
              <div className="h-8 w-px bg-slate-300"></div>
              
              {/* Reset Password Button */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveControl('reset')}
                onMouseLeave={() => setActiveControl(null)}
              >
                <button
                  onClick={onResetPassword}
                  className="relative z-10 h-full px-4 py-2.5 text-slate-600 rounded-lg hover:text-amber-600 transition-all duration-300 flex items-center gap-2 group"
                  aria-label="Thay đổi mật khẩu"
                >
                  <Key size={18} className="relative z-10 transition-all duration-300" />
                  <span className="relative z-10 hidden sm:block font-medium whitespace-nowrap text-sm">Mật khẩu</span>
                </button>
                {activeControl === 'reset' && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 animate-pulse"></span>
                )}
              </div>
            </div>
            
            {/* Primary Action - Update Button */}
            <div className="relative">
              <button
                onClick={onUpdate}
                className="relative h-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg group font-medium"
              >
                <Save size={18} className="transition-all duration-300 group-hover:rotate-12" />
                <span className="whitespace-nowrap text-sm">Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}