# 🎨 Hướng Dẫn Sử Dụng Tính Năng Tìm Kiếm

## 📋 Tổng Quan

Ứng dụng đã được cập nhật với:

- ✅ **Tailwind CSS** - Framework CSS hiện đại
- ✅ **Header đẹp mắt** - Responsive, gradient, sticky navigation
- ✅ **Giao diện tìm kiếm chuyên nghiệp** - Card hiệu ứng, animation mượt mà
- ✅ **Bộ lọc thông minh** - Hoạt động chính xác với nhiều điều kiện

## 🚀 Khởi Chạy Ứng Dụng

### Backend

```bash
cd BE
npm install
npm start
```

Server chạy tại: http://localhost:8080

### Frontend

```bash
cd FE
npm install
npm run dev
```

App chạy tại: http://localhost:5173

## 🎯 Tính Năng Chính

### 1. Header Navigation

- **Logo** với gradient màu xanh-tím
- **Menu Desktop**: Trang chủ, Tìm kiếm, Người dùng
- **Menu Mobile**: Bottom navigation responsive
- **User Menu**: Avatar, dropdown với đăng nhập/đăng xuất
- **Shopping Cart**: Badge hiển thị số lượng

### 2. Tìm Kiếm Fuzzy Search

#### Tìm kiếm văn bản

```
VD: "tai nghe" → Tìm "Tai nghe Bluetooth ANC"
    "giay the thao" → Tìm "Giày thể thao"
    "sach" → Tìm các sản phẩm sách
```

**Đặc điểm:**

- Cho phép sai chính tả
- Tìm kiếm trong tên và mô tả sản phẩm
- Kết quả theo độ phù hợp (threshold 0.4)

### 3. Bộ Lọc Nâng Cao

#### 📂 Danh Mục

- Tất cả
- Thời trang 👔
- Điện tử 💻
- Sách 📚
- Gia dụng 🏠
- Thể thao ⚽
- Làm đẹp 💄

**Cách dùng:** Click vào category button để lọc

#### 💰 Khoảng Giá

- Slider từ 0 → 5.000.000 VND
- Bước nhảy: 100.000 VND
- Hiển thị realtime khi kéo

**VD:** Lọc sản phẩm từ 200k - 1.000k

#### 🎯 Giảm Giá

- **Tất cả**: Không lọc discount
- **Từ 10%**: Sản phẩm giảm ≥ 10%
- **Từ 20%**: Sản phẩm giảm ≥ 20%
- **Từ 30%**: Sản phẩm giảm ≥ 30%

**Checkbox "Có giảm giá":** Lọc chỉ sản phẩm đang giảm giá (> 0%)

#### ⭐ Đánh Giá

- Từ 5 sao
- Từ 4.5 sao
- Từ 4 sao
- Từ 3.5 sao

**Cách dùng:** Click button để toggle filter

#### 📊 Bộ Lọc Khác

- **Chỉ còn hàng**: Lọc sản phẩm stock > 0
- **Có giảm giá**: Lọc sản phẩm discount > 0

### 4. Quick Filters (Lọc Nhanh)

Các nút lọc nhanh ở đầu trang:

#### 🔥 Giảm giá HOT

- Lọc: discount ≥ 20%
- Sắp xếp: Giảm giá nhiều nhất

#### ⚡ Bán chạy

- Lọc: views ≥ 500
- Sắp xếp: Lượt xem cao nhất

#### 🏆 Đánh giá cao

- Lọc: rating ≥ 4.5
- Sắp xếp: Đánh giá cao nhất

#### 🏷️ Giá tốt

- Lọc: Giá 0 - 500k
- Sắp xếp: Giá thấp đến cao

### 5. Sắp Xếp Kết Quả

- **Mặc định**: Theo ID giảm dần
- **Giá thấp đến cao**: price ASC
- **Giá cao đến thấp**: price DESC
- **Phổ biến nhất**: views DESC
- **Đánh giá cao**: rating DESC
- **Giảm giá nhiều**: discount DESC

### 6. Chế Độ Xem

- **Grid View** 🔲: Hiển thị dạng lưới (4 cột desktop)
- **List View** ☰: Hiển thị dạng danh sách (1 cột)

## 🎨 Giao Diện

### Desktop (≥ 1024px)

