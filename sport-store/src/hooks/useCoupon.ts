import { useState } from 'react';
import { couponService } from '@/services/couponService';
import { ApplyCouponData, ValidateCouponData, UseCouponData } from '@/services/couponService';
import { applyCouponSchema, validateCouponSchema, useCouponSchema } from '@/schemas/couponSchema';

export const useCoupon = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Áp dụng coupon
    const applyCoupon = async (data: ApplyCouponData) => {
        try {
            setLoading(true);
            setError(null);

            // Validate data
            applyCouponSchema.parse(data);

            const response = await couponService.applyCoupon(data);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Có lỗi xảy ra khi áp dụng mã giảm giá');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Kiểm tra coupon
    const validateCoupon = async (data: ValidateCouponData) => {
        try {
            setLoading(true);
            setError(null);

            // Validate data
            validateCouponSchema.parse(data);

            const response = await couponService.validateCoupon(data);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Có lỗi xảy ra khi kiểm tra mã giảm giá');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sử dụng coupon
    const useCoupon = async (data: UseCouponData) => {
        try {
            setLoading(true);
            setError(null);

            // Validate data
            useCouponSchema.parse(data);

            const response = await couponService.useCoupon(data);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Có lỗi xảy ra khi sử dụng mã giảm giá');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Lấy coupon theo mã
    const getCouponByCode = async (code: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await couponService.getCouponByCode(code);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Có lỗi xảy ra khi lấy thông tin mã giảm giá');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        applyCoupon,
        validateCoupon,
        useCoupon,
        getCouponByCode
    };
}; 