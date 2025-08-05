# 🌐 Internationalization (i18n) Guide

## 📋 Tổng quan

Dự án MTravel đã được tích hợp tính năng đa ngôn ngữ với 3 ngôn ngữ:
- 🇻🇳 **Tiếng Việt** (vi) - Ngôn ngữ mặc định
- 🇺🇸 **Tiếng Anh** (en) 
- 🇯🇵 **Tiếng Nhật** (ja)

## 🚀 Cách sử dụng

### 1. Import và sử dụng trong component

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>{t('common.description')}</p>
      <button>{t('forms.buttons.save')}</button>
    </div>
  );
};
```

### 2. Thay đổi ngôn ngữ

```jsx
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
    </div>
  );
};
```

### 3. Sử dụng với interpolation

```jsx
// Trong file translation
{
  "welcome": "Xin chào {{name}}!",
  "items": "Có {{count}} mục"
}

// Trong component
const { t } = useTranslation();
return (
  <div>
    <p>{t('welcome', { name: 'John' })}</p>
    <p>{t('items', { count: 5 })}</p>
  </div>
);
```

## 📁 Cấu trúc file

```
src/
├── i18n/
│   ├── index.js              # Cấu hình i18n
│   └── locales/
│       ├── vi.json           # Tiếng Việt
│       ├── en.json           # Tiếng Anh
│       └── ja.json           # Tiếng Nhật
├── components/
│   ├── LanguageSelector.jsx  # Component chọn ngôn ngữ
│   └── LanguageSelector.css  # CSS cho LanguageSelector
└── hooks/
    └── useLanguage.js        # Custom hook quản lý ngôn ngữ
```

## 🎯 Cấu trúc translation keys

### Common (Chung)
```json
{
  "common": {
    "home": "Trang chủ",
    "about": "Giới thiệu",
    "tours": "Tours",
    "explore": "Khám phá",
    "login": "Đăng nhập",
    "signup": "Đăng ký",
    "logout": "Đăng xuất",
    "profile": "Hồ sơ",
    "search": "Tìm kiếm",
    "loading": "Đang tải...",
    "error": "Lỗi",
    "success": "Thành công",
    "cancel": "Hủy",
    "save": "Lưu",
    "edit": "Sửa",
    "delete": "Xóa",
    "add": "Thêm",
    "update": "Cập nhật",
    "confirm": "Xác nhận"
  }
}
```

### Header
```json
{
  "header": {
    "language": "Ngôn ngữ",
    "selectLanguage": "Chọn ngôn ngữ",
    "vietnamese": "Tiếng Việt",
    "english": "Tiếng Anh",
    "japanese": "Tiếng Nhật"
  }
}
```

### Admin
```json
{
  "admin": {
    "dashboard": {
      "title": "Bảng điều khiển",
      "stats": "Thống kê"
    },
    "tours": {
      "title": "Quản lý tour",
      "addTour": "Thêm tour mới",
      "editTour": "Sửa tour",
      "deleteTour": "Xóa tour"
    },
    "explores": {
      "title": "Quản lý khám phá",
      "addExplore": "Thêm khám phá mới"
    },
    "accounts": {
      "title": "Quản lý tài khoản",
      "addAccount": "Thêm tài khoản mới"
    },
    "bookings": {
      "title": "Quản lý đặt tour",
      "bookingInfo": "Thông tin đặt tour"
    },
    "ratings": {
      "title": "Quản lý đánh giá",
      "ratingInfo": "Thông tin đánh giá"
    }
  }
}
```

### Forms
```json
{
  "forms": {
    "validation": {
      "required": "Trường này là bắt buộc",
      "email": "Email không hợp lệ",
      "minLength": "Tối thiểu {{min}} ký tự",
      "maxLength": "Tối đa {{max}} ký tự"
    },
    "buttons": {
      "add": "Thêm",
      "edit": "Sửa",
      "delete": "Xóa",
      "save": "Lưu",
      "cancel": "Hủy",
      "submit": "Gửi"
    },
    "placeholders": {
      "search": "Tìm kiếm...",
      "email": "Nhập email",
      "password": "Nhập mật khẩu"
    }
  }
}
```

### Messages
```json
{
  "messages": {
    "success": {
      "created": "Tạo thành công",
      "updated": "Cập nhật thành công",
      "deleted": "Xóa thành công",
      "saved": "Lưu thành công"
    },
    "error": {
      "general": "Đã xảy ra lỗi",
      "network": "Lỗi kết nối mạng",
      "unauthorized": "Không có quyền truy cập"
    },
    "confirm": {
      "delete": "Bạn có chắc chắn muốn xóa?",
      "cancel": "Bạn có chắc chắn muốn hủy?",
      "logout": "Bạn có chắc chắn muốn đăng xuất?"
    }
  }
}
```

## 🔧 Backend Integration

### 1. API Headers
Khi gọi API, có thể gửi header `Accept-Language`:

```javascript
const response = await fetch('/api/tours', {
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language // 'vi', 'en', 'ja'
  }
});
```

### 2. Backend Response
Backend có thể trả về dữ liệu theo ngôn ngữ:

```javascript
// Backend response example
{
  "success": true,
  "data": {
    "title": {
      "vi": "Tour Hạ Long",
      "en": "Ha Long Tour", 
      "ja": "ハロン湾ツアー"
    },
    "description": {
      "vi": "Khám phá vịnh Hạ Long",
      "en": "Explore Ha Long Bay",
      "ja": "ハロン湾を探検"
    }
  }
}
```

### 3. Frontend Processing
```javascript
const { t, i18n } = useTranslation();

