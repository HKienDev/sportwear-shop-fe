import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/utils/api';

export async function POST(request: NextRequest) {
    try {
        // Lấy refresh token từ body
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Forward request đến backend
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, message: errorData.message || 'Token refresh failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 