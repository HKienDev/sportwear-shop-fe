interface HeaderProps {
  onDelete: () => void;
  onChangePassword: () => void;
  onUpdate: () => void;
}

export default function Header({ onDelete, onChangePassword, onUpdate }: HeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-neutral-800">CHI TIẾT KHÁCH HÀNG</h1>
      <div className="flex gap-4">
        <button 
          onClick={onDelete}
          className="px-4 py-2.5 border border-rose-500 text-rose-500 rounded-md hover:bg-rose-50 transition-colors duration-200 flex items-center gap-2"
        >
          <span>🗑️</span> Xóa Khách Hàng
        </button>
        <button 
          onClick={onChangePassword}
          className="px-4 py-2.5 border border-neutral-400 text-neutral-600 rounded-md hover:bg-neutral-100 transition-colors duration-200 flex items-center gap-2"
        >
          <span>🔑</span> Thay Đổi Mật Khẩu
        </button>
        <button 
          onClick={onUpdate}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          Cập Nhật
        </button>
      </div>
    </div>
  );
} 