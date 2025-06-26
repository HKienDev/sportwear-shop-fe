# Font Din Pro Setup

## Cài đặt font Din Pro

### Bước 1: Tải font files
Tải các file font Din Pro và đặt vào thư mục `public/fonts/`:

```
public/fonts/
├── DINPro-Regular.woff2
├── DINPro-Regular.woff
├── DINPro-Regular.ttf
├── DINPro-Medium.woff2
├── DINPro-Medium.woff
├── DINPro-Medium.ttf
├── DINPro-Bold.woff2
├── DINPro-Bold.woff
├── DINPro-Bold.ttf
├── DINPro-Light.woff2
├── DINPro-Light.woff
├── DINPro-Light.ttf
├── DINPro-Black.woff2
├── DINPro-Black.woff
└── DINPro-Black.ttf
```

### Bước 2: Font đã được cấu hình
- ✅ `src/app/fonts.css` - Định nghĩa font faces
- ✅ `src/app/layout.tsx` - Import font CSS
- ✅ `src/app/globals.css` - CSS variables
- ✅ `tailwind.config.ts` - Tailwind font family

### Bước 3: Sử dụng font
Font Din Pro sẽ được áp dụng tự động cho toàn bộ website. Bạn cũng có thể sử dụng class Tailwind:

```html
<!-- Sử dụng font mặc định (Din Pro) -->
<div class="font-sans">Text with Din Pro</div>

<!-- Sử dụng font Din Pro trực tiếp -->
<div class="font-din-pro">Text with Din Pro</div>

<!-- Các weight khác nhau -->
<div class="font-light">Light text</div>
<div class="font-normal">Regular text</div>
<div class="font-medium">Medium text</div>
<div class="font-bold">Bold text</div>
<div class="font-black">Black text</div>
```

### Lưu ý
- Font files cần được tải và đặt vào thư mục `public/fonts/`
- Nếu không có font files, website sẽ fallback về system fonts
- Font được cấu hình với `font-display: swap` để tối ưu performance 