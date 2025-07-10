import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        console.log('POST /api/products called');
        
        const data = await req.json();
        console.log('Received product data:', data);

        // Kiểm tra xác thực
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            console.log('No token provided, returning 401');
            return NextResponse.json(
                { error: 'Unauthorized - Token not provided' },
                { status: 401 }
            );
        }

        // Kiểm tra dữ liệu đầu vào
        const requiredFields = ['name', 'description', 'categoryId', 'mainImage'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Kiểm tra danh mục tồn tại
        try {
            const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${data.categoryId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal: AbortSignal.timeout(10000) // 10 second timeout
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
            if (categoryError instanceof Error && categoryError.name === 'AbortError') {
                return NextResponse.json(
                    { error: 'Category check timeout' },
                    { status: 408 }
                );
            }
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
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'Unknown error occurred' };
            }
            
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'GET',
      headers
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