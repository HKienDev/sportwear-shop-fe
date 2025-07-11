import { useState } from "react";
import { Key, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  customerName: string;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  customerName,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 ký tự viết hoa");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 ký tự viết thường");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 số");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");
    }
    return errors.join(", ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    onSubmit(password);
    setPassword("");
    setConfirmPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Thay đổi mật khẩu
                </h2>
                <p className="text-sm text-slate-600">
                  Cập nhật mật khẩu cho khách hàng
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Đang thay đổi mật khẩu cho:</h4>
                <p className="text-blue-700 font-semibold">{customerName}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pr-12 transition-all duration-200"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pr-12 transition-all duration-200"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                  </div>
                  <p className="text-rose-700 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 