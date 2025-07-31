import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  numReviews: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ rating, numReviews }) => {
  return (
    <div className="flex items-center mb-2">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            size={16} 
            fill={index < rating ? "currentColor" : "none"} 
            className={index < rating ? "text-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
      <span className="ml-2 text-sm text-gray-500">
        {rating.toFixed(1)} ({numReviews} {numReviews === 1 ? 'đánh giá' : 'đánh giá'})
      </span>
    </div>
  );
};

export default ProductRating; 