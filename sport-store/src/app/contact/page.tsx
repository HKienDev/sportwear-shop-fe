'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm text-left cursor-pointer ${
          value ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                option.value === value ? 'bg-[#4EB09D]/10 text-[#4EB09D]' : 'text-gray-700'
              } ${option.value === '' ? 'text-gray-500' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'faq'>('contact');

  useEffect(() => {
    // Inject CSS to fix dropdown alignment
    const style = document.createElement('style');
    style.textContent = `
      select {
        position: relative !important;
        z-index: 10 !important;
      }
      select:focus {
        outline: none !important;
      }
      select option {
        background: white !important;
        color: #374151 !important;
        padding: 12px !important;
      }
      select:focus option:hover {
        background: #f3f4f6 !important;
      }
      /* Fix dropdown alignment */
      select:focus {
        border-color: #4EB09D !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Điện thoại',
      content: '036 770 8888',
      description: 'Hỗ trợ 24/7'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      content: 'khanhhoanshop@gmail.com',
      description: 'Phản hồi trong 24h'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Địa chỉ',
      content: 'Chợ NEO, TDP 3, Phường Yên Dũng, Tỉnh Bắc Ninh, Việt Nam',
      description: 'Trụ sở chính'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Giờ làm việc',
      content: '7:00 - 23:30',
      description: 'Thứ 2 - Chủ nhật'
    }
  ];

  const faqData = [
    {
      question: 'Làm thế nào để đổi trả sản phẩm?',
      answer: 'Bạn có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng. Sản phẩm phải còn nguyên vẹn, chưa sử dụng và có đầy đủ phụ kiện đi kèm.'
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng từ 1-3 ngày làm việc đối với nội thành TP.HCM, 3-5 ngày đối với các tỉnh thành khác. Giao hàng miễn phí cho đơn hàng từ 500.000đ.'
    },
    {
      question: 'Có thể thanh toán bằng những phương thức nào?',
      answer: 'Chúng tôi chấp nhận thanh toán bằng tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ và các ví điện tử phổ biến.'
    },
    {
      question: 'Làm sao để tích điểm thành viên?',
      answer: 'Mỗi đơn hàng bạn sẽ được tích điểm tương ứng với 1-5% giá trị đơn hàng tùy theo hạng thành viên. Điểm tích lũy có thể dùng để giảm giá cho đơn hàng tiếp theo.'
    },
    {
      question: 'Có chính sách bảo hành không?',
      answer: 'Tất cả sản phẩm đều có bảo hành chính hãng từ 6 tháng đến 2 năm tùy theo loại sản phẩm. Chúng tôi hỗ trợ bảo hành tại nhà và gửi trả miễn phí.'
    }
  ];

  const subjectOptions = [
    { value: '', label: 'Chọn chủ đề' },
    { value: 'general', label: 'Thông tin chung' },
    { value: 'order', label: 'Đơn hàng & Giao hàng' },
    { value: 'return', label: 'Đổi trả & Bảo hành' },
    { value: 'technical', label: 'Hỗ trợ kỹ thuật' },
    { value: 'partnership', label: 'Hợp tác kinh doanh' },
    { value: 'other', label: 'Khác' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] rounded-2xl sm:rounded-3xl overflow-hidden relative">
          {/* Luxury Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4EB09D]/20 via-transparent to-[#7C54F3]/20"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl animate-pulse"></div>
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 sm:w-16 h-12 sm:h-16 bg-white/5 rounded-full blur-md sm:blur-lg animate-pulse delay-500"></div>
          
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
            {/* Premium Icon */}
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Liên Hệ Với Chúng Tôi
              </span>
            </h1>
            
            <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
              </p>
            </div>
            
            {/* Premium Decorative Elements */}
            <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/60 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
          <div className="flex border-b border-gray-200 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl overflow-hidden">
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-xs sm:text-sm font-semibold transition-all duration-300 relative group ${
                activeTab === 'contact'
                  ? 'text-[#4EB09D] bg-gradient-to-r from-[#4EB09D]/10 to-[#7C54F3]/10 border-b-2 border-[#4EB09D] shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4EB09D]/5 to-[#7C54F3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === 'contact'
                    ? 'bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-[#4EB09D]/20 group-hover:to-[#7C54F3]/20 group-hover:text-[#4EB09D]'
                }`}>
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="font-medium text-xs sm:text-sm">Gửi Tin Nhắn</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-xs sm:text-sm font-semibold transition-all duration-300 relative group ${
                activeTab === 'faq'
                  ? 'text-[#4EB09D] bg-gradient-to-r from-[#4EB09D]/10 to-[#7C54F3]/10 border-b-2 border-[#4EB09D] shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4EB09D]/5 to-[#7C54F3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === 'faq'
                    ? 'bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-[#4EB09D]/20 group-hover:to-[#7C54F3]/20 group-hover:text-[#4EB09D]'
                }`}>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="font-medium text-xs sm:text-sm">Câu Hỏi Thường Gặp</span>
              </div>
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'contact' ? (
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Contact Form */}
                <div className="relative">
                  {/* Luxury Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4EB09D]/10 via-[#7C54F3]/10 to-[#4EB09D]/5 rounded-2xl sm:rounded-3xl"></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] bg-clip-text text-transparent">
                            Gửi Tin Nhắn Cho Chúng Tôi
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="relative group">
                          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Họ và tên *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="relative z-10 w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                              placeholder="Nhập họ và tên"
                            />
                          </div>
                        </div>
                        <div className="relative group">
                          <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Email *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="relative z-10 w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                              placeholder="example@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="relative group">
                          <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Số điện thoại
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="relative z-10 w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                              placeholder="0123456789"
                            />
                          </div>
                        </div>
                        <div className="relative group">
                          <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Chủ đề *
                          </label>
                          <div className="relative">
                            <CustomSelect
                              value={formData.subject}
                              onChange={handleSubjectChange}
                              options={subjectOptions}
                              placeholder="Chọn chủ đề"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative group">
                        <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                          Nội dung tin nhắn *
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="relative z-10 w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none text-sm sm:text-base"
                            placeholder="Mô tả chi tiết vấn đề của bạn..."
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold hover:from-[#4EB09D]/90 hover:to-[#7C54F3]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:shadow-[#7C54F3]/25 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] rounded-xl sm:rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="relative z-10">Đang gửi...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                            <span className="relative z-10">Gửi Tin Nhắn</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="relative">
                  {/* Luxury Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4EB09D]/10 via-[#7C54F3]/10 to-[#4EB09D]/5 rounded-2xl sm:rounded-3xl"></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] bg-clip-text text-transparent">
                            Thông Tin Liên Hệ
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều kênh khác nhau.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#4EB09D]/10 to-[#7C54F3]/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/60 hover:border-[#4EB09D]/40 transition-all duration-300 hover:shadow-lg">
                            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] text-white rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {info.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{info.title}</h3>
                              <p className="text-gray-700 font-medium text-xs sm:text-sm">{info.content}</p>
                              <p className="text-xs text-gray-500">{info.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Social Media */}
                    <div className="mt-6 sm:mt-8">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Theo Dõi Chúng Tôi</h3>
                      <div className="flex gap-3 sm:gap-4">
                        {[
                          { icon: Facebook, color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                          { icon: Instagram, color: 'bg-pink-600', hover: 'hover:bg-pink-700' },
                          { 
                            icon: null, 
                            text: 'Zi', 
                            color: 'bg-blue-500', 
                            hover: 'hover:bg-blue-600' 
                          }
                        ].map((social, index) => (
                          <a
                            key={index}
                            href="#"
                            className={`p-3 sm:p-4 ${social.color} ${social.hover} text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center`}
                          >
                            {social.icon ? (
                              <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <span className="font-bold text-lg sm:text-xl">{social.text}</span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* FAQ Section */
              <div className="relative">
                {/* Luxury Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#4EB09D]/10 via-[#7C54F3]/10 to-[#4EB09D]/5 rounded-2xl sm:rounded-3xl"></div>
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] bg-clip-text text-transparent">
                          Câu Hỏi Thường Gặp
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Tìm câu trả lời cho những câu hỏi phổ biến nhất của khách hàng.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {faqData.map((faq, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4EB09D]/10 to-[#7C54F3]/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#4EB09D]/30 transition-all duration-300 bg-white/60 backdrop-blur-sm">
                          <details className="group/faq">
                            <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gradient-to-r hover:from-[#4EB09D]/5 hover:to-[#7C54F3]/5 transition-all duration-300">
                              <h3 className="font-semibold text-gray-900 group-open/faq:text-[#4EB09D] transition-colors duration-300 text-sm sm:text-base">
                                {faq.question}
                              </h3>
                              <div className="flex-shrink-0 ml-3 sm:ml-4">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-100 to-gray-200 group-open/faq:from-[#4EB09D] group-open/faq:to-[#7C54F3] rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm group-open/faq:shadow-lg">
                                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 group-open/faq:bg-white rounded-full group-open/faq:rotate-45 transition-all duration-300"></div>
                                </div>
                              </div>
                            </summary>
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                              <div className="pt-3 sm:pt-4 border-t border-gray-100">
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Tìm Chúng Tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Ghé thăm cửa hàng của chúng tôi để trải nghiệm sản phẩm trực tiếp và được tư vấn chuyên nghiệp.
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            {/* Interactive Map Placeholder */}
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden group cursor-pointer">
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-20 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Floating Elements for Map Feel */}
              <div className="absolute top-1/4 left-1/4 w-1 sm:w-2 h-1 sm:h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/3 right-1/3 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-green-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-purple-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* Location Marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Main Marker */}
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 sm:mt-2 bg-white rounded-lg shadow-lg px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Khánh Hoàn Shop</p>
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-lg shadow-lg p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors">
                    <span className="text-sm sm:text-lg font-bold">+</span>
                  </button>
                  <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors">
                    <span className="text-sm sm:text-lg font-bold">−</span>
                  </button>
                </div>
              </div>
              
              {/* Map Info Overlay */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-white/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4EB09D] to-[#7C54F3] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Khánh Hoàn Shop</h3>
                      <p className="text-xs text-gray-600">Chợ NEO, TDP 3, Phường Yên Dũng, Tỉnh Bắc Ninh</p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Chợ+NEO,+TDP+3,+Phường+Yên+Dũng,+Tỉnh+Bắc+Ninh,+Việt+Nam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] text-white rounded-lg font-medium hover:from-[#4EB09D]/90 hover:to-[#7C54F3]/90 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  >
                    Mở Bản Đồ
                  </a>
                </div>
              </div>
              
              {/* Click to Open Map Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Click để mở Google Maps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 