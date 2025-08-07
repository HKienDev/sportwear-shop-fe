import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const inStock = searchParams.get('inStock');
    const onSale = searchParams.get('onSale');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!keyword) {
      return NextResponse.json(
        { success: false, message: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', keyword);
    if (category) queryParams.append('category', category);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (rating) queryParams.append('rating', rating);
    if (inStock) queryParams.append('inStock', inStock);
    if (onSale) queryParams.append('onSale', onSale);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const searchUrl = getBackendUrl(`/products/search?${queryParams.toString()}`);
    console.log('Calling backend search:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to search products' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
