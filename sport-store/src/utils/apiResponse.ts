import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T, message: string = 'Success'): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    message,
    data
  });
}

export function errorResponse(
  message: string, 
  status: number = 500, 
  error?: string
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    message,
    error
  }, { status });
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Not Found'): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message: string = 'Internal Server Error'): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}

export function handleApiError(error: unknown, context: string = 'API'): NextResponse<ApiResponse> {
  console.error(`❌ ${context} Error:`, error);
  
  if (error instanceof Error) {
    if (error.message.includes('Authentication failed')) {
      return unauthorizedResponse('Authentication failed');
    }
    if (error.message.includes('Backend API error')) {
      return serverErrorResponse('Backend service unavailable');
    }
  }
  
  return serverErrorResponse('An unexpected error occurred');
} 