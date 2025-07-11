"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/cloudinary";

import { CreateCategoryRequest, Category } from "@/types/category";
import { X, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  description: z.string().max(500, "Mô tả không được vượt quá 500 ký tự").optional(),
  image: z.string().min(1, "Vui lòng chọn ảnh cho danh mục"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Lấy danh sách categories khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/admin', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success && data.data.categories) {
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isActive: true,
    },
  });

  // Thêm hàm kiểm tra tên trùng lặp
  const checkDuplicateName = (name: string) => {
    const isDuplicate = categories.some(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "Tên danh mục đã tồn tại"
      });
      toast.error("Tên danh mục đã tồn tại");
      return true;
    }
    return false;
  };

  // Thêm hàm xử lý khi tên thay đổi
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    // Xóa lỗi trước đó nếu có
    if (form.formState.errors.name) {
      form.clearErrors("name");
    }

    if (name.length >= 2) {
      const isDuplicate = checkDuplicateName(name);
      if (!isDuplicate) {
        toast.success("Tên danh mục hợp lệ");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Kiểm tra ảnh
      if (!data.image || data.image === '') {
        form.setError("image", {
          type: "manual",
          message: "Vui lòng chọn ảnh cho danh mục"
        });
        toast.error("Vui lòng chọn ảnh cho danh mục");
        return;
      }

      // Upload ảnh lên Cloudinary
      let imageUrl = '';
      try {
        console.log('🖼️ Bắt đầu xử lý ảnh...');
        
        // Chuyển base64 thành file
        const base64Data = data.image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        
        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        
        console.log('📤 Bắt đầu upload lên Cloudinary...');
        
        // Upload lên Cloudinary
        imageUrl = await uploadToCloudinary(file);
        
        console.log('✅ Upload thành công:', imageUrl);
      } catch (error) {
        console.error("❌ Error uploading image:", error);
        const errorMessage = error instanceof Error ? error.message : "Lỗi khi upload ảnh lên Cloudinary";
        form.setError("image", {
          type: "manual",
          message: errorMessage
        });
        toast.error(errorMessage);
        return;
      }

      // Tạo dữ liệu gửi lên server
      const categoryData: CreateCategoryRequest = {
        name: data.name,
        description: data.description || "",
        image: imageUrl,
        isActive: data.isActive
      };

      // Gọi API tạo category
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(categoryData)
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        toast.success("Tạo danh mục thành công");
        router.push("/admin/categories/list");
        router.refresh();
      } else {
        if (responseData.message?.includes("đã tồn tại")) {
          form.setError("name", {
            type: "manual",
            message: responseData.message
          });
        }
        toast.error(responseData.message || "Có lỗi xảy ra khi tạo danh mục");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi tạo danh mục");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-orange-500" />
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tên danh mục</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên danh mục" 
                            className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            {...field}
                            onChange={handleNameChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả danh mục"
                            className="resize-none min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-orange-500" />
                  Trạng thái
                </h3>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hiển thị danh mục</FormLabel>
                        <FormDescription>
                          Bật/tắt hiển thị danh mục này trên trang web
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-orange-500" />
                  Hình ảnh danh mục
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Ảnh đại diện</FormLabel>
                        <FormControl>
                          <div className="mt-2">
                            {imagePreview ? (
                              <div className="relative group">
                                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                                  <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={500}
                                    height={300}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImagePreview(null);
                                    form.setValue("image", "");
                                  }}
                                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-all group-hover:opacity-100 opacity-0"
                                >
                                  <X className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 hover:border-orange-500 transition-colors">
                                <div className="text-center">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="image-upload"
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 hover:text-orange-600"
                                    >
                                      <span>Tải lên ảnh</span>
                                      <input
                                        id="image-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                      />
                                    </label>
                                    <p className="pl-1">hoặc kéo thả</p>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-600 mt-2">
                                    PNG, JPG, GIF tối đa 10MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Lưu danh mục"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 