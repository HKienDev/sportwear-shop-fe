import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/utils/api';

export async function GET(request: NextRequest) {
    try {
        // Lấy token từ header Authorization
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'No authorization header' },
                { status: 401 }
            );
        }

        // Forward request đến backend
        const response = await fetch(`${API_URL}/auth/check`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, message: errorData.message || 'Authentication failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 