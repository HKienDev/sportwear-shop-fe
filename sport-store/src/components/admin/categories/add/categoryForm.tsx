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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/cloudinary";
import categoryService from "@/services/categoryService";
import { CreateCategoryRequest, Category } from "@/types/category";

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
        const response = await categoryService.getAllCategories();
        if (response.success && response.data.categories) {
          setCategories(response.data.categories);
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
        
        // Upload lên Cloudinary
        imageUrl = await uploadToCloudinary(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        form.setError("image", {
          type: "manual",
          message: "Lỗi khi upload ảnh lên Cloudinary"
        });
        toast.error("Lỗi khi upload ảnh lên Cloudinary");
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
      const response = await categoryService.createCategory(categoryData);
      
      if (response.success) {
        toast.success("Tạo danh mục thành công");
        router.push("/admin/categories/list");
        router.refresh();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi tạo danh mục");
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
    <Card className="w-full">
      <CardHeader className="pb-0 p-3 sm:p-4 md:p-6 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="space-y-1">
            <CardTitle className="text-[clamp(0.875rem,2vw,1.5rem)] font-semibold">
              Thêm danh mục mới
            </CardTitle>
            <CardDescription className="text-[clamp(0.75rem,1.5vw,1rem)]">
              Thêm một danh mục sản phẩm mới vào hệ thống
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-4 sm:p-4 sm:pt-5 md:p-6 md:pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tên danh mục" 
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
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả danh mục"
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Ảnh danh mục</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <div className="relative w-full h-48 rounded-md overflow-hidden border">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Trạng thái</FormLabel>
                        <FormDescription>
                          Kích hoạt hoặc vô hiệu hóa danh mục
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo danh mục"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 