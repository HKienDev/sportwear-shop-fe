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

     ```text
     http://localhost:3000
     https://yourdomain.com (nếu deploy)
     ```

   - **Authorized redirect URIs**:

     ```text
     http://localhost:4000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (nếu deploy)
     ```

### 3. Lấy Client ID và Client Secret

Sau khi tạo xong, bạn sẽ có:

- **Client ID**: `896612922228-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 Cấu hình Backend (`.env`)

Tạo file `.env` trong thư mục `sportwear-shop-be/sport-store/`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
