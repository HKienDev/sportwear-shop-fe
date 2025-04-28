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
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export enum PaymentMethod {
    CASH = "cash",
    BANKING = "banking",
    MOMO = "momo",
    COD = "COD",
    STRIPE = "Stripe"
}

export enum ShippingMethod {
    STANDARD = "standard",
    EXPRESS = "express",
    SAME_DAY = "same_day"
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

export interface Coupon {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    usageLimit: number;
    userLimit: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'expired';
    usageCount: number;
    userUsageCount: Record<string, number>;
    minimumPurchaseAmount: number;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
    isExpired?: boolean;
    isAvailable?: boolean;
    isActive?: boolean;
}

export interface Order {
    _id: string;
    shortId: string;
    userId?: string;
    user?: User;
    phone: string;
    items: OrderItem[];
    totalPrice: number;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: {
        fullName: string;
        phone: string;
        address: {
            province: {
                name: string;
                code: number;
            };
            district: {
                name: string;
                code: number;
            };
            ward: {
                name: string;
                code: number;
            };
            street?: string;
        };
    };
    shippingFee: number;
    note?: string;
    couponDiscount?: number;
    couponCode?: string;
    subtotal?: number;
    shipping?: number;
    appliedCoupon?: Coupon | null;
    shippingMethod?: {
        name: string;
        fee: number;
        estimatedDays: number;
    };
    discount?: number;
    directDiscount?: number;
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
    originalPrice: number;
    salePrice: number;
    stock: number;
    categoryId: string;
    brand: string;
    mainImage: string;
    subImages: string[];
    colors: string[];
    sizes: string[];
    tags: string[];
    isActive: boolean;
    sku: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id: string;
}

export interface CustomerInfo {
    name: string;
    phone: string;
    province: {
        name: string;
        code: string;
    };
    district: {
        name: string;
        code: string;
    };
    ward: {
        name: string;
        code: string;
    };
    note?: string;
}

export interface OrderData {
    items: {
        sku: string;
        quantity: number;
        color: string;
        size: string;
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: {
            province: {
                name: string;
                code: string;
            };
            district: {
                name: string;
                code: string;
            };
            ward: {
                name: string;
                code: string;
            };
        };
    };
    paymentMethod: PaymentMethod;
    shippingMethod: ShippingMethod;
    note?: string;
} 