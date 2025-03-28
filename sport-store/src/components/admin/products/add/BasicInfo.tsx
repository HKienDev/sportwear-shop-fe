import { Tag, Layers } from "lucide-react";

interface BasicInfoProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function BasicInfo({ 
  name, 
  description, 
  onNameChange, 
  onDescriptionChange 
}: BasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <label className="input-label flex items-center">
          <Tag className="mr-2 text-blue-500" size={20} />
          Tên Sản Phẩm
        </label>
        <input 
          type="text" 
          className="input-field mt-2" 
          placeholder="Nhập tên sản phẩm..." 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      {/* Product Description */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <label className="input-label flex items-center">
          <Layers className="mr-2 text-green-500" size={20} />
          Mô Tả Sản Phẩm
        </label>
        <textarea 
          className="input-field mt-2 h-32 resize-none" 
          placeholder="Nhập mô tả sản phẩm..." 
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
} 