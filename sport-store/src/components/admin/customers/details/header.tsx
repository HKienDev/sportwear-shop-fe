import { useState, useEffect } from 'react';
import { Trash2, Key, Save } from 'lucide-react';

interface HeaderProps {
  onDelete: () => void;
  onResetPassword: () => void;
  onUpdate: () => void;
}

export default function Header({ onDelete, onResetPassword, onUpdate }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);
  
  // Hiệu ứng particle nhỏ khi hover vào nút cập nhật
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);
  
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setParticles(prev => {
          // Thêm particle mới
          const newParticle = {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 60,
            size: Math.random() * 5 + 1,
            opacity: 0.8
          };
          
          // Cập nhật và lọc các particle cũ
          const updatedParticles = prev
            .map(p => ({...p, opacity: p.opacity - 0.05, size: p.size - 0.1}))
            .filter(p => p.opacity > 0 && p.size > 0);
            
          return [...updatedParticles, newParticle].slice(-15); // Giới hạn số particles
        });
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  return (
    <div className="mb-8 pt-2">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl shadow-lg border border-neutral-200">
        {/* Background Elements */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-100 rounded-full opacity-60"></div>
        <div className="absolute left-1/2 bottom-0 w-64 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        
        {/* Main Content */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-indigo-600 tracking-widest mb-1 uppercase"></span>
            <h1 className="text-3xl font-bold text-neutral-800">
              CHI TIẾT <span className="relative inline-block">
                KHÁCH HÀNG
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom-left"></span>
              </span>
            </h1>
          </div>
          
          {/* Control Panel */}
          <div className="flex items-center justify-end w-full md:w-auto">
            <div className="relative bg-white p-1 rounded-xl shadow-sm border border-neutral-200 flex items-stretch">
              {/* Delete Button */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveControl('delete')}
                onMouseLeave={() => setActiveControl(null)}
              >
                <button
                  onClick={onDelete}
                  className="relative z-10 h-full px-4 py-2.5 text-neutral-600 rounded-lg hover:text-rose-600 transition-all duration-300 flex items-center gap-2 group"
                  aria-label="Xóa khách hàng"
                >
                  <span className="absolute inset-0 bg-rose-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></span>
                  <Trash2 size={18} className="relative z-10 transition-all duration-300" />
                  <span className="relative z-10 hidden md:block font-medium whitespace-nowrap">Xóa Khách Hàng</span>
                </button>
                {activeControl === 'delete' && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rose-500 animate-pulse"></span>
                )}
              </div>
              
              {/* Separator */}
              <div className="h-auto w-px bg-neutral-200 mx-1"></div>
              
              {/* Reset Password Button */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveControl('reset')}
                onMouseLeave={() => setActiveControl(null)}
              >
                <button
                  onClick={onResetPassword}
                  className="relative z-10 h-full px-4 py-2.5 text-neutral-600 rounded-lg hover:text-amber-600 transition-all duration-300 flex items-center gap-2 group"
                  aria-label="Thay đổi mật khẩu"
                >
                  <span className="absolute inset-0 bg-amber-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></span>
                  <Key size={18} className="relative z-10 transition-all duration-300" />
                  <span className="relative z-10 hidden md:block font-medium whitespace-nowrap">Thay Đổi Mật Khẩu</span>
                </button>
                {activeControl === 'reset' && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 animate-pulse"></span>
                )}
              </div>
            </div>
            
            {/* Update Button - Separated for emphasis */}
            <div 
              className="relative ml-3" 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button
                onClick={onUpdate}
                className="relative overflow-hidden px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md group"
              >
                {/* Particle Animation Container */}
                <div className="absolute inset-0 overflow-hidden">
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute bg-white rounded-full"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                      }}
                    />
                  ))}
                </div>
                <Save size={18} className="relative z-10 transition-all duration-300 group-hover:rotate-12" />
                <span className="relative z-10 font-medium">Cập Nhật</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}