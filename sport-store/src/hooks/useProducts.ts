import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Product, ProductQueryParams } from '@/types/api';
import type { CreateProductData, UpdateProductData } from '@/types/base';
import { usePaginatedData } from './usePaginatedData';
import { useApiCall } from './useApiCall';
import { ProductFormData, ProductFormErrors, ProductFormState, Category as ProductCategory } from '@/types/product';
import { TOKEN_CONFIG } from '@/config/token';

// Initial form data
const initialFormData: ProductFormData = {
  name: '',
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
    const { data: products, total, fetchData: fetchProducts } = usePaginatedData<Product>();
    const { execute: executeApiCall } = useApiCall<Product>();
    
    // Sử dụng useRef để theo dõi options
    const optionsRef = useRef(options);
    
    // Cập nhật optionsRef khi options thay đổi
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);
    
    // Form state
    const [formState, setFormState] = useState<ProductFormState>({
        data: { ...initialFormData },
        errors: { ...initialErrors },
        isLoading: false,
        isSubmitting: false,
        categories: []
    });

    // Fetch products
    useEffect(() => {
        if (isAuthenticated) {
            try {
                // Sử dụng optionsRef.current thay vì options trực tiếp
                fetchProducts(() => apiClient.products.getAll(optionsRef.current));
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Có lỗi xảy ra khi lấy danh sách sản phẩm');
            }
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchProducts]); // Bỏ options khỏi dependencies

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
            const response = await apiClient.categories.getAll({
                page: '1',
                limit: '100' // Lấy tất cả categories
            });
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
    }, []); // Không cần dependencies vì không sử dụng bất kỳ giá trị nào từ bên ngoài

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
                const formData = new FormData();
                formData.append('file', formState.data.mainImage);
                
                console.log('Uploading main image...');
                try {
                    const uploadResponse = await apiClient.upload.uploadFile(formState.data.mainImage);
                    console.log('Main image upload response:', uploadResponse);
                    
                    if (!uploadResponse.data.success || !uploadResponse.data.data?.url) {
                        throw new Error('Không thể upload ảnh chính');
                    }
                    mainImageUrl = uploadResponse.data.data.url;
                    console.log('Main image URL:', mainImageUrl);
                } catch (uploadError) {
                    console.error('Error uploading main image:', uploadError);
                    throw new Error('Không thể upload ảnh chính: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
                }
            } else if (typeof formState.data.mainImage === 'string') {
                mainImageUrl = formState.data.mainImage;
                console.log('Using existing main image URL:', mainImageUrl);
            } else {
                console.log('No main image provided');
            }

            // Upload ảnh phụ
            const subImageUrls: string[] = [];
            if (formState.data.subImages.length > 0) {
                console.log('Uploading sub images, count:', formState.data.subImages.length);
                for (const image of formState.data.subImages) {
                    if (image && typeof image !== 'string') {
                        console.log('Uploading sub image...');
                        try {
                            const uploadResponse = await apiClient.upload.uploadFile(image);
                            console.log('Sub image upload response:', uploadResponse);
                            
                            if (!uploadResponse.data.success || !uploadResponse.data.data?.url) {
                                throw new Error('Không thể upload ảnh phụ');
                            }
                            subImageUrls.push(uploadResponse.data.data.url);
                            console.log('Sub image URL added:', uploadResponse.data.data.url);
                        } catch (uploadError) {
                            console.error('Error uploading sub image:', uploadError);
                            throw new Error('Không thể upload ảnh phụ: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
                        }
                    } else if (typeof image === 'string') {
                        subImageUrls.push(image);
                        console.log('Using existing sub image URL:', image);
                    }
                }
            } else {
                console.log('No sub images to upload');
            }

            // Tạo slug từ tên sản phẩm
            const slug = formState.data.name
                .toLowerCase()
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            
            console.log('Generated slug:', slug);

            // Chuyển đổi ProductFormData thành CreateProductData
            const createProductData: CreateProductData = {
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
                isActive: formState.data.isActive,
                sku: `${selectedCategory.categoryId}-${Date.now()}`
            };

            console.log('Sending product data:', JSON.stringify(createProductData, null, 2));
            console.log('Selected category:', selectedCategory);
            console.log('Category ID being sent:', selectedCategory.categoryId);

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
            console.log('Creating product with token:', token);
            try {
                const response = await apiClient.products.create(createProductData);
                console.log('Create product response:', response);

                if (response.data.success) {
                    console.log('Product created successfully');
                    toast.success('Thêm sản phẩm thành công');
                    // Reset form
                    resetForm();
                    // Refresh products list
                    fetchProducts(() => apiClient.products.getAll(optionsRef.current));
                    return true;
                } else {
                    // Nếu BE trả về lỗi chi tiết
                    if (response.data.message) {
                        toast.error(response.data.message);
                    }
                    return false;
                }
            } catch (apiError) {
                const error = apiError as { 
                    response?: { 
                        data?: { message?: string, errors?: any }, 
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
            console.log('Setting isSubmitting to false');
            setFormState(prev => ({ ...prev, isSubmitting: false }));
        }
    }, [formState, validateForm, resetForm, fetchProducts, isAuthenticated]);

    // Get product by ID
    const getProductById = async (id: string) => {
        try {
            const response = await apiClient.products.getById(id);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            throw error;
        }
    };

    // Create product
    const createProduct = async (data: CreateProductData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            console.log('Creating product with data:', data);
            
            // Hiển thị toast đang tạo sản phẩm
            toast.loading('Đang tạo sản phẩm...', { id: 'createProduct' });

            const response = await apiClient.products.create(data);
            console.log('Create product response:', response);

            if (!response.data.success) {
                throw new Error(response.data.message || ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            toast.success(SUCCESS_MESSAGES.PRODUCT_CREATED, { id: 'createProduct' });
            await fetchProducts(() => apiClient.products.getAll(optionsRef.current));
            return response.data.data;
        } catch (error) {
            console.error('Failed to create product:', error);
            if (error instanceof Error) {
                toast.error(error.message, { id: 'createProduct' });
            } else {
                toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND, { id: 'createProduct' });
            }
            throw error;
        }
    };

    // Update product
    const updateProduct = async (id: string, data: UpdateProductData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return await executeApiCall(() => apiClient.products.update(id, data), {
                onSuccess: () => {
                    toast.success(SUCCESS_MESSAGES.PRODUCT_UPDATED);
                    fetchProducts(() => apiClient.products.getAll(optionsRef.current));
                }
            });
        } catch (error) {
            console.error('Failed to update product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    };

    // Delete product
    const deleteProduct = async (id: string) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            await executeApiCall(() => apiClient.products.delete(id), {
                onSuccess: () => {
                    toast.success(SUCCESS_MESSAGES.PRODUCT_DELETED);
                    fetchProducts(() => apiClient.products.getAll(optionsRef.current));
                }
            });
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    };

    return {
        // Products data
        products,
        total,
        isLoading,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        
        // Form state and methods
        formState,
        updateFormData,
        handleSubmit,
        validateForm,
        fetchCategories,
        resetForm
    };
} 