export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
} 