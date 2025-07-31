'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Calendar, CheckCircle, Upload, X, Trash2, Send, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { reviewService, Review, CreateReviewData } from '@/services/reviewService';
import { useAuth } from '@/context/authContext';
import { getMembershipTier } from '@/utils/membershipUtils';
import Image from 'next/image';

interface ProductReviewsProps {
  productSku: string;
  productName: string;
  currentRating: number;
  numReviews: number;
  onReviewUpdate?: () => void;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  images: string[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productSku,
  productName,
  currentRating,
  numReviews,
  onReviewUpdate
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    comment: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [userReview, setUserReview] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [averageRating, setAverageRating] = useState(currentRating);
  const [totalReviews, setTotalReviews] = useState(numReviews);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [productSku]);

  // Fetch user orders for review form
  useEffect(() => {
    if (showReviewForm && user) {
      fetchUserOrders();
    }
  }, [showReviewForm, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productSku);
      if (response.success) {
        const reviews = response.data.reviews;
        setReviews(reviews);
        
        // Calculate average rating and total reviews
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          const avgRating = totalRating / reviews.length;
          setAverageRating(avgRating);
          setTotalReviews(reviews.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
        
        // Check if user has already reviewed this product
        if (user) {
          const userReview = reviews.find((review: any) => 
            review.user._id === user._id || review.userId === user._id
          );
          setUserReview(userReview);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          const orders = data.data || [];
          
          // Filter orders that contain this product
          const ordersWithProduct = orders.filter((order: any) =>
            order.items && order.items.some((item: any) => item.sku === productSku)
          );
          
          setUserOrders(ordersWithProduct);
          
          if (ordersWithProduct.length === 0) {
            toast.info('Bạn chưa có đơn hàng nào chứa sản phẩm này hoặc đơn hàng chưa được giao thành công. Chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng.');
          }
        }
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Frontend validation
    if (formData.title.trim().length < 5) {
      toast.error('Tiêu đề đánh giá phải có ít nhất 5 ký tự');
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData: CreateReviewData = {
        productSku,
        orderId: selectedOrderId,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        images: formData.images
      };

      const response = await reviewService.createReview(reviewData);
      
      if (response.success) {
        toast.success('Đánh giá đã được gửi và đang chờ phê duyệt');
        setShowReviewForm(false);
        setFormData({
          rating: 5,
          title: '',
          comment: '',
          images: []
        });
        setSelectedOrderId('');
        
        // Update userReview state immediately with the new review
        setUserReview(response.data.review);
        
        // Refresh reviews to update the list
        fetchReviews();
        
        // Notify parent component to refresh product data
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(error.response?.data?.message || 'Không thể gửi đánh giá');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload images to a server
      // For now, we'll just simulate it
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    try {
      setDeleting(true);
      const response = await reviewService.deleteReview(userReview._id);
      
      if (response.success) {
        toast.success('Đã xóa đánh giá thành công');
        setUserReview(null);
        fetchReviews(); // Refresh reviews
        
        // Notify parent component to refresh product data
        if (onReviewUpdate) {
          onReviewUpdate();
        }
      }
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa đánh giá');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={size}
            fill={index < rating ? "currentColor" : "none"}
            className={index < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
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
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Đánh giá sản phẩm
                </h3>
                <p className="text-sm text-gray-600">Chia sẻ trải nghiệm của bạn</p>
              </div>
            </div>
            
            {/* Rating Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(averageRating, 18)}
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-1">/5</span>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{totalReviews}</div>
                <div className="text-xs text-gray-500">đánh giá</div>
              </div>
            </div>
          </div>
        
        {user ? (
          userReview ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} />
                Đã đánh giá
              </div>
              <button
                onClick={handleDeleteReview}
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
                    Xóa đánh giá
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <MessageCircle size={16} />
              Viết đánh giá
            </button>
          )
        ) : (
                      <button
              onClick={() => window.location.href = '/auth/login'}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <MessageCircle size={16} />
              Đăng nhập để đánh giá
            </button>
        )}
      </div>

      {/* Modern Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Viết đánh giá cho {productName}
                </h4>
                <p className="text-sm text-gray-600">Chia sẻ trải nghiệm của bạn</p>
              </div>
            </div>
                          <button
                onClick={() => setShowReviewForm(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
          </div>

          {/* Order Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Chọn đơn hàng đã mua sản phẩm này *
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="">Chọn đơn hàng đã mua sản phẩm này</option>
              {userOrders.map((order) => {
                const item = order.items.find((item: any) => item.sku === productSku);
                return (
                  <option key={order._id} value={order.shortId}>
                    Đơn hàng {order.shortId} - {formatDate(order.createdAt)}
                    {item && ` (${item.quantity}x ${item.name})`}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Chỉ hiển thị các đơn hàng có chứa sản phẩm này
            </p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Đánh giá sao *
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="text-3xl hover:scale-110 transition-transform duration-200"
                >
                  <Star
                    size={40}
                    fill={star <= formData.rating ? "currentColor" : "none"}
                    className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
              <span className="text-lg font-medium text-gray-700 ml-3">
                {formData.rating}/5 sao
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tiêu đề đánh giá *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Tóm tắt đánh giá của bạn"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 hover:bg-white transition-colors"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nội dung đánh giá *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 hover:bg-white transition-colors"
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-2">
              {formData.comment.length}/1000 ký tự
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Hình ảnh (tùy chọn)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-6 py-3 rounded-xl border border-gray-200 flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md">
                <Upload size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">Tải ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                Tối đa 5 ảnh
              </span>
            </div>
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Review image ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Gửi đánh giá</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Modern Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h4>
            <p className="text-sm text-gray-500">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl p-4 border border-gray-200">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.fullname}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-base">
                        {review.user.fullname.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span 
                          className="font-semibold text-base"
                          style={{ 
                            color: getMembershipTier(review.user.totalSpent || 0).color 
                          }}
                        >
                          {review.user.fullname}
                        </span>
                        <Crown 
                          size={14} 
                          style={{ 
                            color: getMembershipTier(review.user.totalSpent || 0).color 
                          }}
                        />
                      </div>
                      {review.isVerified && (
                        <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium flex items-center gap-1">
                          <CheckCircle size={12} />
                          Đã xác thực
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating, 14)}
                      </div>
                      <span className="text-gray-600 font-medium text-sm">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-900 text-base mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                  {review.comment}
                </p>
              </div>

              {/* Admin Reply */}
              {review.adminNote && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-800">
                        Phản hồi từ Admin
                      </span>
                      {review.reviewedAt && (
                        <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-md">
                          {formatDate(review.reviewedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-blue-800 whitespace-pre-line leading-relaxed">
                    {review.adminNote}
                  </p>
                </div>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors duration-200">
                    <ThumbsUp size={14} />
                    <span className="font-medium">Hữu ích ({review.isHelpful})</span>
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

export default ProductReviews; 