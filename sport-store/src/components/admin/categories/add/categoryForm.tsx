"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  description: z.string().max(500, "Mô tả không được vượt quá 500 ký tự").default(""),
  image: z.string().min(1, "Vui lòng chọn ảnh cho danh mục"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isActive: true,
      isFeatured: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      console.log("Creating category with data:", values);

      const response = await fetch(
        `${API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Create category response:", data);

      if (data.success) {
        toast.success("Tạo danh mục thành công");
        router.push("/admin/categories/list");
      } else {
        throw new Error(data.message || "Có lỗi xảy ra khi tạo danh mục");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo danh mục");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[clamp(1.5rem,3vw,2rem)]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[clamp(0.875rem,1.5vw,1rem)]">Tên danh mục</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập tên danh mục" 
                  className="text-[clamp(0.875rem,1.5vw,1rem)]"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[clamp(0.75rem,1.25vw,0.875rem)]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[clamp(0.875rem,1.5vw,1rem)]">Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả danh mục"
                  className="resize-none text-[clamp(0.875rem,1.5vw,1rem)] min-h-[clamp(6rem,12vw,8rem)]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[clamp(0.75rem,1.25vw,0.875rem)]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[clamp(0.875rem,1.5vw,1rem)]">Hình ảnh danh mục</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage className="text-[clamp(0.75rem,1.25vw,0.875rem)]" />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[clamp(1rem,2vw,1.5rem)]">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-[clamp(0.875rem,1.5vw,1rem)]">Hoạt động</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-[clamp(0.875rem,1.5vw,1rem)]">Nổi bật</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-[clamp(0.75rem,1.5vw,1rem)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories/list")}
            className="w-full sm:w-auto text-[clamp(0.875rem,1.5vw,1rem)]"
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto text-[clamp(0.875rem,1.5vw,1rem)]"
          >
            {loading ? "Đang tạo..." : "Tạo danh mục"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 