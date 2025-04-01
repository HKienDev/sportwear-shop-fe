// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Authentication
export const AUTH_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'user';

// File Upload
export const FILE_UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    MAX_FILES: 5
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
} as const;

// Auth Configuration
export const AUTH_CONFIG = {
    CHECK_INTERVAL: 60000, // 1 phút
    REDIRECT_DELAY: 2000, // 2 giây
    MAX_REDIRECT_ATTEMPTS: 2,
    REDIRECT_COOLDOWN: 5000, // 5 giây
    IGNORED_ROUTES: [
        '/',
        '/products',
        '/products/[id]',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-account',
        '/auth/verify-otp',
        '/auth/resend-otp',
        '/auth/google',
        '/auth/google/callback',
        '/api/auth/verify-token',
        '/api/auth/check-auth',
        '/admin/settings'
    ] as const,
    REDIRECT: {
        AFTER_LOGIN: '/',
        AFTER_REGISTER: '/auth/verify-account',
        AFTER_VERIFY: '/auth/login',
        AFTER_RESET: '/auth/login',
        AFTER_LOGOUT: '/auth/login',
        ADMIN: '/admin/dashboard'
    } as const
} as const;

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_ACCOUNT: '/auth/verify-account',
    PROFILE: '/profile',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    BRANDS: '/brands',
    ABOUT: '/about',
    CONTACT: '/contact',
    FAQ: '/faq',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        PRODUCTS: '/admin/products',
        CATEGORIES: '/admin/categories',
        BRANDS: '/admin/brands',
        ORDERS: '/admin/orders',
        USERS: '/admin/users',
        SETTINGS: '/admin/settings'
    },
    USER: '/user',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_ACCOUNT: '/auth/verify-account',
    },
} as const;

