'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Calendar, CheckCircle, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { reviewService, Review, CreateReviewData } from '@/services/reviewService';
import { useAuth } from '@/context/authContext';
import Image from 'next/image';

interface ProductReviewsProps {
  productSku: string;
  productName: string;
  currentRating: number;
  numReviews: number;
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
  numReviews
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
      console.log('Fetching user orders for product:', productSku);
      
      console.log('Fetching orders from /api/orders/user');
      const response = await fetch('/api/orders/user', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders data:', data);
        console.log('Data type:', typeof data);
        console.log('Data.data type:', typeof data.data);
        console.log('Data.data:', data.data);
        console.log('Data.data.orders:', data.data?.orders);
        console.log('Data.data.orders type:', typeof data.data?.orders);
          
          if (data.success) {
            // Backend returns data: orders (array directly)
            const orders = data.data || [];
            console.log('Orders array:', orders);
            
            // Filter orders that contain this product
            const ordersWithProduct = orders.filter((order: any) => {
              console.log('Checking order:', order.shortId, 'items:', order.items);
              return order.items && order.items.some((item: any) => {
                console.log('Checking item:', item.sku, 'vs productSku:', productSku);
                return item.sku === productSku;
              });
            });
            console.log('Orders with product:', ordersWithProduct);
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

  // Debug logging
  console.log('User review state:', userReview);
  console.log('User:', user);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đánh giá sản phẩm
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(averageRating, 20)}
              <span className="text-lg font-medium text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">
              ({totalReviews} đánh giá)
            </span>
          </div>
        </div>
        
        {user ? (
          userReview ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Bạn đã đánh giá sản phẩm này
              </span>
              <button
                onClick={handleDeleteReview}
                disabled={deleting}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa đánh giá'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Viết đánh giá
            </button>
          )
        ) : (
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Đăng nhập để đánh giá
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Viết đánh giá cho {productName}
            </h4>
            <button
              onClick={() => setShowReviewForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Order Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn đơn hàng đã mua sản phẩm này *
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            <p className="text-xs text-gray-500 mt-1">
              Chỉ hiển thị các đơn hàng có chứa sản phẩm này
            </p>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá sao *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    fill={star <= formData.rating ? "currentColor" : "none"}
                    className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề đánh giá *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Tóm tắt đánh giá của bạn"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.comment.length}/1000 ký tự
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tùy chọn)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors">
                <Upload size={16} />
                Tải ảnh
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
          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Chưa có đánh giá nào</p>
            <p className="text-sm text-gray-400">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg p-6 border border-gray-200">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.fullname}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 font-medium">
                        {review.user.fullname.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.user.fullname}
                      </span>
                      {review.isVerified && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {renderStars(review.rating, 14)}
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(review.createdAt)}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {review.comment}
                </p>
              </div>

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
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsUp size={14} />
                    Hữu ích ({review.isHelpful})
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