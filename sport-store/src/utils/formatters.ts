/**
 * Format currency theo định dạng Việt Nam
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format số lượng với đơn vị
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format percentage với dấu + hoặc -
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * Format date theo định dạng Việt Nam
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 