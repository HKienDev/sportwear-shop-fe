# 🔍 Debug Chat System Guide

## Vấn đề: Admin chat cho user không hiển thị

### Các thay đổi đã thực hiện:

1. **Sửa logic gửi tin nhắn từ admin** - Loại bỏ kiểm tra socket ID
2. **Sửa format message** - Sử dụng `recipientId` thay vì `conversationId`
3. **Thêm debug logging** - Theo dõi quá trình gửi/nhận tin nhắn
4. **Kiểm tra room membership** - Đảm bảo user đã join room

### Cách test:

#### 1. Khởi động hệ thống:
```bash
# Backend
cd sportwear-shop-be/sport-store
npm run dev

# Frontend  
cd sportwear-shop-fe/sport-store
npm run dev
```

#### 2. Test với debug tool:
Mở `http://localhost:3000/debug-chat.html`

**Bước 1: Connect User**
- Nhập User ID: `test_user_123`
- Nhập User Name: `Test User`
- Click "Connect User"
- Kiểm tra logs xem user đã join room chưa

**Bước 2: Connect Admin**
- Nhập Admin Name: `Test Admin`
- Click "Connect Admin"
- Kiểm tra logs xem admin đã identify chưa

**Bước 3: Test gửi tin nhắn**
- Từ User: Gửi tin nhắn bất kỳ
- Từ Admin: Gửi tin nhắn với Recipient ID = `test_user_123`

#### 3. Kiểm tra logs:

**Backend logs** (terminal backend):
```
🔍 Admin sending message to user test_user_123
🔍 Connected users: [ 'test_user_123' ]
🔍 User rooms: [ 'user_test_user_123' ]
✅ Admin message saved to database for user test_user_123
🔍 Emitting to room: user_test_user_123
🔍 Room user_test_user_123 has 1 members: [ 'socket_id_here' ]
✅ Admin message sent to room user_test_user_123
```

**Frontend logs** (browser console):
```
🔍 UserChat - Using userId: test_user_123
🔍 UserChat - User joined room: user_test_user_123
🔍 UserChat - Received message: {senderId: "admin", text: "...", ...}
🔍 UserChat - Adding new message to UI
```

### Nếu vẫn không hoạt động:

#### Kiểm tra 1: User ID consistency
- Đảm bảo user ID trong frontend và backend giống nhau
- Kiểm tra localStorage có lưu đúng userId không

#### Kiểm tra 2: Socket connection
- Đảm bảo cả user và admin đều connected
- Kiểm tra socket ID trong logs

#### Kiểm tra 3: Room membership
- Kiểm tra user đã join room `user_${userId}` chưa
- Kiểm tra room có members không

#### Kiểm tra 4: Message format
- Đảm bảo admin gửi đúng format: `{text, recipientId, senderId, senderName}`
- Đảm bảo user nhận đúng event: `receiveMessage`

### Debug commands:

#### Kiểm tra rooms trong backend:
```javascript
// Thêm vào socket.js để debug
console.log('All rooms:', io.sockets.adapter.rooms);
console.log('Connected users:', Array.from(connectedUsers.keys()));
```

#### Kiểm tra frontend:
```javascript
// Trong browser console
console.log('User ID:', localStorage.getItem('userId'));
console.log('Socket connected:', socket.connected);
console.log('Socket ID:', socket.id);
```

### Expected flow:

1. **User connects** → `identifyUser` → joins room `user_${userId}`
2. **Admin connects** → `identifyUser` → marked as admin
3. **Admin sends message** → `sendMessage` → `io.to(user_${recipientId}).emit()`
4. **User receives message** → `receiveMessage` event → update UI

### Common issues:

1. **User ID mismatch**: Frontend và backend sử dụng userId khác nhau
2. **Room not joined**: User chưa join room đúng cách
3. **Socket disconnected**: Connection bị mất
4. **Event not listened**: User không listen event `receiveMessage`

### Test với real app:

1. Mở website: `http://localhost:3000`
2. Click nút chat nổi (user)
3. Đăng nhập admin: `http://localhost:3000/auth/login`
4. Vào `/admin/messages`
5. Test gửi tin nhắn

### Logs cần kiểm tra:

**Backend:**
- User identification
- Room joining
- Admin message sending
- Room membership

**Frontend:**
- Socket connection
- User identification
- Message receiving
- UI updates 