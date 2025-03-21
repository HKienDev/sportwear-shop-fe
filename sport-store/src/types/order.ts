export interface Order {
  _id: string;
  shortId: string;
  user: string;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode: string;
  };
  shippingMethod: "standard" | "express";
  shippingFee: number;
  note?: string;
} 