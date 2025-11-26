# 🚀 Hướng Dẫn Sử Dụng Nhanh - Fuzzy Search

## ✅ Đã Hoàn Thành

### Backend

- ✅ Model Product với các trường: discount, views, stock, rating
- ✅ API `/api/products/search` với fuzzy search (Fuse.js)
- ✅ Hỗ trợ lọc theo: category, price, discount, views, rating, stock
- ✅ Sắp xếp và phân trang

### Frontend

- ✅ Trang tìm kiếm `/search` với UI đẹp (Ant Design)
- ✅ Thanh tìm kiếm fuzzy search
- ✅ Quick filters (Giảm giá HOT, Phổ biến, Đánh giá cao, Giá rẻ)
- ✅ Advanced filters (Category, Price range, Discount, Views, Rating, Sort)
- ✅ Hiển thị kết quả với pagination
- ✅ Component ProductList đã cập nhật hiển thị đầy đủ thông tin

## 🎯 Cách Chạy

### 1. Backend

```bash
cd BE
npm install
npm run dev
```

→ Server chạy tại http://localhost:8080

### 2. Frontend

```bash
cd FE
npm install
npm run dev
```

→ App chạy tại http://localhost:5173

### 3. Truy cập

- Trang chủ: http://localhost:5173
- Trang tìm kiếm: http://localhost:5173/search
- Hoặc click "🔍 Tìm Kiếm" trên menu

## 🔍 Các Tính Năng Chính

### 1. Fuzzy Search (Tìm kiếm mờ)

- Nhập "tai nghe" → Tìm thấy "Tai nghe Bluetooth ANC"
- Nhập "tay nghe" (sai chính tả) → Vẫn tìm thấy
- Nhập "giay" → Tìm thấy "Giày thể thao"

### 2. Lọc Nhanh (Quick Filters)

- **🔥 Giảm giá HOT**: Sản phẩm giảm >= 20%
- **👁️ Phổ biến**: Sản phẩm views >= 500
- **⭐ Đánh giá cao**: Sản phẩm rating >= 4.5
- **💰 Giá rẻ**: Sản phẩm <= 500k

### 3. Bộ Lọc Nâng Cao

- **Danh mục**: Thời trang, Điện tử, Sách, Gia dụng, Thể thao, Làm đẹp
- **Khoảng giá**: Min/Max
- **Giảm giá tối thiểu**: Phần trăm
- **Lượt xem tối thiểu**: Số lượt
- **Đánh giá tối thiểu**: 0-5 sao
- **Sắp xếp**: Price, Views, Rating, Discount
- **Checkboxes**: Chỉ giảm giá, Chỉ còn hàng

## 📱 Ví Dụ Sử Dụng

### Ví dụ 1: Tìm tai nghe

1. Vào `/search`
2. Nhập "tai nghe"
3. Nhấn Enter hoặc click "Tìm kiếm"

### Ví dụ 2: Tìm sản phẩm điện tử giá rẻ

1. Vào `/search`
2. Chọn danh mục: "Điện tử"
3. Set giá tối đa: 1000000
4. Sort by: Price (Tăng dần)
5. Click "Áp dụng bộ lọc"

### Ví dụ 3: Tìm deal HOT

1. Vào `/search`
2. Click button "🔥 Giảm giá HOT"
3. Tự động filter và hiển thị sản phẩm giảm giá cao

### Ví dụ 4: Tìm sản phẩm phổ biến

1. Vào `/search`
2. Click button "👁️ Phổ biến"
3. Hiển thị sản phẩm nhiều lượt xem nhất

## 🧪 Test API Trực Tiếp

### Test 1: Tìm kiếm đơn giản

```bash
curl "http://localhost:8080/api/products/search?q=tai%20nghe"
```

### Test 2: Lọc theo category

```bash
curl "http://localhost:8080/api/products/search?category=Điện%20tử"
```

### Test 3: Lọc theo giá

```bash
curl "http://localhost:8080/api/products/search?minPrice=100000&maxPrice=500000"
```

### Test 4: Sản phẩm có giảm giá

```bash
curl "http://localhost:8080/api/products/search?hasDiscount=true&sortBy=discount&sortOrder=desc"
```

### Test 5: Kết hợp nhiều filter

```bash
curl "http://localhost:8080/api/products/search?q=giày&category=Thời%20trang&maxPrice=800000&hasDiscount=true&sortBy=price&sortOrder=asc"
```

## 📊 Dữ Liệu Mẫu

Hệ thống tự động tạo 27 sản phẩm mẫu khi chạy lần đầu:

- 6 danh mục
- Giá: 120k - 3.5tr
- Discount: 0-35%
- Views: 89-1234
- Stock: 12-150
- Rating: 4.2-4.9

## 🎨 Giao Diện

### Home Page

- Banner search gradient đẹp
- Button CTA "Bắt đầu tìm kiếm"
- Danh sách sản phẩm với thông tin đầy đủ

### Search Page

- Input search lớn
- 4 quick filter buttons
- Advanced filters có thể expand/collapse
- Grid sản phẩm responsive (1-4 columns tùy màn hình)
- Pagination
- Hiển thị tổng kết quả và thời gian search

### Product Card

- Hình ảnh
- Tags (Category + Discount%)
- Tên + Mô tả
- Giá (màu đỏ nổi bật)
- Stats bar: ⭐ Rating | 👁️ Views | 📦 Stock

## 🐛 Xử Lý Lỗi

### Lỗi: Backend không chạy

```bash
cd BE
npm run dev
```

### Lỗi: Frontend không tìm thấy API

- Check file `.env` trong FE có `VITE_BACKEND_URL=http://localhost:8080`
- Check CORS config trong BE

### Lỗi: Không có dữ liệu

- Xóa database và restart backend
- Hệ thống sẽ tự tạo dữ liệu mẫu

### Lỗi: Module not found 'fuse.js'

```bash
cd BE
npm install fuse.js
```

## 📚 Tài Liệu Chi Tiết

- **FUZZY_SEARCH_API.md**: Chi tiết về API
- **TEST_CASES.md**: Các test case đầy đủ
- **README_FUZZY_SEARCH_IMPLEMENTATION.md**: Hướng dẫn implementation đầy đủ
- **fuzzy-search-demo.html**: Demo standalone (mở trực tiếp bằng browser)

## 🎓 Công Nghệ Sử Dụng

### Backend

- Node.js + Express
- Sequelize ORM
- MySQL
- Fuse.js (Fuzzy Search)
- JWT Authentication
- Rate Limiting

### Frontend

- React 18
- React Router v6
- Ant Design
- Axios
- Vite

## ✨ Điểm Nổi Bật

1. **Fuzzy Search Thông Minh**: Tìm được cả khi gõ sai chính tả
2. **Lọc Đa Dạng**: 8+ tiêu chí lọc khác nhau
3. **UI/UX Đẹp**: Ant Design components, responsive
4. **Performance Tốt**: Response time < 500ms
5. **Code Sạch**: Component-based, reusable
6. **Full Documentation**: API docs, test cases, guides

## 🎯 Use Cases Thực Tế

1. **E-commerce**: Tìm sản phẩm cho khách hàng
2. **Deal Site**: Tìm khuyến mãi hot
3. **Comparison**: So sánh giá, rating
4. **Analytics**: Theo dõi sản phẩm phổ biến
5. **Admin**: Quản lý inventory

---

**Prepared by:** AI Assistant  
**Date:** November 26, 2025  
**Status:** ✅ Ready to Use
