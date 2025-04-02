import type { OrderItem } from './order';

export interface BaseEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export enum MembershipLevel {
    IRON = "Hạng Sắt",
    SILVER = "Hạng Bạc",
    GOLD = "Hạng Vàng",
    PLATINUM = "Hạng Bạch Kim",
    DIAMOND = "Hạng Kim Cương"
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

export enum AuthStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    BLOCKED = "blocked"
}

export interface User {
    _id: string;
    username?: string;
    email: string;
    password?: string;
    fullname: string;
    phone: string;
    avatar?: string;
    gender: Gender;
    dob?: Date;
    address: {
        province: string;
        district: string;
        ward: string;
        street: string;
    };
    googleId?: string;
    googleEmail?: string;
    role: UserRole;
    membershipLevel: MembershipLevel;
    points: number;
    authStatus: AuthStatus;
    lastLogin?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface Category extends BaseEntity {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    isActive: boolean;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    _id: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    shortId: string;
    userId: string;
    user: User;
    items: OrderItem[];
    total: number;
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentMethod: 'cash' | 'banking' | 'momo';
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
    };
    note?: string;
    createdAt: string;
    updatedAt: string;
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