import { Image, Upload, X, Plus } from "lucide-react";

interface ProductImagesProps {
  mainImage: string;
  additionalImages: string[];
  onMainImageChange: (image: string) => void;
  onAdditionalImagesChange: (images: string[]) => void;
}

export default function ProductImages({
  mainImage,
  additionalImages,
  onMainImageChange,
  onAdditionalImagesChange,
}: ProductImagesProps) {
  const handleMainImageUpload = () => {
    // TODO: Implement image upload logic
  };

  const handleAdditionalImageUpload = () => {
    // TODO: Implement additional image upload logic
  };

  const handleRemoveMainImage = () => {
    onMainImageChange("");
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    onAdditionalImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Main Product Image */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <label className="input-label flex items-center">
          <Image className="mr-2 text-purple-500" size={20} />
          Hình Ảnh Sản Phẩm (Chính)
        </label>
        <div className="mt-4 flex items-center space-x-4">
          {mainImage && (
            <div className="relative">
              <img 
                src={mainImage} 
                alt="Main Product" 
                className="w-32 h-32 object-cover rounded-lg shadow-md" 
              />
              <button 
                onClick={handleRemoveMainImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div 
            onClick={handleMainImageUpload}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
          >
            <Upload className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Additional Product Images */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <label className="input-label flex items-center">
          <Image className="mr-2 text-purple-500" size={20} />
          Hình Ảnh Phụ
        </label>
        <div className="mt-4 flex flex-wrap gap-4">
          {additionalImages.map((img, index) => (
            <div key={index} className="relative">
              <img 
                src={img} 
                alt={`Product ${index + 1}`} 
                className="w-24 h-24 object-cover rounded-lg shadow-md" 
              />
              <button 
                onClick={() => handleRemoveAdditionalImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div 
            onClick={handleAdditionalImageUpload}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
          >
            <Plus className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
} 