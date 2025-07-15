"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageUploadTest() {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageChange = (url: string) => {
    console.log("Image URL changed:", url);
    setImageUrl(url);
    toast.success("Ảnh đã được cập nhật!");
  };

  const handleReset = () => {
    setImageUrl("");
    toast.info("Đã reset ảnh");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Test Upload Ảnh</h2>
      
      <div className="space-y-4">
        <ImageUpload
          value={imageUrl}
          onChange={handleImageChange}
        />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>URL hiện tại:</strong> {imageUrl || "Chưa có ảnh"}
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
            
            <Button
              onClick={() => {
                if (imageUrl) {
                  navigator.clipboard.writeText(imageUrl);
                  toast.success("Đã copy URL vào clipboard");
                } else {
                  toast.error("Chưa có ảnh để copy");
                }
              }}
              variant="outline"
              size="sm"
            >
              Copy URL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 