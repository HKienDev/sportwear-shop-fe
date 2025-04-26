/**
 * Format a number as currency in VND
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "1.234.567 ₫")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a date string to localized format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a number with thousand separators
 * @param number - The number to format
 * @returns Formatted string (e.g., "1.234.567")
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number);
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