import { promiseWithTimeout } from './promiseUtils';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    console.log('🖼️ Bắt đầu upload lên Cloudinary:', file.name);
    console.log('📋 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Kiểm tra environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    console.log('🔧 Environment variables:', {
      cloudName: cloudName || 'NOT_SET',
      uploadPreset: uploadPreset || 'NOT_SET',
      hasCloudName: !!cloudName,
      hasUploadPreset: !!uploadPreset
    });
    
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please check your .env.local file.');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'sport-store/categories');

    console.log('📤 Gửi request đến Cloudinary...');
    console.log('🌐 Upload URL:', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    
    const fetchPromise = fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const response = await promiseWithTimeout(fetchPromise, 30000, 'Upload timeout');
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cloudinary upload failed:', errorText);
      
      // Cố gắng parse error response
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      const errorMessage = errorData.error?.message || `Upload failed with status ${response.status}`;
      throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('✅ Upload thành công:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Alternative: Upload qua backend API (an toàn hơn)
export const uploadViaBackend = async (file: File): Promise<string> => {
  try {
    console.log('🖼️ Bắt đầu upload qua backend API:', file.name);
    
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để upload ảnh');
    }
    
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Gửi request đến backend API...');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const result = await response.json();
    console.log('✅ Upload thành công:', result.data?.url);
    return result.data?.url;
  } catch (error) {
    console.error('❌ Error uploading via backend:', error);
    throw error;
  }
}; 