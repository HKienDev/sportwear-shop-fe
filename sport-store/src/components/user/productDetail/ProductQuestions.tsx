'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Calendar, CheckCircle, Send, X, Trash2, HelpCircle, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { getQuestions, createQuestion, deleteQuestion, markQuestionHelpful, getUserQuestions } from '@/services/questionService';
import type { Question, CreateQuestionData } from '@/types/api';
import { useAuth } from '@/context/authContext';
import { getMembershipTier } from '@/utils/membershipUtils';
import Image from 'next/image';

interface ProductQuestionsProps {
  productSku: string;
  productName: string;
  onQuestionUpdate?: () => void;
}

interface QuestionFormData {
  question: string;
}

interface UserOrder {
  _id: string;
  shortId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }>;
}

interface UserQuestion extends Question {
  orderShortId?: string;
}

const ProductQuestions: React.FC<ProductQuestionsProps> = ({
  productSku,
  productName,
  onQuestionUpdate
}) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    question: ''
  });
  const [submitting, setSubmitting] = useState(false);
  // Remove order-related state since users can ask questions freely
  const [userQuestion, setUserQuestion] = useState<UserQuestion | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      // Sử dụng getQuestions với filter productSku
      const response = await getQuestions({ page: 1, limit: 100, status: 'approved', productSku });
      if (response.success) {
        const questions = response.data.questions;
        setQuestions(questions);
        setTotalQuestions(response.data.pagination.total);
        
        // Check if user has already asked a question for this product
        if (user) {
          const userQuestions = questions.filter((question: Question) => 
            question.user._id === user._id
          );
          setUserQuestion(userQuestions.length > 0 ? userQuestions[userQuestions.length - 1] as UserQuestion : null);
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [productSku, user]);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Remove order fetching since users can ask questions freely

  // No need to fetch orders since users can ask questions freely

  const handleSubmitQuestion = async () => {
    if (!formData.question.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

          // Frontend validation
      if (!formData.question.trim()) {
        toast.error('Nội dung câu hỏi không được để trống');
        return;
      }

    if (formData.question.trim().length > 500) {
      toast.error('Câu hỏi không được vượt quá 500 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      const questionData: CreateQuestionData = {
        productSku,
        question: formData.question.trim()
      };

      const response = await createQuestion(questionData);
      
      if (response.success) {
        toast.success('✅ Câu hỏi đã được gửi thành công!', {
          description: 'Câu hỏi của bạn đã được hiển thị.',
          duration: 3000
        });
        setShowQuestionForm(false);
        setFormData({
          question: ''
        });
        
        // Update userQuestion state immediately with the new question
        // createQuestion returns { question: {...} } not { questions: [...] }
        setUserQuestion(response.data.question as UserQuestion);
        
        // Refresh questions to update the list
        fetchQuestions();
      }
    } catch (error: unknown) {
      console.error('Error submitting question:', error);
      
      const errorResponse = error as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      if (errorResponse?.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = errorResponse.response.data.errors.map((err) => err.message).join(', ');
        toast.error('❌ Lỗi xác thực', {
          description: errorMessages,
          duration: 4000
        });
      } else {
        toast.error('❌ Không thể gửi câu hỏi', {
          description: errorResponse?.response?.data?.message || 'Đã xảy ra lỗi khi gửi câu hỏi.',
          duration: 4000
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId?: string) => {
    const targetQuestionId = questionId || userQuestion?._id;
    if (!targetQuestionId) return;
    
    try {
      setDeleting(true);
      const response = await deleteQuestion(targetQuestionId);
      
      if (response.success) {
        toast.success('Đã xóa câu hỏi thành công');
        // If deleting the main user question, clear it
        if (!questionId || questionId === userQuestion?._id) {
          setUserQuestion(null);
        }
        fetchQuestions(); // Refresh questions
      }
    } catch (error: unknown) {
      console.error('Error deleting question:', error);
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa câu hỏi');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkHelpful = async (questionId: string) => {
    try {
      const response = await markQuestionHelpful(questionId);
      if (response.success) {
        toast.success('Đã đánh dấu câu hỏi hữu ích');
        fetchQuestions(); // Refresh to update helpful count
      }
    } catch (error) {
      console.error('Error marking question helpful:', error);
      toast.error('Không thể đánh dấu câu hỏi');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Hỏi và đáp
              </h3>
              <p className="text-sm text-gray-600">Đặt câu hỏi về sản phẩm</p>
            </div>
          </div>
          
          {/* Question Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-xs text-gray-500">câu hỏi</div>
            </div>
          </div>
        </div>
      
        {user ? (
          <div className="flex items-center gap-3">
            {userQuestion && (
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} />
                Đã hỏi ({questions.filter((q: Question) => q.user._id === user?._id).length} lần)
              </div>
            )}
            <button
              onClick={() => setShowQuestionForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <HelpCircle size={16} />
              {userQuestion ? 'Hỏi thêm' : 'Đặt câu hỏi'}
            </button>
            {userQuestion && (
              <button
                onClick={() => handleDeleteQuestion()}
                disabled={deleting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Xóa câu hỏi
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <HelpCircle size={16} />
            Đăng nhập để hỏi
          </button>
        )}
      </div>

      {/* Modern Question Form */}
      {showQuestionForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Đặt câu hỏi về {productName}
                </h4>
                <p className="text-sm text-gray-600">Chia sẻ thắc mắc của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuestionForm(false)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          {/* No order selection needed - users can ask questions freely */}

          {/* Question Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Câu hỏi của bạn *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Đặt câu hỏi về sản phẩm này..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-2">
              {formData.question.length}/500 ký tự
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting || !formData.question.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Gửi câu hỏi</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowQuestionForm(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Modern Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Chưa có câu hỏi nào</h4>
            <p className="text-sm text-gray-500">
              Hãy là người đầu tiên đặt câu hỏi về sản phẩm này!
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question._id} className="bg-white rounded-xl p-4 border border-gray-200">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {question.user.avatar ? (
                      <Image
                        src={question.user.avatar}
                        alt={question.user.fullname}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-base">
                        {question.user.fullname.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span 
                          className="font-semibold text-base"
                          style={{ 
                            color: getMembershipTier(question.user.totalSpent || 0).color 
                          }}
                        >
                          {question.user.fullname}
                        </span>
                        <Crown 
                          size={14} 
                          style={{ 
                            color: getMembershipTier(question.user.totalSpent || 0).color 
                          }}
                        />
                      </div>
                      {question.isVerified && (
                        <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium flex items-center gap-1">
                          <CheckCircle size={12} />
                          Đã xác thực
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Calendar size={16} />
                      {formatDate(question.createdAt)}
                    </div>
                  </div>
                </div>
                {/* Delete button for user's own questions */}
                {user && question.user._id === user._id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteQuestion(question._id);
                    }}
                    disabled={deleting}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                    title="Xóa câu hỏi này"
                  >
                    {deleting ? (
                      <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Xóa
                  </button>
                )}
              </div>

              {/* Question Content */}
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                  {question.question}
                </p>
              </div>

              {/* Admin Answer */}
              {question.adminAnswer && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-800">
                        Trả lời từ Admin
                      </span>
                      {question.answeredAt && (
                        <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-md">
                          {formatDate(question.answeredAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-blue-800 whitespace-pre-line leading-relaxed">
                    {question.adminAnswer}
                  </p>
                </div>
              )}

              {/* Question Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleMarkHelpful(question._id)}
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors duration-200"
                  >
                    <HelpCircle size={14} />
                    <span className="font-medium">Hữu ích ({question.isHelpful})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQuestions; 