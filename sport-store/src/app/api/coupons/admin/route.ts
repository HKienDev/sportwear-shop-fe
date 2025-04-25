import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Coupon } from "@/models/coupon";

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";
        const search = searchParams.get("search") || "";

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/coupons/admin`,
            {
                params: {
                    page,
                    limit,
                    search,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch coupons" },
            { status: 500 }
        );
    }
} 