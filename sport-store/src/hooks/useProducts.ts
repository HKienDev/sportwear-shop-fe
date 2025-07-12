import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { AdminProduct, ProductQueryParams } from '@/types/product';
import { ProductFormData, ProductFormErrors, ProductFormState, AdminCategory as ProductCategory } from '@/types/product';
import { TOKEN_CONFIG } from '@/config/token';
import { adminProductService } from '@/services/adminProductService';

// Initial form data
const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  sku: '',
  description: '',
  brand: '',
  originalPrice: 0,
  salePrice: 0,
  stock: 0,
  categoryId: '',
  mainImage: null,
  subImages: [],
  colors: [],
  sizes: [],
  tags: [],
  isActive: true
};

const initialErrors: ProductFormErrors = {};

export function useProducts(options: ProductQueryParams = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [total, setTotal] = useState(0);
    const optionsRef = useRef(options);
    useEffect(() => { optionsRef.current = options; }, [options]);
    const [formState, setFormState] = useState<ProductFormState>({
        data: { ...initialFormData },
        errors: { ...initialErrors },
        isLoading: false,
        isSubmitting: false,
        categories: []
    });

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminProductService.getProducts(optionsRef.current);
            if (res.success && res.data) {
                setProducts(res.data.products);
                setTotal(res.data.total || 0);
            } else {
                setProducts([]);
                setTotal(0);
            }
        } catch {
            setProducts([]);
            setTotal(0);
            toast.error('Có lỗi xảy ra khi lấy danh sách sản phẩm');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchProducts]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setFormState(prev => ({ ...prev, isLoading: true }));
            
            // Lấy token từ localStorage
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            
            if (!token) {
                toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
                setFormState(prev => ({ ...prev, isLoading: false }));
                return;
            }
            
            console.log('Fetching categories with token:', token);
            
            // Sử dụng apiClient thay vì fetch trực tiếp
            console.log('Calling API to fetch categories...');
            const response = await apiClient.getCategories();
            console.log('API response for categories:', response);
            console.log('API response data structure:', JSON.stringify(response.data, null, 2));
            
            if (response.data.success) {
                // Kiểm tra và đảm bảo data.data.categories là một mảng
                const responseData = response.data.data;
                const categoriesData = responseData && 
                    typeof responseData === 'object' && 
                    'categories' in responseData && 
                    Array.isArray(responseData.categories) 
                    ? responseData.categories 
                    : [];
                console.log('Processed categories data:', categoriesData);
                
                // Định nghĩa interface tạm thời cho dữ liệu từ API
                interface ApiCategory {
                    _id: string;
                    categoryId?: string;
                    name: string;
                    slug: string;
                    isActive: boolean;
                }
                
                // Chuyển đổi dữ liệu categories thành ProductCategory[]
                const productCategories: ProductCategory[] = categoriesData.map((category: ApiCategory) => {
                    console.log('Processing category:', category);
                    
                    // Đảm bảo categoryId luôn có giá trị
                    const categoryId = category.categoryId || category._id;
                    console.log(`Category ${category.name} has categoryId: ${categoryId}`);
                    
                    return {
                        _id: category._id,
                        categoryId: categoryId,
                        name: category.name,
                        slug: category.slug,
                        isActive: category.isActive
                    };
                });
                
                // Log để debug
                console.log('Transformed categories:', productCategories);
                
                setFormState(prev => ({ 
                    ...prev, 
                    categories: productCategories,
                    isLoading: false 
                }));
            } else {
                console.error('Failed to fetch categories:', response.data.message);
                toast.error(response.data.message || 'Không thể lấy danh mục');
                setFormState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Có lỗi xảy ra khi lấy danh mục');
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const errors: ProductFormErrors = {};
        const { data } = formState;

        // Validate name
        if (!data.name) {
            errors.name = 'Tên sản phẩm là bắt buộc';
        } else if (data.name.length > 200) {
            errors.name = 'Tên sản phẩm không được vượt quá 200 ký tự';
        }

        // Validate description
        if (!data.description) {
            errors.description = 'Mô tả sản phẩm là bắt buộc';
        } else if (data.description.length > 2000) {
            errors.description = 'Mô tả không được vượt quá 2000 ký tự';
        }

        // Validate brand
        if (!data.brand) {
            errors.brand = 'Thương hiệu là bắt buộc';
        } else if (data.brand.length > 100) {
            errors.brand = 'Thương hiệu không được vượt quá 100 ký tự';
        }

        // Validate prices
        if (data.originalPrice < 0) {
            errors.originalPrice = 'Giá gốc không thể âm';
        }
        if (data.salePrice < 0) {
            errors.salePrice = 'Giá khuyến mãi không thể âm';
        }
        if (data.salePrice > data.originalPrice) {
            errors.salePrice = 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá gốc';
        }

        // Validate stock
        if (data.stock < 0) {
            errors.stock = 'Số lượng tồn kho không thể âm';
        }

        // Validate category
        if (!data.categoryId) {
            errors.categoryId = 'Danh mục là bắt buộc';
        }

        // Validate main image
        if (!data.mainImage) {
            errors.mainImage = 'Ảnh chính là bắt buộc';
        }

        // Validate sub images
        if (data.subImages.length > 5) {
            errors.subImages = 'Không được phép upload quá 5 ảnh phụ';
        }

        setFormState(prev => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    }, [formState]);

    // Update form data
    const updateFormData = useCallback((field: keyof ProductFormData, value: unknown) => {
        console.log('Updating form data:', { field, value });
        setFormState(prev => {
            const newData = { ...prev.data, [field]: value };
            console.log('New form data:', newData);
            return {
                ...prev,
                data: newData,
                errors: { ...prev.errors, [field]: undefined }
            };
        });
    }, []);

    // Reset form
    const resetForm = useCallback(() => {
        setFormState(prev => ({
            ...prev,
            data: { ...initialFormData },
            errors: { ...initialErrors }
        }));
    }, []);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        console.log('Starting handleSubmit function...');
        
        if (formState.categories.length === 0) {
            toast.error('Vui lòng chờ tải danh mục xong trước khi tạo sản phẩm!');
            return false;
        }
        if (!validateForm()) {
            console.log('Form validation failed:', formState.errors);
            toast.error('Vui lòng kiểm tra lại thông tin sản phẩm');
            return false;
        }

        console.log('Form validation passed, setting isSubmitting to true');
        setFormState(prev => ({ ...prev, isSubmitting: true }));

        try {
            // Kiểm tra xác thực
            console.log('Checking authentication status:', isAuthenticated);
            if (!isAuthenticated) {
                // Kiểm tra token trong localStorage
                const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
                console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
                
                if (!token) {
                    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    return false;
                }
            }

            // Tìm category đã chọn
            console.log('Finding selected category with categoryId:', formState.data.categoryId);
            console.log('Available categories:', formState.categories);
            
            // Tìm danh mục dựa trên categoryId hoặc _id
            const selectedCategory = formState.categories.find(
                category => category.categoryId === formState.data.categoryId || category._id === formState.data.categoryId
            );

            if (!selectedCategory) {
                console.error('Selected category not found for ID:', formState.data.categoryId);
                console.error('Available category IDs:', formState.categories.map(c => ({ 
                    _id: c._id, 
                    categoryId: c.categoryId, 
                    name: c.name 
                })));
                toast.error('Không tìm thấy thông tin danh mục');
                setFormState(prev => ({ ...prev, isSubmitting: false }));
                return false;
            }

            console.log('Selected category:', selectedCategory);

            // Upload ảnh chính
            let mainImageUrl = '';
            if (formState.data.mainImage && typeof formState.data.mainImage !== 'string') {
                try {
                    const uploadResponse = await apiClient.uploadFile(formState.data.mainImage);
                    
                    if (!uploadResponse.data.success || !uploadResponse.data.data?.url) {
                        throw new Error('Không thể upload ảnh chính');
                    }
                    mainImageUrl = uploadResponse.data.data.url;
                } catch (uploadError) {
                    console.error('Error uploading main image:', uploadError);
                    throw new Error('Không thể upload ảnh chính: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
                }
            } else if (typeof formState.data.mainImage === 'string') {
                mainImageUrl = formState.data.mainImage;
            }

            // Upload ảnh phụ
            const subImageUrls: string[] = [];
            if (formState.data.subImages.length > 0) {
                for (const image of formState.data.subImages) {
                    if (image && typeof image !== 'string') {
                        try {
                            const uploadResponse = await apiClient.uploadFile(image);
                            
                            if (!uploadResponse.data.success || !uploadResponse.data.data?.url) {
                                throw new Error('Không thể upload ảnh phụ');
                            }
                            subImageUrls.push(uploadResponse.data.data.url);
                        } catch (uploadError) {
                            console.error('Error uploading sub image:', uploadError);
                            throw new Error('Không thể upload ảnh phụ: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
                        }
                    } else if (typeof image === 'string') {
                        subImageUrls.push(image);
                    }
                }
            }

            // Tạo slug từ tên sản phẩm
            const slug = formState.data.name
                .toLowerCase()
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Chuyển đổi ProductFormData thành ProductFormData
            const createProductData: ProductFormData = {
                name: formState.data.name,
                slug: slug,
                description: formState.data.description,
                originalPrice: Number(formState.data.originalPrice),
                salePrice: Number(formState.data.salePrice),
                stock: Number(formState.data.stock),
                categoryId: selectedCategory.categoryId,
                brand: formState.data.brand,
                mainImage: mainImageUrl,
                subImages: subImageUrls,
                colors: formState.data.colors || [],
                sizes: formState.data.sizes || [],
                tags: formState.data.tags || [],
                specifications: formState.data.specifications || {},
                isActive: formState.data.isActive,
                sku: `${selectedCategory.categoryId}-${Date.now()}`
            };

            // Kiểm tra dữ liệu trước khi gửi
            if (!createProductData.name || !createProductData.description || !createProductData.categoryId || !createProductData.mainImage) {
                console.error('Missing required fields:', {
                    name: !createProductData.name,
                    description: !createProductData.description,
                    categoryId: !createProductData.categoryId,
                    mainImage: !createProductData.mainImage
                });
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                return false;
            }

            // Lấy token từ localStorage
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            
            if (!token) {
                console.error('No token found in localStorage');
                toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                setFormState(prev => ({ ...prev, isSubmitting: false }));
                return false;
            }

            // Gửi request tạo sản phẩm
            try {
                const response = await adminProductService.createProduct(createProductData);

                if (response.success) {
                    console.log('Product created successfully');
                    toast.success('Thêm sản phẩm thành công');
                    // Reset form
                    resetForm();
                    // Refresh products list
                    fetchProducts();
                    return true;
                } else {
                    // Nếu BE trả về lỗi chi tiết
                    if (response.message) {
                        toast.error(response.message);
                    }
                    return false;
                }
            } catch (apiError) {
                const error = apiError as { 
                    response?: { 
                        data?: { message?: string, errors?: unknown }, 
                        status?: number 
                    },
                    message?: string 
                };
                
                let errorMessage = 'Có lỗi xảy ra khi gọi API tạo sản phẩm';
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
                return false;
            }
        } catch (error: unknown) {
            console.error('Error creating product:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm sản phẩm';
            toast.error(errorMessage);
            return false;
        } finally {
            setFormState(prev => ({ ...prev, isSubmitting: false }));
        }
    }, [formState, validateForm, resetForm, fetchProducts, isAuthenticated]);

    // Get product by ID
    const getProductById = useCallback(async (id: string) => {
        try {
            const response = await apiClient.getProductById(id);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            throw error;
        }
    }, []);

    // Create product
    const createProduct = useCallback(async (data: ProductFormData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            console.log('Creating product with data:', data);
            
            // Hiển thị toast đang tạo sản phẩm
            toast.loading('Đang tạo sản phẩm...', { id: 'createProduct' });

            const response = await adminProductService.createProduct(data);
            console.log('Create product response:', response);

            if (!response.success) {
                throw new Error(response.message || ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            toast.success(SUCCESS_MESSAGES.PRODUCT_CREATED, { id: 'createProduct' });
            await fetchProducts();
            return response.data;
        } catch (error) {
            console.error('Failed to create product:', error);
            if (error instanceof Error) {
                toast.error(error.message, { id: 'createProduct' });
            } else {
                toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND, { id: 'createProduct' });
            }
            throw error;
        }
    }, [user, fetchProducts]);

    // Update product
    const updateProduct = useCallback(async (id: string, data: ProductFormData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return await adminProductService.updateProduct(id, data);
        } catch (error) {
            console.error('Failed to update product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    }, [user]);

    // Delete product
    const deleteProduct = useCallback(async (id: string) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return await adminProductService.deleteProduct(id);
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    }, [user]);

    return {
        products,
        total,
        isLoading,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        formState,
        setFormState,
        updateFormData,
        handleSubmit,
        validateForm,
        fetchCategories,
        resetForm
    };
} 