- Sidebar filters bên trái (6 cột)
- Grid sản phẩm bên phải (18 cột)
- Sticky header và filter sidebar
- Product cards 4 cột (grid) hoặc full width (list)

### Tablet (768px - 1023px)

- Filter trong drawer (slide từ trái)
- Grid 3-4 cột
- Bottom navigation

### Mobile (< 768px)

- Bottom navigation bar
- Filter trong drawer
- Grid 2 cột hoặc 1 cột (list)
- Touch-friendly buttons

## 🔧 Kỹ Thuật

### Frontend

- **React 18** + **Vite**
- **Ant Design** - UI components
- **Tailwind CSS** - Utility-first CSS
- **React Router v6** - Routing
- **Axios** - API calls

### Backend

- **Node.js** + **Express**
- **Sequelize ORM** - Database
- **Fuse.js** - Fuzzy search
- **MySQL** - Database

### Styling

- Gradient backgrounds
- Card hover effects (scale, shadow)
- Smooth animations (fadeIn, shimmer)
- Custom scrollbar
- Responsive breakpoints

## 📊 API Endpoint

### GET /api/products/search

**Query Parameters:**

```
q          - Từ khóa tìm kiếm (fuzzy)
category   - Danh mục (exact match)
minPrice   - Giá tối thiểu
maxPrice   - Giá tối đa
minDiscount - % giảm giá tối thiểu
hasDiscount - true/false
minViews   - Lượt xem tối thiểu
minRating  - Đánh giá tối thiểu
inStock    - true/false
sortBy     - Trường sắp xếp
sortOrder  - ASC/DESC
page       - Trang hiện tại
limit      - Số item/trang
```

**Response:**

```json
{
  "EC": 0,
  "EM": "Success",
  "data": {
    "items": [...],
    "total": 27,
    "page": 1,
    "limit": 12,
    "totalPages": 3,
    "filters": {...}
  }
}
```

## 🧪 Test Cases

### 1. Tìm kiếm cơ bản

```
Input: "tai nghe"
Expect: Hiển thị tai nghe và các sản phẩm liên quan
```

### 2. Kết hợp filters

```
Category: Điện tử
Price: 0 - 2.000.000
Discount: ≥ 20%
Expect: Sản phẩm điện tử giá dưới 2tr, giảm giá ≥ 20%
```

### 3. Quick filter

```
Click: "Giảm giá HOT"
Expect:
  - minDiscount = 20%
  - hasDiscount = true
  - Sort by discount DESC
```

### 4. Responsive

```
Resize: < 768px
Expect:
  - Bottom navigation hiển thị
  - Filter button xuất hiện
  - Drawer hoạt động
```

## 🎯 Tips Sử Dụng

1. **Tìm kiếm mờ**: Không cần gõ chính xác, hệ thống sẽ tìm sản phẩm gần đúng
2. **Kết hợp filters**: Có thể dùng nhiều filter cùng lúc
3. **Quick filters**: Dùng cho các tìm kiếm phổ biến
4. **Clear filters**: Click "Xóa tất cả" để reset
5. **Mobile**: Vuốt drawer từ trái sang để mở filters

## 🐛 Debug

Nếu có lỗi:

1. **Check console**: F12 → Console tab
2. **Network tab**: Xem API response
3. **Backend logs**: Terminal chạy BE
4. **Clear cache**: Ctrl+F5

## 📝 Changelog

### v2.0 - Latest

- ✅ Thêm Tailwind CSS
- ✅ Header mới với gradient
- ✅ Cải thiện UI/UX
- ✅ Fix logic bộ lọc
- ✅ Responsive hoàn chỉnh
- ✅ Animations mượt mà

### v1.0 - Initial

- Fuzzy search với Fuse.js
- Basic filters
- Ant Design UI
- Pagination

## 🚀 Production Deploy

### Build Frontend

```bash
cd FE
npm run build
# Output: dist/
```

### Environment Variables

```env
# Backend
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_db
DB_USER=root
DB_PASSWORD=password

# Frontend
VITE_API_URL=http://localhost:8080
```

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. Node.js version ≥ 16
2. npm install đã chạy
3. Database đã connect
4. Port 8080 và 5173 available

---

**Developed with ❤️ using React + Tailwind + Ant Design**