const getLocalizedContent = (content) => {
  if (typeof content === 'object' && content[i18n.language]) {
    return content[i18n.language];
  }
  return content;
};

// Sử dụng
const tourTitle = getLocalizedContent(tour.title);
const tourDescription = getLocalizedContent(tour.description);
```

## 🎨 UI Components

### LanguageSelector
Component dropdown chọn ngôn ngữ đã được tích hợp vào Header:

```jsx
import LanguageSelector from './components/LanguageSelector';

// Tự động hiển thị trong Header
```

### Styling
CSS đã được tối ưu cho responsive:
- Desktop: Hiển thị đầy đủ tên ngôn ngữ
- Tablet: Chỉ hiển thị flag
- Mobile: Compact design

## 📱 Responsive Design

### Desktop (>768px)
- Hiển thị đầy đủ: Flag + Tên ngôn ngữ
- Dropdown với animation mượt mà

### Tablet (768px)
- Chỉ hiển thị flag
- Dropdown compact

### Mobile (<480px)
- Button nhỏ gọn
- Dropdown tối ưu cho touch

## 🔄 State Management

### LocalStorage
Ngôn ngữ được lưu trong localStorage:
```javascript
// Tự động lưu
i18n.changeLanguage('en');

// Tự động load khi refresh
// i18n sẽ đọc từ localStorage
```

### Browser Detection
Tự động detect ngôn ngữ trình duyệt:
```javascript
// Nếu localStorage không có, sẽ dùng browser language
// Fallback về 'vi' nếu không hỗ trợ
```

## 🚀 Best Practices

### 1. Key Naming
```javascript
// ✅ Tốt - Có cấu trúc rõ ràng
t('admin.tours.addTour')
t('forms.validation.required')
t('messages.success.created')

// ❌ Không tốt - Không có cấu trúc
t('addTour')
t('required')
t('created')
```

### 2. Interpolation
```javascript
// ✅ Tốt - Sử dụng interpolation
t('welcome', { name: 'John' })
t('items', { count: 5 })

// ❌ Không tốt - Nối chuỗi
t('welcome') + ' ' + name
```

### 3. Fallback
```javascript
// ✅ Tốt - Có fallback
t('admin.tours.title', 'Tour Management')

// ❌ Không tốt - Không có fallback
t('admin.tours.title')
```

### 4. Performance
```javascript
// ✅ Tốt - Memoize translation
const { t } = useTranslation();
const title = useMemo(() => t('admin.tours.title'), [t]);

// ❌ Không tốt - Re-render mỗi lần
const title = t('admin.tours.title');
```

## 🧪 Testing

### Demo Component
Sử dụng `I18nDemo` component để test:

```jsx
import I18nDemo from './components/I18nDemo';

// Thêm vào route để test
<Route path="/i18n-demo" element={<I18nDemo />} />
```

### Manual Testing
1. Mở ứng dụng
2. Click vào LanguageSelector trong Header
3. Chọn ngôn ngữ khác
4. Kiểm tra các text đã thay đổi
5. Refresh trang - ngôn ngữ vẫn được giữ nguyên

## 🔧 Troubleshooting

### 1. Translation không hiển thị
```javascript
// Kiểm tra key có đúng không
console.log(t('common.home'));

// Kiểm tra file translation có load không
console.log(i18n.language);
console.log(i18n.store.data);
```

### 2. Ngôn ngữ không lưu
```javascript
// Kiểm tra localStorage
console.log(localStorage.getItem('i18nextLng'));

// Force change language
i18n.changeLanguage('en');
```

### 3. Backend không nhận ngôn ngữ
```javascript
// Kiểm tra header
const headers = {
  'Accept-Language': i18n.language,
  'Content-Type': 'application/json'
};
console.log(headers);
```

## 📚 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Language Detection](https://github.com/i18next/i18next-browser-languagedetector)

## 🤝 Contributing

Khi thêm translation mới:

1. Thêm key vào tất cả 3 file: `vi.json`, `en.json`, `ja.json`
2. Sử dụng cấu trúc key nhất quán
3. Test trên tất cả ngôn ngữ
4. Cập nhật documentation nếu cần

---

**Happy Internationalization! 🌍** 