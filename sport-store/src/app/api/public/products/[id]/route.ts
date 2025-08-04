import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Đảm bảo params.id được xử lý đúng cách
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra biến môi trường
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return NextResponse.json(
        { success: false, message: "Cấu hình server không hợp lệ" },
        { status: 500 }
      );
    }

    console.log("API URL:", apiUrl);
    console.log("Product ID:", id);

    // Thêm timeout để tránh infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // Sửa URL API endpoint và thêm token nếu có
      const token = request.cookies.get("token")?.value;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Chỉ thêm Authorization header nếu có token
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("Using token for authentication");
      } else {
        console.log("No token found, accessing as guest");
      }

      // Thử nhiều cách khác nhau để xây dựng URL API
      // Cách 1: Sử dụng endpoint công khai
      let productUrl = `${apiUrl}/products/${id}`;
      console.log(`Trying API URL (1): ${productUrl}`);

      // Gọi API với timeout
      let response = await fetch(productUrl, {
        headers,
        signal: controller.signal,
      });

      // Nếu không thành công, thử cách 2
      if (!response.ok && response.status === 404) {
        // Cách 2: Sử dụng endpoint thông thường
        productUrl = `${apiUrl}/products/${id}`;
        console.log(`Trying API URL (2): ${productUrl}`);
        
        response = await fetch(productUrl, {
          headers,
          signal: controller.signal,
        });
      }

      clearTimeout(timeoutId);

      // Log response status để debug
      console.log(`Product API response status: ${response.status}`);

      // Lấy response text để debug
      const responseText = await response.text();
      console.log(`Response text: ${responseText}`);

      // Parse JSON từ text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return NextResponse.json(
          { success: false, message: "Không thể phân tích dữ liệu từ server" },
          { status: 500 }
        );
      }

      // Nếu response không ok, trả về lỗi tương ứng
      if (!response.ok) {
        // Nếu lỗi 404, trả về thông báo sản phẩm không tồn tại
        if (response.status === 404) {
          return NextResponse.json(
            { success: false, message: "Sản phẩm không tồn tại" },
            { status: 404 }
          );
        }
        
        // Nếu lỗi khác, trả về thông báo lỗi từ server
        return NextResponse.json(
          { 
            success: false, 
            message: data.message || "Không thể lấy thông tin sản phẩm",
            details: data
          },
          { status: response.status }
        );
      }
      
      // Kiểm tra cấu trúc dữ liệu
      if (!data || !data.success) {
        console.error("Invalid API response structure:", data);
        return NextResponse.json(
          { 
            success: false, 
            message: "Cấu trúc dữ liệu không hợp lệ",
            details: data
          },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { success: false, message: "Yêu cầu đã hết thời gian chờ" },
          { status: 408 }
        );
      }
      console.error("Error in fetch:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Lỗi khi gọi API",
          details: errorMessage
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error in route handler:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Lỗi server",
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 