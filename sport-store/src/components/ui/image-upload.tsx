"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset image error when value changes
  useEffect(() => {
    if (value) {
      setImageError(false);
    }
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("📁 File selected:", file.name, file.size, file.type);
    uploadFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setImageError(false);
    // Reset file input để có thể chọn lại file cũ
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Kiểm tra file trước khi upload
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP");
        return;
      }
      // Upload file
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    console.log("Cloudinary config:", {
      ...CLOUDINARY_CONFIG,
      fileType: file.type,
      fileSize: file.size,
    });

    try {
      setIsUploading(true);
      setImageError(false); // Reset error state when starting new upload

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
      setImageError(false);
      toast.success("Upload ảnh thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full aspect-[4/3] min-h-[120px] max-h-[180px] bg-muted rounded-md overflow-hidden group">
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Đang upload...</span>
              </div>
            </div>
          )}
          {!imageError ? (
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                console.error("Image failed to load:", value);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="bg-white/90 hover:bg-white"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`flex flex-col items-center justify-center w-full aspect-[4/3] min-h-[120px] max-h-[180px] border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mb-3 text-gray-400" />
          <p className="text-sm font-medium text-gray-600 mb-3 text-center">
            Click để chọn ảnh
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleUpload}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          {isUploading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Đang upload...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 