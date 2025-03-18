export function generateUniqueId(): string {
  // Tạo một chuỗi ngẫu nhiên 8 ký tự
  const randomPart = Math.random().toString(36).substring(2, 10);
  
  // Lấy timestamp hiện tại
  const timestamp = Date.now().toString(36);
  
  // Tạo một số ngẫu nhiên khác để tăng tính duy nhất
  const extraRandom = Math.floor(Math.random() * 1000000).toString(36);
  
  // Kết hợp các phần lại với nhau
  return `${timestamp}-${randomPart}-${extraRandom}`;
} 