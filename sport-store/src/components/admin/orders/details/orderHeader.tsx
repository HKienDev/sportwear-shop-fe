import { Calendar, Tag, CheckCircle, AlertCircle, CreditCard, Package, Award, User, Clock } from 'lucide-react';

interface OrderHeaderProps {
  shortId: string;
  customerId: string;
  lastUpdated: string;
  status: string;
  paymentStatus: string;
}

export default function OrderHeader({
  shortId,
  customerId,
  lastUpdated,
  status,
  paymentStatus,
}: OrderHeaderProps) {
  
  // Xác định màu sắc dựa trên trạng thái
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case "đang xử lý":
        return {
          bg: "bg-cyan-100",
          text: "text-cyan-700",
          icon: <Package className="w-4 h-4" />,
          ringColor: "ring-cyan-400"
        };
      case "đã hoàn thành":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          icon: <CheckCircle className="w-4 h-4" />,
          ringColor: "ring-emerald-400"
        };
      case "đã huỷ":
        return {
          bg: "bg-rose-100",
          text: "text-rose-700",
          icon: <AlertCircle className="w-4 h-4" />,
          ringColor: "ring-rose-400"
        };
      default:
        return {
          bg: "bg-sky-100",
          text: "text-sky-700",
          icon: <Package className="w-4 h-4" />,
          ringColor: "ring-sky-400"
        };
    }
  };
  
  const getPaymentStatusColor = () => {
    switch(paymentStatus.toLowerCase()) {
      case "đã thanh toán":
        return {
          bg: "bg-teal-100",
          text: "text-teal-700",
          icon: <CheckCircle className="w-4 h-4" />,
          ringColor: "ring-teal-400"
        };
      case "chưa thanh toán":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: <CreditCard className="w-4 h-4" />,
          ringColor: "ring-amber-400"
        };
      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          icon: <CreditCard className="w-4 h-4" />,
          ringColor: "ring-slate-400"
        };
    }
  };
  
  const statusStyle = getStatusColor();
  const paymentStatusStyle = getPaymentStatusColor();

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-lg overflow-hidden border border-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 relative z-10">
          {/* Left Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white h-12 w-12 rounded-xl shadow-lg border border-white/20">
                <Award className="w-6 h-6" />
              </span>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Chi Tiết Đơn Hàng</h1>
                <div className="flex items-center text-blue-100 text-sm sm:text-base">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="font-medium">#{shortId}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/90 max-w-md">Quản lý và theo dõi trạng thái đơn hàng của khách hàng</p>
          </div>
          
          {/* Right Section - Customer Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-white border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs text-white/80">Khách hàng</span>
              </div>
              <div className="font-bold text-lg">#{customerId}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className={`flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-3 sm:px-4 py-2 rounded-full font-medium text-sm ring-1 ring-inset ${statusStyle.ringColor} transition-all duration-200 hover:scale-105`}>
              {statusStyle.icon}
              <span>{status}</span>
            </div>
            
            <div className={`flex items-center gap-2 ${paymentStatusStyle.bg} ${paymentStatusStyle.text} px-3 sm:px-4 py-2 rounded-full font-medium text-sm ring-1 ring-inset ${paymentStatusStyle.ringColor} transition-all duration-200 hover:scale-105`}>
              {paymentStatusStyle.icon}
              <span>{paymentStatus}</span>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="ml-auto flex items-center text-slate-600 text-sm bg-slate-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 mr-2 text-sky-500" />
            <span className="hidden sm:inline mr-2">Cập nhật:</span>
            <span className="font-medium">{lastUpdated}</span>
          </div>
        </div>
        
        {/* Order Info Footer */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 animate-pulse"></div>
              <span className="text-sm text-slate-700 font-medium">Thông tin đơn hàng</span>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
              Mã đơn: <span className="font-semibold text-slate-700">{shortId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}