'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Breadcrumb from '@/components/user/productDetail/Breadcrumb';
import ProductGallery from '@/components/user/productDetail/ProductGallery';
import ProductRating from '@/components/user/productDetail/ProductRating';
import ProductPrice from '@/components/user/productDetail/ProductPrice';
import ColorSelector from '@/components/user/productDetail/ColorSelector';
import SizeSelector from '@/components/user/productDetail/SizeSelector';
import QuantitySelector from '@/components/user/productDetail/QuantitySelector';
import ProductActions from '@/components/user/productDetail/ProductActions';
import ProductBenefits from '@/components/user/productDetail/ProductBenefits';
import ProductDescription from '@/components/user/productDetail/ProductDescription';
import { checkAuth } from '@/services/authService';
import { getCategoryById } from '@/services/categoryService';
import { useAuthModal } from '@/context/authModalContext';
import { useAuth } from '@/context/authContext';
import { useCartOptimized } from '@/hooks/useCartOptimized';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  specifications?: {
    material?: string;
    weight?: string;
    stretch?: string;
    absorbency?: string;
    warranty?: string;
    origin?: string;
    fabricTechnology?: string;
    careInstructions?: string;
  };
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  price: number;
  images: string[];
  category: string;
  variants: Array<{
    color: string;
    size: string;
    stock: number;
  }>;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCartOptimized();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const decodedSku = decodeURIComponent(params.sku as string);
        console.log('Đang gọi API với SKU:', decodedSku);
        const response = await fetch(`/api/products/sku/${decodedSku}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        // Log response để debug
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Dữ liệu nhận được:', result);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Không có quyền truy cập. Vui lòng đăng nhập để xem thông tin sản phẩm.');
          }
          throw new Error(result.message || 'Không thể tải thông tin sản phẩm');
        }
        
        // Kiểm tra cấu trúc dữ liệu
        if (!result.success || !result.data || !result.data.product) {
          console.error('Cấu trúc dữ liệu không hợp lệ:', result);
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }
        
        // Cập nhật state với dữ liệu sản phẩm
        setProduct(result.data.product);
        // Fetch category info
        if (result.data.product.categoryId) {
          const catRes = await getCategoryById(result.data.product.categoryId);
          if (catRes && catRes.success && catRes.data) {
            setCategory({ name: catRes.data.name, slug: catRes.data.slug });
          } else {
            setCategory(null);
          }
        } else {
          setCategory(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin sản phẩm');
        setLoading(false);
      }
    };

    if (params.sku) {
      fetchProduct();
    }
  }, [params.sku, refreshKey]);

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      console.log('🛒 Bắt đầu thêm vào giỏ hàng');
      
      // Kiểm tra đăng nhập trước
      if (!isAuthenticated) {
        console.log('❌ Chưa đăng nhập, mở modal đăng nhập');
        openModal({
          title: 'Đăng nhập để thêm vào giỏ hàng',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          pendingAction: {
            type: 'addToCart',
            data: {
              sku: product?.sku,
              color: selectedColor || (product?.colors && product.colors.length > 0 ? product.colors[0] : 'Mặc Định'),
              size: selectedSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Mặc Định'),
              quantity
            },
            callback: () => {
              // Thực hiện lại action sau khi đăng nhập
              handleAddToCart();
            }
          }
        });
        return;
      }
      
      // Nếu sản phẩm không có colors hoặc sizes, sử dụng giá trị mặc định
      const color = selectedColor || (product?.colors && product.colors.length > 0 ? product.colors[0] : 'Mặc Định');
      const size = selectedSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Mặc Định');
      
      if (!color || !size) {
        console.log('❌ Không thể xác định màu hoặc kích thước');
        toast.error('Không thể xác định màu và kích thước sản phẩm');
        return;
      }

      if (!product) {
        console.log('❌ Không tìm thấy thông tin sản phẩm');
        toast.error('Không tìm thấy thông tin sản phẩm');
        return;
      }

      // Kiểm tra số lượng tồn kho
      if (product.stock < quantity) {
        console.log('❌ Số lượng tồn kho không đủ');
        toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
        return;
      }

      console.log('📤 Gọi API thêm vào giỏ hàng');
      await addToCart({
        sku: product.sku,
        color: color,
        size: size,
        quantity
      });

      console.log('✅ Thêm vào giỏ hàng thành công');
      // Toast đã được hiển thị trong addToCart function
      
      // Không redirect ngay, để user có thể tiếp tục shopping
      // router.push('/user/cart');
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
      
      // Xử lý lỗi 401 - chưa đăng nhập
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized') || (error as any).isAuthError)) {
        console.log('❌ Lỗi 401 - Chưa đăng nhập, mở modal');
        openModal({
          title: 'Đăng nhập để thêm vào giỏ hàng',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          pendingAction: {
            type: 'addToCart',
            data: {
              sku: product?.sku,
              color: selectedColor || (product?.colors && product.colors.length > 0 ? product.colors[0] : 'Mặc Định'),
              size: selectedSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Mặc Định'),
              quantity
            },
            callback: () => {
              // Thực hiện lại action sau khi đăng nhập
              handleAddToCart();
            }
          }
        });
        return;
      }
      
      // Các lỗi khác đã được xử lý trong addToCart function
      // Không cần hiển thị toast error ở đây nữa
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }
    
    // Kiểm tra đăng nhập trước
    if (!isAuthenticated) {
      console.log('❌ Chưa đăng nhập, mở modal đăng nhập');
      openModal({
        title: 'Đăng nhập để mua hàng',
        description: 'Vui lòng đăng nhập để mua sản phẩm này',
        pendingAction: {
          type: 'buyNow',
          data: {
            sku: product.sku,
            color: selectedColor || (product?.colors && product.colors.length > 0 ? product.colors[0] : 'Mặc Định'),
            size: selectedSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Mặc Định'),
            quantity
          },
          callback: () => {
            // Thực hiện lại action sau khi đăng nhập
            handleBuyNow();
          }
        }
      });
      return;
    }
    
    // Nếu sản phẩm không có colors hoặc sizes, sử dụng giá trị mặc định
    const color = selectedColor || (product?.colors && product.colors.length > 0 ? product.colors[0] : 'Mặc Định');
    const size = selectedSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Mặc Định');

    try {
      // Thêm vào giỏ hàng
      await addToCart({
        sku: product.sku,
        color: color,
        size: size,
        quantity
      });
      
      // Toast đã được hiển thị trong addToCart function
      // Chuyển hướng đến trang giỏ hàng
      router.push('/user/cart');
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      
      // Xử lý lỗi 401 - chưa đăng nhập
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized') || (error as any).isAuthError)) {
        console.log('❌ Lỗi 401 - Chưa đăng nhập, mở modal');
        openModal({
          title: 'Đăng nhập để mua hàng',
          description: 'Vui lòng đăng nhập để mua sản phẩm này',
          pendingAction: {
            type: 'buyNow',
            data: {
              sku: product.sku,
              color: color,
              size: size,
              quantity
            },
            callback: () => {
              // Thực hiện lại action sau khi đăng nhập
              handleBuyNow();
            }
          }
        });
        return;
      }
      
      // Các lỗi khác đã được xử lý trong addToCart function
      // Không cần hiển thị toast error ở đây nữa
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500 mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <Breadcrumb 
        productName={product?.name || ''}
        categoryName={category?.name || ''}
        categorySlug={category?.slug || ''}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery 
          images={[product.mainImage, ...product.subImages]}
          productName={product.name}
          discountPercentage={product.discountPercentage}
        />

        <div>
          <ProductRating rating={product.rating} numReviews={product.numReviews} />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <ProductPrice originalPrice={product.originalPrice} salePrice={product.salePrice} />

          <div className="h-px bg-gray-200 my-6"></div>

          {product.colors && product.colors.length > 0 && (
            <ColorSelector 
              colors={product.colors} 
              onColorSelect={handleColorSelect}
            />
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <SizeSelector 
              sizes={product.sizes} 
              onSizeSelect={handleSizeSelect} 
            />
          )}

          <QuantitySelector 
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
          />

          <ProductActions 
            isSizeSelected={true}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            isOutOfStock={product.isOutOfStock}
          />

          <ProductBenefits />
        </div>
      </div>

      <ProductDescription 
        description={product.description}
        specifications={product.specifications}
        productSku={product.sku}
        productName={product.name}
        currentRating={product.rating}
        numReviews={product.numReviews}
      />
    </div>
  );
}