export const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) {
    return "0đ";
  }
  return amount.toLocaleString("vi-VN") + "đ";
};

export const calculateDiscountPercentage = (originalPrice: number, salePrice: number) => {
  if (salePrice > 0) {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  }
  return 0;
};

export const getCategoryDisplay = (category: string | { _id: string; name: string }): string => {
  if (typeof category === 'string') {
    return category;
  }
  return category.name;
};

export const getBrandDisplay = (brand: string | { _id: string; name: string }): string => {
  if (typeof brand === 'string') {
    return brand;
  }
  return brand.name;
}; 