// Validation
export const VALIDATION = {
    REQUIRED: "Trường này là bắt buộc",
    EMAIL: "Email không hợp lệ",
    PHONE: "Số điện thoại không hợp lệ",
    PASSWORD: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
    PASSWORD_CONFIRM: "Mật khẩu xác nhận không khớp",
    MIN_LENGTH: (min: number) => `Độ dài tối thiểu là ${min} ký tự`,
    MAX_LENGTH: (max: number) => `Độ dài tối đa là ${max} ký tự`,
    MIN_VALUE: (min: number) => `Giá trị tối thiểu là ${min}`,
    MAX_VALUE: (max: number) => `Giá trị tối đa là ${max}`,
    FILE_SIZE: `Kích thước file không được vượt quá ${FILE_UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    FILE_TYPE: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${FILE_UPLOAD.ALLOWED_FILE_TYPES.join(", ")}`,
    FILE_COUNT: `Số lượng file không được vượt quá ${FILE_UPLOAD.MAX_FILES}`
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    // Auth
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    REGISTER_SUCCESS: 'Đăng ký thành công',
    UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin thành công',
    CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
    FORGOT_PASSWORD_SUCCESS: 'Gửi email khôi phục mật khẩu thành công',
    RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
    ACCOUNT_CREATED: 'Tạo tài khoản thành công',
    ACCOUNT_VERIFIED: 'Xác thực tài khoản thành công',
    PASSWORD_RESET: 'Đặt lại mật khẩu thành công',
    PROFILE_UPDATED: 'Cập nhật thông tin thành công',

    // Cart
    ADD_TO_CART_SUCCESS: 'Thêm vào giỏ hàng thành công',
    UPDATE_CART_SUCCESS: 'Cập nhật giỏ hàng thành công',
    REMOVE_FROM_CART_SUCCESS: 'Xóa khỏi giỏ hàng thành công',
    CLEAR_CART_SUCCESS: 'Xóa giỏ hàng thành công',

    // Order success messages
    ORDER_CREATED: "Đặt hàng thành công",
    ORDER_CANCELLED: "Hủy đơn hàng thành công",
    ORDER_UPDATED: "Cập nhật đơn hàng thành công",
    ORDER_DELETED: "Xóa đơn hàng thành công",
    // Product success messages
    PRODUCT_CREATED: "Thêm sản phẩm thành công",
    PRODUCT_UPDATED: "Cập nhật sản phẩm thành công",
    PRODUCT_DELETED: "Xóa sản phẩm thành công",
    // Category success messages
    CATEGORY_CREATED: "Thêm danh mục thành công",
    CATEGORY_UPDATED: "Cập nhật danh mục thành công",
    CATEGORY_DELETED: "Xóa danh mục thành công",
    // User success messages
    USER_CREATED: "Thêm người dùng thành công",
    USER_UPDATED: "Cập nhật người dùng thành công",
    USER_DELETED: "Xóa người dùng thành công",
    // Settings success messages
    SETTINGS_UPDATED: "Cập nhật cài đặt thành công",
    // Upload success messages
    UPLOAD_SUCCESS: "Tải lên file thành công"
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    // Server error messages
    SERVER_ERROR: "Lỗi máy chủ nội bộ",
    NETWORK_ERROR: "Lỗi kết nối mạng",
    // Auth error messages
    USER_NOT_FOUND: "Không tìm thấy người dùng",
    EMAIL_EXISTS: "Email đã được sử dụng",
    INVALID_ID: "ID không hợp lệ",
    MISSING_FIELDS: "Thiếu thông tin bắt buộc",
    UNAUTHORIZED: "Bạn không có quyền thực hiện thao tác này",
    INVALID_PHONE: "Số điện thoại không hợp lệ",
    INVALID_PASSWORD: "Mật khẩu không chính xác",
    SAME_PASSWORD: "Mật khẩu mới không được trùng với mật khẩu cũ",
    ACCOUNT_BLOCKED: "Tài khoản đã bị khóa",
    ACCOUNT_INACTIVE: "Tài khoản đã bị vô hiệu hóa",
    ACCOUNT_NOT_VERIFIED: "Tài khoản chưa được xác thực",
    NO_REFRESH_TOKEN: "Không tìm thấy refresh token",
    SEND_OTP_FAILED: "Gửi OTP thất bại. Vui lòng thử lại!",
    OTP_INVALID: "OTP không hợp lệ hoặc đã hết hạn",
    OTP_INCORRECT: "OTP không chính xác!",
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    ACCOUNT_LOCKED: "Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau 30 phút",
    GOOGLE_AUTH_FAILED: "Xác thực Google thất bại",
    // Cart error messages
    ADD_TO_CART_ERROR: "Thêm vào giỏ hàng thất bại",
    UPDATE_CART_ERROR: "Cập nhật giỏ hàng thất bại",
    REMOVE_FROM_CART_ERROR: "Xóa khỏi giỏ hàng thất bại",
    CLEAR_CART_ERROR: "Xóa giỏ hàng thất bại",
    // Order error messages
    ORDER_NOT_FOUND: "Đơn hàng không tồn tại",
    INVALID_PRODUCT: "Sản phẩm không tồn tại",
    INSUFFICIENT_STOCK: "Sản phẩm không đủ số lượng trong kho",
    INVALID_PAYMENT: "Phương thức thanh toán không hợp lệ",
    INVALID_SHIPPING: "Thông tin vận chuyển không hợp lệ",
    PRICE_MISMATCH: "Tổng tiền không khớp với dữ liệu từ server",
    ORDER_CREATE_ERROR: "Đặt hàng thất bại",
    ORDER_CANCEL_ERROR: "Hủy đơn hàng thất bại",
    ORDER_UPDATE_ERROR: "Cập nhật đơn hàng thất bại",
    ORDER_DELETE_ERROR: "Xóa đơn hàng thất bại",
    // Product error messages
    PRODUCT_NOT_FOUND: "Sản phẩm không tồn tại",
    PRODUCT_EXISTS: "Sản phẩm đã tồn tại",
    INVALID_PRICE: "Giá sản phẩm không hợp lệ",
    INVALID_DISCOUNT: "Giá khuyến mãi không hợp lệ",
    INVALID_QUANTITY: "Số lượng sản phẩm không hợp lệ",
    // Category error messages
    CATEGORY_NOT_FOUND: "Danh mục không tồn tại",
    DUPLICATE_NAME: "Tên danh mục đã tồn tại",
    INVALID_PARENT: "Danh mục cha không tồn tại",
    // Upload error messages
    UPLOAD_FAILED: "Tải lên file thất bại",
    INVALID_FILE_TYPE: "Loại file không được hỗ trợ",
    FILE_TOO_LARGE: "File quá lớn",
    // Stats error messages
    STATS_NOT_FOUND: "Không tìm thấy thống kê",
    // User error messages
    USER_EXISTS: "Người dùng đã tồn tại",
    INVALID_USER_DATA: "Dữ liệu người dùng không hợp lệ",
    USER_UPDATE_FAILED: "Cập nhật thông tin người dùng thất bại",
    USER_DELETE_FAILED: "Xóa người dùng thất bại",
    USER_ROLE_INVALID: "Vai trò người dùng không hợp lệ",
    USER_STATUS_INVALID: "Trạng thái người dùng không hợp lệ"
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
    LOGGING_IN: 'Đang đăng nhập...',
    REGISTERING: 'Đang đăng ký...',
    UPDATING: 'Đang cập nhật...',
    DELETING: 'Đang xóa...',
    CREATING: 'Đang tạo...',
    UPLOADING: 'Đang upload...',
    SENDING_OTP: 'Đang gửi mã OTP...',
    VERIFYING_OTP: 'Đang xác thực OTP...',
    RESETTING_PASSWORD: 'Đang đặt lại mật khẩu...'
} as const;

export const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        EXPIRES_IN: "1h",
        COOKIE_NAME: "accessToken",
        COOKIE_OPTIONS: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 60 * 60 * 1000 // 1 hour
        }
    },
    REFRESH_TOKEN: {
        EXPIRES_IN: "7d",
        COOKIE_NAME: "refreshToken",
        COOKIE_OPTIONS: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
    }
} as const; 