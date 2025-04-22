import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface BestSellingProduct {
  _id: string;
  name: string;
  category: string;
  totalSales: number;
  image: string;
}

export default function BestSellingProducts() {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Có lỗi xảy ra: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const bestSellingProducts = Array.isArray(dashboardData.bestSelling) 
    ? dashboardData.bestSelling 
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        {bestSellingProducts.length > 0 ? (
          <div className="space-y-4">
            {bestSellingProducts.map((product: BestSellingProduct) => (
              <div key={product._id} className="flex items-center space-x-4">
                <div className="relative h-12 w-12">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No img</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.totalSales} đơn hàng
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Không có dữ liệu sản phẩm bán chạy</p>
        )}
      </CardContent>
    </Card>
  );
} 