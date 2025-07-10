import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Kiểm tra xác thực
        const token = request.headers.get('authorization')?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Token not provided' },
                { status: 401 }
            );
        }

        // Tạo FormData để gửi đến backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);

        // Gửi file đến backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/product`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: backendFormData
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'Failed to upload file' };
            }
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to upload file' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in upload API:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 