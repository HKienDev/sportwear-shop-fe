# Font Barlow Setup

## Cài đặt font Barlow (Google Fonts)

### Bước 1: Font đã được cấu hình
Font Barlow được load từ Google Fonts và đã được cấu hình sẵn:

- ✅ `src/app/fonts.css` - Import Google Fonts và định nghĩa font faces
- ✅ `src/app/layout.tsx` - Import font CSS
- ✅ `src/app/globals.css` - CSS variables
- ✅ `tailwind.config.ts` - Tailwind font family

### Bước 2: Sử dụng font
Font Barlow sẽ được áp dụng tự động cho toàn bộ website. Bạn cũng có thể sử dụng class Tailwind:

```html
<!-- Sử dụng font mặc định (Barlow) -->
<div class="font-sans">Text with Barlow</div>

<!-- Sử dụng font Barlow trực tiếp -->
<div class="font-barlow">Text with Barlow</div>

<!-- Các weight khác nhau -->
<div class="font-light">Light text</div>
<div class="font-normal">Regular text</div>
<div class="font-medium">Medium text</div>
<div class="font-bold">Bold text</div>
<div class="font-black">Black text</div>
```

### Lưu ý
- Font Barlow được load từ Google Fonts, không cần file font local
- Font được cấu hình với `font-display: swap` để tối ưu performance
- Nếu không thể load từ Google Fonts, website sẽ fallback về system fonts
- Font hỗ trợ đầy đủ các weight từ 100-900 và italic styles 