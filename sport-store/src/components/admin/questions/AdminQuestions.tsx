'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye,
  ShoppingBag,
  User,
  Calendar,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { 
  getAdminQuestions, 
  answerQuestion,
  verifyQuestion,
  deleteQuestion
} from '../../../services/adminQuestionService';
import type { AdminQuestion, AdminQuestionResponse, AnswerQuestionData } from '../../../types/api';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<AdminQuestion | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminQuestions({
        page: currentPage,
        limit: 10,
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

  // Removed approve/reject functions since questions are auto-approved

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
    
    if (trimmedAnswer.length > 1000) {
      toast.error('Nội dung trả lời không được vượt quá 1000 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      const response = await answerQuestion(selectedQuestion._id, {
        answer: trimmedAnswer
      }) as any;

      console.log('Answer response:', response);

      if (response.success) {
        toast.success('Đã trả lời câu hỏi thành công', {
          description: 'User sẽ nhận được thông báo qua email',
          duration: 4000
        });
        setShowAnswerModal(false);
        setAnswerText('');
        setSelectedQuestion(null);
        
        // Update the question in the list immediately if we have the updated data
        console.log('Response data:', response.data);
        console.log('Selected question ID:', selectedQuestion._id);
        
        if (response.data?.question) {
          console.log('Updating question with answer:', response.data.question.answer);
          setQuestions(prevQuestions => {
            const updatedQuestions = prevQuestions.map(q => 
              q._id === selectedQuestion._id 
                ? { ...q, answer: response.data.question.answer }
                : q
            );
            console.log('Updated questions:', updatedQuestions);
            return updatedQuestions;
          });
        } else {
          console.log('No response data, fetching questions...');
          // Fallback to fetching all questions
          setTimeout(() => {
            fetchQuestions();
          }, 500);
        }
        
        if (onQuestionUpdate) onQuestionUpdate();
      }
    } catch (error: any) {
      console.error('Error answering question:', error);
      const errorMessage = error?.response?.data?.message || 'Không thể trả lời câu hỏi';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (questionId: string) => {
    try {
      const response = await verifyQuestion(questionId) as any;
      if (response.success) {
        toast.success('Đã xác minh câu hỏi');
        fetchQuestions();
        if (onQuestionUpdate) onQuestionUpdate();
      }
    } catch (error) {
      console.error('Error verifying question:', error);
      toast.error('Không thể xác minh câu hỏi');
    }
  };

    const handleDelete = async (questionId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    
    try {
      const response = await deleteQuestion(questionId) as any;
      if (response.success) {
        toast.success('Đã xóa câu hỏi');
        fetchQuestions();
        if (onQuestionUpdate) onQuestionUpdate();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Không thể xóa câu hỏi');
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
      month: 'long',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Hỏi & Đáp</h2>
          <p className="text-gray-600 mt-1">
            Tổng cộng {totalQuestions} câu hỏi
          </p>
        </div>
                 <div className="flex items-center gap-3">
           <div className="flex items-center gap-2">
             <MessageSquare className="w-5 h-5 text-blue-600" />
             <span className="text-sm font-medium text-gray-700">
               {questions.filter(q => !q.answer).length} chưa trả lời
             </span>
           </div>
           <div className="flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-600" />
             <span className="text-sm font-medium text-gray-700">
               {questions.filter(q => q.answer).length} đã trả lời
             </span>
           </div>
         </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Trạng thái
             </label>
             <select
               value={filters.status}
               onChange={(e) => handleFilterChange('status', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               <option value="">Tất cả</option>
               <option value="answered">Đã trả lời</option>
               <option value="unanswered">Chưa trả lời</option>
             </select>
           </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU sản phẩm
            </label>
            <input
              type="text"
              value={filters.productSku}
              onChange={(e) => handleFilterChange('productSku', e.target.value)}
              placeholder="Nhập SKU..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID người dùng
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="Nhập ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Đang tải...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không có câu hỏi nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((question) => (
              <div key={question._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Question Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {question.user.fullname}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {formatDate(question.createdAt)}
                        </span>
                      </div>
                      {getStatusBadge(question.status)}
                      {question.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Đã mua
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Sản phẩm:</span>
                        <span>{question.product.name}</span>
                        <span className="text-gray-400">({question.product.sku})</span>
                      </div>
                      {question.orderShortId && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Đơn hàng: {question.orderShortId}</span>
                        </div>
                      )}
                    </div>

                                         {/* Question Content */}
                     <div className="mb-4">
                       <div className="flex items-start gap-3">
                         <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                           <span className="text-white text-xs font-bold">Q</span>
                         </div>
                                                   <div className="flex-1">
                            <p className="text-gray-900">{question.question}</p>
                            {!question.answer && (
                             <div className="mt-2">
                               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
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
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                          </div>
                          <span className="font-medium text-blue-900">Trả lời của Admin:</span>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Đã trả lời
                          </span>
                        </div>
                        <p className="text-blue-800">{question.answer}</p>
                        <div className="mt-2 text-xs text-blue-600">
                          ✓ User sẽ nhận được thông báo qua email
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{question.helpfulCount} hữu ích</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    
                                         {!question.answer ? (
                       <button
                         onClick={() => openAnswerModal(question)}
                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                         title="Trả lời"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                     ) : (
                       <button
                         onClick={() => openAnswerModal(question)}
                         className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                         title="Chỉnh sửa trả lời"
                       >
                         <Edit3 className="w-4 h-4" />
                       </button>
                     )}

                    {question.orderShortId && !question.isVerified && (
                      <button
                        onClick={() => handleVerify(question._id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="Xác minh mua hàng"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(question._id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Trả lời câu hỏi</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Câu hỏi:
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{selectedQuestion.question}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trả lời: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập câu trả lời..."
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {answerText.length === 0 ? (
                    <span className="text-red-500">
                      Vui lòng nhập nội dung trả lời
                    </span>
                  ) : (
                    <span className="text-green-600">
                      ✓ Đã nhập nội dung
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
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
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAnswer}
                disabled={!answerText.trim() || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi trả lời'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions; 