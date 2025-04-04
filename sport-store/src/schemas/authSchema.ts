import { z } from "zod";

// Schema cho đăng ký
export const registerSchema = z.object({
  email: z.string()
    .email({ message: 'Email không hợp lệ' })
    .min(1, { message: 'Email là bắt buộc' }),
  password: z.string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

// Schema cho đăng nhập
export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Email không hợp lệ' })
    .min(1, { message: 'Email là bắt buộc' }),
  password: z.string()
    .min(1, { message: 'Mật khẩu là bắt buộc' })
});

// Schema cho quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email({ message: 'Email không hợp lệ' })
    .min(1, { message: 'Email là bắt buộc' })
});

// Schema cho đặt lại mật khẩu
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

// Schema cho đổi mật khẩu
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Mật khẩu hiện tại là bắt buộc' }),
  newPassword: z.string()
    .min(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    }),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu mới xác nhận không khớp',
  path: ['confirmNewPassword']
}); 