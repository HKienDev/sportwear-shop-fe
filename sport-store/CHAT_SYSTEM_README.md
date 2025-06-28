# 🚀 Hệ Thống Chat E-Commerce

## 📋 Tổng Quan

Hệ thống chat đã được hoàn thiện với đầy đủ tính năng cho cả user và admin, hỗ trợ real-time messaging thông qua Socket.IO.

## 🎯 Tính Năng Đã Hoàn Thiện

### ✅ User Side (Khách hàng)
- [x] **Floating Chat Button**: Nút chat nổi ở góc phải dưới
- [x] **Real-time Messaging**: Gửi/nhận tin nhắn tức thì
- [x] **User Authentication**: Hỗ trợ cả user đã đăng nhập và guest
- [x] **Message History**: Lưu lịch sử tin nhắn
- [x] **Notification**: Thông báo tin nhắn mới khi chat đóng
- [x] **Responsive Design**: Tương thích mobile và desktop
- [x] **Auto-scroll**: Tự động cuộn xuống tin nhắn mới nhất

### ✅ Admin Side (Quản trị viên)
- [x] **Conversation Management**: Quản lý nhiều cuộc trò chuyện
- [x] **Real-time Dashboard**: Xem danh sách user đang chat
- [x] **Multi-tab Chat**: Mở nhiều cuộc trò chuyện song song
- [x] **Message History**: Xem lịch sử tin nhắn từng user
- [x] **Read Status**: Đánh dấu tin nhắn đã đọc
- [x] **User Info**: Hiển thị thông tin user (nếu đã đăng nhập)
- [x] **Theme Support**: Hỗ trợ nhiều theme giao diện

### ✅ Backend (Server)
- [x] **Socket.IO Setup**: Real-time communication
- [x] **Message Storage**: Lưu trữ tin nhắn trong MongoDB
- [x] **User Management**: Quản lý user online/offline
- [x] **API Endpoints**: RESTful API cho chat operations
- [x] **Authentication**: JWT token validation
- [x] **Error Handling**: Xử lý lỗi và logging

## 🏗️ Cấu Trúc Hệ Thống

### Frontend (Next.js)
```
src/
├── app/
│   ├── api/chat/                    # API Routes
│   │   ├── conversations/route.ts
│   │   ├── messages/[id]/route.ts
│   │   ├── send/route.ts
│   │   └── mark-read/[id]/route.ts
│   ├── (admin)/admin/messages/      # Admin Chat Page
│   └── user/layout.tsx              # User Layout với Chat
├── components/
│   └── common/chat/
│       ├── userChat.tsx             # User Chat Component
│       └── ChatManagerAdmin/        # Admin Chat Manager
│           ├── ChatManagerAdmin.tsx
│           ├── useSocketConnection.ts
│           ├── useChatAPI.ts
│           └── [other components]
```

### Backend (Express + Socket.IO)
```
src/
├── config/
│   └── socket.js                    # Socket.IO Configuration
├── controllers/
│   └── chatController.js            # Chat API Controllers
├── models/
│   └── ChatMessage.js               # Message Database Model
├── routes/
│   └── chatRoutes.js                # Chat API Routes
└── server.js                        # Main Server với Socket.IO
```

## 🚀 Cách Sử Dụng

### 1. Khởi Động Hệ Thống

```bash
# Backend (Port 4000)
cd sportwear-shop-be/sport-store
npm install
npm run dev

# Frontend (Port 3000)
cd sportwear-shop-fe/sport-store
npm install
npm run dev
```

### 2. User Chat

1. **Truy cập website**: Mở trang web e-commerce
2. **Mở chat**: Click vào nút chat nổi ở góc phải dưới
3. **Gửi tin nhắn**: Nhập tin nhắn và nhấn Enter hoặc click Send
4. **Nhận phản hồi**: Tin nhắn từ admin sẽ hiển thị real-time

### 3. Admin Chat Management

