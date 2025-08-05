'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  ShoppingBag,
  User,
  Calendar,
  ThumbsUp,
  AlertCircle,
  Sparkles,
  X,
  Target,
  HelpCircle,
  Clock,
  CheckSquare
} from 'lucide-react';
import { 
  getAdminQuestions, 
  answerQuestion,
  verifyQuestion,
  deleteQuestion
} from '../../../services/adminQuestionService';
import type { AdminQuestion, AdminQuestionResponse, AnswerQuestionData } from '../../../types/api';
import Pagination from '../categories/list/pagination';

interface AdminQuestionsProps {
  onQuestionUpdate?: () => void;
}

const AdminQuestions: React.FC<AdminQuestionsProps> = ({ onQuestionUpdate }) => {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    productSku: '',
    userId: ''
  });
  const [selectedQuestion, setSelectedQuestion] = useState<AdminQuestion | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminQuestions({
        page: currentPage,
        limit: 3,
        ...filters
      }) as AdminQuestionResponse;

      if (response.success) {
        setQuestions(response.data.questions);
        setTotalPages(response.data.pagination.totalPages);
        setTotalQuestions(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions();
  };

  const handleAnswer = async () => {
    if (!selectedQuestion) return;
    
    const trimmedAnswer = answerText.trim();
    if (!trimmedAnswer) {
      toast.error('Vui lòng nhập nội dung trả lời');
      return;
    }
    
    if (!trimmedAnswer) {
      toast.error('Nội dung trả lời không được để trống');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await answerQuestion(selectedQuestion._id, {
        answer: trimmedAnswer
      } as AnswerQuestionData);

      if (response.success) {
        toast.success('Trả lời câu hỏi thành công');
        setShowAnswerModal(false);
        setAnswerText('');
        setSelectedQuestion(null);
        fetchQuestions();
        onQuestionUpdate?.();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi trả lời câu hỏi');
      }
    } catch (error) {
      console.error('Error answering question:', error);
      toast.error('Có lỗi xảy ra khi trả lời câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (questionId: string) => {
    try {
      const response = await verifyQuestion(questionId);
      if (response.success) {
        toast.success('Xác minh mua hàng thành công');
        fetchQuestions();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi xác minh');
      }
    } catch (error) {
      console.error('Error verifying question:', error);
      toast.error('Có lỗi xảy ra khi xác minh');
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;

    try {
      const response = await deleteQuestion(questionId);
      if (response.success) {
        toast.success('Xóa câu hỏi thành công');
        fetchQuestions();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi xóa câu hỏi');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Có lỗi xảy ra khi xóa câu hỏi');
    }
  };

  const openAnswerModal = (question: AdminQuestion) => {
    setSelectedQuestion(question);
    setAnswerText(question.answer || '');
    setShowAnswerModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã hiển thị
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã hiển thị
          </span>
        );
    }
  };

  // Calculate stats
  const answeredQuestions = questions.filter(q => q.answer).length;
  const unansweredQuestions = questions.filter(q => !q.answer).length;
  const verifiedQuestions = questions.filter(q => q.isVerified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản Lý Hỏi & Đáp
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Quản lý và trả lời các câu hỏi của khách hàng với giao diện hiện đại
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Questions */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tổng Câu Hỏi</p>
                <p className="text-3xl font-bold text-slate-900">{totalQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Answered Questions */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đã Trả Lời</p>
                <p className="text-3xl font-bold text-slate-900">{answeredQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Unanswered Questions */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-orange-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Chưa Trả Lời</p>
                <p className="text-3xl font-bold text-slate-900">{unansweredQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Verified Questions */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100/60 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Đã Xác Minh</p>
                <p className="text-3xl font-bold text-slate-900">{verifiedQuestions}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative mb-8">
          {/* Glass Morphism Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          
          {/* Main Container */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="relative group">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="answered">Đã trả lời</option>
                  <option value="unanswered">Chưa trả lời</option>
                </select>
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>

              {/* Product SKU Filter */}
              <div className="relative group">
                <input
                  type="text"
                  value={filters.productSku}
                  onChange={(e) => handleFilterChange('productSku', e.target.value)}
                  placeholder="SKU sản phẩm..."
                  className="block w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-300 border-slate-200 hover:border-slate-300"
                />
                <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>

              {/* User ID Filter */}
              <div className="relative group">
                <input
                  type="text"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  placeholder="ID người dùng..."
                  className="block w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all duration-300 border-slate-200 hover:border-slate-300"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="group relative inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transform hover:scale-105"
              >
                <Search size={20} className="mr-2 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                Tìm Kiếm
                <Sparkles size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="relative rounded-2xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="loading-animation mb-6">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">Đang tải dữ liệu...</p>
              <p className="text-slate-500 text-center max-w-sm">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">Không có câu hỏi nào</p>
              <p className="text-slate-500 text-sm mt-2">Chưa có câu hỏi nào được gửi đến hệ thống</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question._id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Question Header */}
                  <div className="p-6 border-b border-slate-200/60">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">
                              {question.user.fullname}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(question.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(question.status)}
                        {question.isVerified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Đã mua
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!question.answer ? (
                          <button
                            onClick={() => openAnswerModal(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Trả lời"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openAnswerModal(question)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Chỉnh sửa trả lời"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {question.orderShortId && !question.isVerified && (
                          <button
                            onClick={() => handleVerify(question._id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Xác minh mua hàng"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(question._id)}
                          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-4 mb-4 border border-slate-200/50">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-semibold">Sản phẩm:</span>
                        <span className="text-slate-900 font-medium">{question.product.name}</span>
                        <span className="text-slate-400">({question.product.sku})</span>
                      </div>
                      {question.orderShortId && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Đơn hàng: <span className="font-medium">{question.orderShortId}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-bold">Q</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 leading-relaxed text-base">{question.question}</p>
                        {!question.answer && (
                          <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Chưa trả lời
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {question.answer && (
                    <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-t border-blue-200/50">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold text-blue-900">Trả lời của Admin:</span>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full border border-blue-200">
                              Đã trả lời
                            </span>
                          </div>
                          <p className="text-blue-800 leading-relaxed text-base">{question.answer}</p>
                          <div className="mt-3 text-xs text-blue-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            User sẽ nhận được thông báo qua email
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{question.helpfulCount} hữu ích</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={3}
              totalItems={totalQuestions}
            />
          </div>
        )}

        {/* Answer Modal */}
        {showAnswerModal && selectedQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Trả lời câu hỏi</h3>
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setAnswerText('');
                    setSelectedQuestion(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Câu hỏi:
                </label>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-slate-900 leading-relaxed">{selectedQuestion.question}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Trả lời: <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-300 resize-none"
                  placeholder="Nhập câu trả lời..."
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm">
                    {answerText.length === 0 ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Vui lòng nhập nội dung trả lời
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Đã nhập nội dung
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">
                    {answerText.length}/1000
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setAnswerText('');
                    setSelectedQuestion(null);
                  }}
                  className="px-6 py-3 text-slate-700 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAnswer}
                  disabled={!answerText.trim() || submitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transform hover:scale-105"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Gửi trả lời
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-animation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }
        
        .dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #4f46e5, #10b981);
          animation: bounce 1.5s infinite ease-in-out;
        }
        
        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminQuestions; 