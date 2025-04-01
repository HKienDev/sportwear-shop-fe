export interface BaseEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface User extends BaseEntity {
    email: string;
    name: string;
    fullname?: string;
    phone: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive' | 'blocked';
    isVerified: boolean;
    avatar?: string;
    membershipLevel?: string;
    totalSpent?: number;
}

export interface Category extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    isActive: boolean;
}

export interface Product extends BaseEntity {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    categoryId: string;
    images: string[];
    stock: number;
    isActive: boolean;
    specifications?: Record<string, string>;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order extends BaseEntity {
    shortId: string;
    user: User;
    items: CartItem[];
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'cash' | 'banking' | 'momo';
    paymentStatus: 'pending' | 'paid' | 'failed';
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
    };
    note?: string;
}

export interface Stats {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: Product[];
}

export interface UploadResponse {
    url: string;
}

export interface ApiError {
    response?: {
        data?: {
            message: string;
        };
    };
    message: string;
}

export interface CreateOrderData {
    totalAmount: number;
    status: Order['status'];
    paymentStatus: Order['paymentStatus'];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
    };
    paymentMethod: Order['paymentMethod'];
    note?: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
    id: string;
}

export interface CreateProductData {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    categoryId: string;
    images: string[];
    stock: number;
    isActive: boolean;
    specifications?: Record<string, string>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id: string;
} 