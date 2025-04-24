interface ProductPriceProps {
  originalPrice: number;
  salePrice?: number;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' VND';
};

const ProductPrice: React.FC<ProductPriceProps> = ({ originalPrice, salePrice }) => {
  return (
    <div className="flex items-end gap-3 mb-6">
      {salePrice && salePrice < originalPrice ? (
        <>
          <span className="text-2xl font-bold text-red-600">{formatCurrency(salePrice)}</span>
          <span className="text-lg text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
        </>
      ) : (
        <span className="text-2xl font-bold text-gray-900">{formatCurrency(originalPrice)}</span>
      )}
    </div>
  );
};

export default ProductPrice; 