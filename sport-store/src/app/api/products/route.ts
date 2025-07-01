import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log('Received product data:', data);

        // Kiểm tra xác thực
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - Token not provided' },
                { status: 401 }
            );
        }

        // Kiểm tra dữ liệu đầu vào
        if (!data.name || !data.description || !data.categoryId || !data.mainImage) {
            console.error('Missing required fields in API:', {
                name: !data.name,
                description: !data.description,
                categoryId: !data.categoryId,
                mainImage: !data.mainImage
            });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Kiểm tra danh mục tồn tại
        try {
            const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/by-id/${data.categoryId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!categoryResponse.ok) {
                console.error('Category not found:', data.categoryId);
                return NextResponse.json(
                    { error: 'Category not found' },
                    { status: 404 }
                );
            }
        } catch (categoryError) {
            console.error('Error checking category:', categoryError);
            return NextResponse.json(
                { error: 'Failed to verify category' },
                { status: 500 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to create product' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in POST /api/products:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch products' },
        { status: response.status }
      );
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 