export type Order = {
  _id: string;
  shortId: string;
  user: string;
  items: {
    product: { 
      _id: string; 
      name: string; 
      price: number;
      images: {
        main: string;
        sub: string[];
      };
    };
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode: string;
  };
  shippingMethod?: {
    method: string;
  };
  shippingFee?: number;
  discount?: number;
  createdAt: string;
}; 