1. **Đăng nhập admin**: Truy cập `/auth/login` với tài khoản admin
2. **Vào trang Messages**: Click "Tin Nhắn" trong sidebar
3. **Quản lý chat**: 
   - Xem danh sách user đang chat
   - Click vào user để mở cuộc trò chuyện
   - Gửi tin nhắn phản hồi
   - Xem lịch sử tin nhắn

## 🔧 Cấu Hình

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### Backend (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/sport-store
```

### Socket.IO Configuration

Backend tự động khởi tạo Socket.IO với:
- CORS support cho frontend
- WebSocket và polling transports
- Auto-reconnection
- Ping/pong timeout

## 📊 Database Schema

### ChatMessage Collection
```javascript
{
  senderId: String,        // ID người gửi
  senderName: String,      // Tên người gửi
  recipientId: String,     // ID người nhận
  text: String,           // Nội dung tin nhắn
  messageType: String,    // 'text', 'image', 'file'
  isRead: Boolean,        // Đã đọc chưa
  isAdmin: Boolean,       // Có phải admin không
  userId: ObjectId,       // User ID (nếu đã đăng nhập)
  sessionId: String,      // Session ID cho conversation
  createdAt: Date,        // Thời gian tạo
  updatedAt: Date         // Thời gian cập nhật
}
```

## 🔌 Socket Events

### Client → Server
- `identifyUser`: Xác định danh tính user/admin
- `sendMessage`: Gửi tin nhắn
- `requestMessageHistory`: Yêu cầu lịch sử tin nhắn
- `join`: Tham gia room
- `leave`: Rời room

### Server → Client
- `identified`: Phản hồi xác định danh tính
- `receiveMessage`: Nhận tin nhắn mới
- `messageHistory`: Lịch sử tin nhắn
- `newConversation`: Cuộc trò chuyện mới
- `statusUpdate`: Cập nhật trạng thái

## 🛡️ Bảo Mật

- **JWT Authentication**: Xác thực token cho admin routes
- **Input Sanitization**: Làm sạch input từ user
- **Rate Limiting**: Giới hạn tốc độ gửi tin nhắn
- **CORS Protection**: Chỉ cho phép domain được cấu hình

## 🎨 UI/UX Features

### User Chat
- Floating button với animation
- Responsive design
- Message bubbles với timestamp
- Auto-scroll to bottom
- New message notification

### Admin Chat
- Multi-column layout
- Conversation list với unread count
- Real-time status indicators
- Theme customization
- Message input với send button

## 🔄 Real-time Features

- **Instant Messaging**: Tin nhắn gửi/nhận tức thì
- **Online Status**: Hiển thị trạng thái online/offline
- **Typing Indicators**: Hiển thị đang gõ (có thể thêm)
- **Read Receipts**: Đánh dấu đã đọc
- **Auto-reconnection**: Tự động kết nối lại khi mất mạng

## 🚀 Tính Năng Nâng Cao (Có Thể Thêm)

- [ ] **File Upload**: Gửi ảnh, file
- [ ] **Emoji Support**: Hỗ trợ emoji
- [ ] **Push Notifications**: Thông báo đẩy
- [ ] **Chatbot**: Auto-reply cơ bản
- [ ] **Message Search**: Tìm kiếm tin nhắn
- [ ] **Voice Messages**: Tin nhắn thoại
- [ ] **Video Call**: Gọi video (tích hợp WebRTC)

## 🐛 Troubleshooting

### Socket Connection Issues
1. Kiểm tra backend đã chạy chưa
2. Kiểm tra CORS configuration
3. Kiểm tra firewall/network

### Message Not Sending
1. Kiểm tra authentication token
2. Kiểm tra database connection
3. Xem console logs

### Admin Not Receiving Messages
1. Kiểm tra admin đã identify chưa
2. Kiểm tra socket connection
3. Kiểm tra user permissions

## 📝 Logs

Hệ thống có logging chi tiết:
- Socket connection/disconnection
- Message sending/receiving
- API calls
- Error handling

Xem logs trong console để debug.

## 🎉 Kết Luận

Hệ thống chat đã được hoàn thiện với đầy đủ tính năng cơ bản và nâng cao. Có thể sử dụng ngay và mở rộng thêm tính năng theo nhu cầu. 