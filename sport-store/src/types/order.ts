export interface Order {
  _id: string;
  shortId: string;
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed";
  paymentMethod: "COD" | "BANK";
  createdAt: string;
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
      discountPrice?: number;
      images: string[];
    };
    quantity: number;
  }[];
  customer: {
    _id: string;
    fullname: string;
    phone: string;
    address: {
      province: string;
      district: string;
      ward: string;
      street: string;
    };
  };
  shippingMethod: "standard" | "express";
  shippingFee: number;
  note?: string;
} 