export interface Order {
  _id: string;
  shortId: string;
  user: string | null;
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
      discountPrice?: number;
      images: string[];
    };
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid";
  paymentIntentId?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingMethod: {
    method: string;
    expectedDate: string;
    courier: string;
    trackingId: string;
    fee: number;
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
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  statusHistory: {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    updatedAt: Date;
    updatedBy: string;
    note?: string;
  }[];
  isTotalSpentUpdated: boolean;
  createdAt: string;
  updatedAt: string;
} 