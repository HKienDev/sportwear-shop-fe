import { Calendar, Tag, CheckCircle, AlertCircle, CreditCard, Package, Award } from 'lucide-react';

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
    <div className="bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-md overflow-hidden mb-6 border border-blue-100 transition-all duration-300 hover:shadow-blue-200/50 hover:shadow-lg">
      <div className="relative bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-white text-sky-600 h-10 w-10 rounded-full shadow-sm">
                <Award className="w-5 h-5" />
              </span>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white">ĐƠN HÀNG</h1>
                <div className="flex items-center text-teal-100 text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  <span>#{shortId}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/80">Chi tiết đơn hàng của khách hàng</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/20">
              <div className="font-semibold text-lg">#{customerId}</div>
              <div className="flex items-center mt-1 text-xs text-white/80">
        
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-4 py-2 rounded-full font-medium text-sm ring-1 ring-inset ${statusStyle.ringColor}`}>
            {statusStyle.icon}
            <span>{status}</span>
          </div>
          
          <div className={`flex items-center gap-2 ${paymentStatusStyle.bg} ${paymentStatusStyle.text} px-4 py-2 rounded-full font-medium text-sm ring-1 ring-inset ${paymentStatusStyle.ringColor}`}>
            {paymentStatusStyle.icon}
            <span>{paymentStatus}</span>
          </div>
          
          <div className="ml-auto flex items-center text-slate-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-sky-500" />
            <span className="mr-2">Cập nhật:</span>
            <span className="font-medium">{lastUpdated}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-500"></div>
              <span className="text-sm text-sky-700 font-medium">Thông tin đơn hàng</span>
            </div>
            <div className="text-xs text-slate-500">
              Mã đơn: <span className="font-medium text-slate-700">{shortId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}