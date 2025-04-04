import type { OrderItem } from './order';

export interface BaseEntity {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
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

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}

export enum PaymentMethod {
    CASH = "cash",
    BANKING = "banking",
    MOMO = "momo"
}

export interface User {
    _id: string;
    customId?: string;
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
    totalSpent: number;
    orderCount: number;
    authStatus: AuthStatus;
    lastLogin?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    loginAttempts: number;
    lockedUntil?: Date;
    pendingUpdate?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    _id: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    _id: string;
    shortId: string;
    userId?: string;
    user?: User;
    phone: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: {
        province: string;
        district: string;
        ward: string;
        street: string;
    };
    shippingFee: number;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
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
    phone: string;
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