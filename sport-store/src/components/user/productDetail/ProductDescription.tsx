interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button className="pb-4 border-b-2 border-red-600 text-red-600 font-medium">
            Mô tả sản phẩm
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700">
            Thông số kỹ thuật
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700">
            Đánh giá
          </button>
        </div>
      </div>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProductDescription; 