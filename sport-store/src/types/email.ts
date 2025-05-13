export interface OrderEmailProps {
  shortId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  directDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      street: string;
      ward: { name: string };
      district: { name: string };
      province: { name: string };
    };
  };
  createdAt: string;
} 