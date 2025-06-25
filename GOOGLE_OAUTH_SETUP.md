# Hướng dẫn cấu hình Google OAuth cho Sport Store

## 🔧 Cấu hình Google Cloud Console

### 1. Tạo project trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API và Google OAuth2 API

### 2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**
4. Điền thông tin:
   - **Name**: Sport Store OAuth
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://yourdomain.com (nếu deploy)
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:4000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (nếu deploy)
     ```

### 3. Lấy Client ID và Client Secret

Sau khi tạo xong, bạn sẽ có:
- **Client ID**: `896612922228-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 Cấu hình Backend (.env)

Tạo file `.env` trong thư mục `sportwear-shop-be/sport-store/`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
```

## 🔧 Cấu hình Frontend (.env.local)

Tạo file `.env.local` trong thư mục `sportwear-shop-fe/sport-store/`:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🚀 Kiểm tra hoạt động

1. **Khởi động backend**:
   ```bash
   cd sportwear-shop-be/sport-store
   npm run dev
   ```

2. **Khởi động frontend**:
   ```bash
   cd sportwear-shop-fe/sport-store
   npm run dev
   ```

3. **Test đăng nhập Google**:
   - Truy cập http://localhost:3000/auth/login
   - Click "Đăng nhập với Google"
   - Kiểm tra flow đăng nhập

## 🔍 Troubleshooting

### Lỗi "Missing required parameter: redirect_uri"

**Nguyên nhân**: 
- Chưa cấu hình `GOOGLE_REDIRECT_URI` trong backend
- Redirect URI không khớp với cấu hình trong Google Cloud Console

**Giải pháp**:
1. Kiểm tra file `.env` backend có đầy đủ biến Google OAuth
2. Đảm bảo redirect URI trong Google Cloud Console khớp với backend
3. Restart server backend

### Lỗi "Invalid client"

**Nguyên nhân**: 
- Client ID hoặc Client Secret không đúng
- Chưa enable Google+ API

**Giải pháp**:
1. Kiểm tra lại Client ID và Client Secret
2. Enable Google+ API trong Google Cloud Console
3. Đợi vài phút để thay đổi có hiệu lực

### Lỗi CORS

**Nguyên nhân**: 
- Frontend và backend chạy trên port khác nhau
- Chưa cấu hình CORS đúng

**Giải pháp**:
1. Kiểm tra `CORS_ORIGIN` trong backend
2. Đảm bảo frontend chạy trên port 3000

## 📝 Lưu ý quan trọng

1. **Không commit file .env lên git**
2. **Client Secret phải được bảo mật**
3. **Redirect URI phải chính xác tuyệt đối**
4. **Test kỹ trước khi deploy production**

## 🔗 Liên kết hữu ích

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) 