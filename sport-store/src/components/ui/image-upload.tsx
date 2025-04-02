"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Cloudinary config
const CLOUDINARY_CONFIG = {
  cloudName: "dta6mizzm",
  uploadPreset: "sport-store",
  folder: "categories"
};

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Kiểm tra định dạng file
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP");
      return;
    }

    console.log("Cloudinary config:", {
      ...CLOUDINARY_CONFIG,
      fileType: file.type,
      fileSize: file.size,
    });

    try {
      setIsUploading(true);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
      if (CLOUDINARY_CONFIG.folder) {
        formData.append("folder", CLOUDINARY_CONFIG.folder);
      }

      // Upload lên Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      console.log("Uploading to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      onChange(data.secure_url);
      toast.success("Upload ảnh thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full h-[200px]">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed rounded-md">
          <Upload className="h-8 w-8 mb-2 text-gray-500" />
          <p className="text-sm text-gray-500 mb-2">
            Kéo thả ảnh vào đây hoặc click để chọn
          </p>
          <p className="text-xs text-gray-400 mb-2">
            Tối đa 5MB, định dạng JPG, PNG hoặc WEBP
          </p>
          <Input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleUpload}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang upload...
              </>
            ) : (
              "Chọn ảnh"
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 