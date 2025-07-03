import { promiseWithTimeout } from './promiseUtils';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    console.log('🖼️ Bắt đầu upload lên Cloudinary:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('folder', 'sport-store/categories');

    console.log('📤 Gửi request đến Cloudinary...');
    
    const fetchPromise = fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const response = await promiseWithTimeout(fetchPromise, 30000, 'Upload timeout');
    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cloudinary upload failed:', errorText);
      throw new Error(`Upload to Cloudinary failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Upload thành công:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw error;
  }
}; 