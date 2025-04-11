import React from 'react';

interface OtpModalProps {
  show: boolean;
  otpInput: string;
  onClose: () => void;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  show,
  otpInput,
  onClose,
  onOtpChange,
  onVerify,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Xác thực OTP</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">Vui lòng nhập mã OTP đã được gửi đến email của bạn</p>
        <input
          type="text"
          value={otpInput}
          onChange={(e) => onOtpChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
          placeholder="Nhập mã OTP"
        />
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onVerify}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal; 