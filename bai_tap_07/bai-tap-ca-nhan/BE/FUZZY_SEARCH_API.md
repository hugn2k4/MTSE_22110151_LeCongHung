# API Tìm Kiếm Sản Phẩm với Fuzzy Search

## Tổng Quan

API này cung cấp chức năng tìm kiếm và lọc sản phẩm nâng cao sử dụng **Fuzzy Search** (thư viện Fuse.js) và hỗ trợ nhiều điều kiện lọc.

## Endpoint

```
GET /api/products/search
```

## Các Tính Năng

### 1. Fuzzy Search (Tìm kiếm mờ)

- Tìm kiếm theo tên và mô tả sản phẩm
- Hỗ trợ tìm kiếm không chính xác (chấp nhận lỗi chính tả)
- Ưu tiên tên sản phẩm (70%) hơn mô tả (30%)

### 2. Lọc theo nhiều điều kiện

- **Danh mục** (category)
- **Khoảng giá** (minPrice, maxPrice)
- **Khuyến mãi** (minDiscount, hasDiscount)
- **Lượt xem** (minViews)
- **Đánh giá** (minRating)
- **Tồn kho** (inStock)

### 3. Sắp xếp

- Theo giá (price)
- Theo lượt xem (views)
- Theo đánh giá (rating)
- Theo khuyến mãi (discount)
- Theo ngày tạo (created_at)

### 4. Phân trang

- Hỗ trợ phân trang với page và limit

## Parameters

| Parameter     | Type    | Description                     | Example                                |
| ------------- | ------- | ------------------------------- | -------------------------------------- |
| `q`           | string  | Từ khóa tìm kiếm (fuzzy search) | `tai nghe`                             |
| `category`    | string  | Lọc theo danh mục               | `Điện tử`                              |
| `minPrice`    | number  | Giá tối thiểu                   | `100000`                               |
| `maxPrice`    | number  | Giá tối đa                      | `1000000`                              |
| `minDiscount` | number  | Phần trăm giảm giá tối thiểu    | `10`                                   |
| `hasDiscount` | boolean | Chỉ lấy sản phẩm có khuyến mãi  | `true`                                 |
| `minViews`    | number  | Lượt xem tối thiểu              | `500`                                  |
| `minRating`   | number  | Đánh giá tối thiểu (0-5)        | `4.5`                                  |
| `inStock`     | boolean | Chỉ lấy sản phẩm còn hàng       | `true`                                 |
| `sortBy`      | string  | Sắp xếp theo trường             | `price`, `views`, `rating`, `discount` |
| `sortOrder`   | string  | Thứ tự sắp xếp                  | `asc`, `desc`                          |
| `page`        | number  | Trang hiện tại                  | `1`                                    |
| `limit`       | number  | Số sản phẩm mỗi trang           | `12`                                   |

## Ví Dụ Sử Dụng

### 1. Tìm kiếm fuzzy đơn giản

```
GET /api/products/search?q=tai nghe
```

Tìm tất cả sản phẩm có từ "tai nghe" trong tên hoặc mô tả (hỗ trợ lỗi chính tả).

### 2. Tìm kiếm theo danh mục

```
GET /api/products/search?category=Điện tử
```

### 3. Lọc theo khoảng giá

```
GET /api/products/search?minPrice=500000&maxPrice=2000000
```

### 4. Lọc sản phẩm có khuyến mãi

```
GET /api/products/search?hasDiscount=true
```

### 5. Lọc sản phẩm có giảm giá ít nhất 20%

```
GET /api/products/search?minDiscount=20
```

### 6. Lọc sản phẩm phổ biến (nhiều lượt xem)

```
GET /api/products/search?minViews=500&sortBy=views&sortOrder=desc
```

### 7. Lọc sản phẩm đánh giá cao

```
GET /api/products/search?minRating=4.5&sortBy=rating&sortOrder=desc
```

### 8. Lọc sản phẩm còn hàng

```
GET /api/products/search?inStock=true
```

### 9. Tìm kiếm kết hợp nhiều điều kiện

```
GET /api/products/search?q=áo&category=Thời trang&minPrice=100000&maxPrice=500000&hasDiscount=true&inStock=true&sortBy=price&sortOrder=asc&page=1&limit=12
```

Tìm áo trong danh mục Thời trang, giá từ 100k-500k, có khuyến mãi, còn hàng, sắp xếp theo giá tăng dần.

### 10. Tìm sản phẩm điện tử HOT (nhiều lượt xem, đánh giá cao)

```
GET /api/products/search?category=Điện tử&minViews=500&minRating=4.5&sortBy=views&sortOrder=desc
```

## Response Format

### Thành công (200 OK)

```json
{
  "EC": 0,
  "EM": "Tìm kiếm thành công",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Tai nghe Bluetooth ANC",
        "description": "Tai nghe không dây chống ồn chủ động, pin 30h",
        "price": 1450000,
        "category": "Điện tử",
        "image": "https://picsum.photos/800/500?random=2",
        "discount": 30,
        "views": 890,
        "stock": 60,
        "rating": 4.9,
        "created_at": "2025-11-26T10:00:00.000Z",
        "updated_at": "2025-11-26T10:00:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 12,
    "totalPages": 3,
    "filters": {
      "q": "tai nghe",
      "category": "Điện tử",
      "minPrice": null,
      "maxPrice": null,
      "minDiscount": null,
      "hasDiscount": null,
      "minViews": null,
      "minRating": null,
      "inStock": null,
      "sortBy": "id",
      "sortOrder": "DESC"
    }
  }
}
```

### Lỗi (500 Internal Server Error)

```json
{
  "EC": 1,
  "EM": "Lỗi server"
}
```

## Cách Hoạt Động

### 1. Fuzzy Search

- Sử dụng thư viện **Fuse.js**
- Threshold: 0.4 (0.0 = khớp hoàn toàn, 1.0 = khớp mọi thứ)
- Tìm kiếm trên 2 trường: `name` (70%) và `description` (30%)
- Độ dài tối thiểu: 2 ký tự

### 2. Quy Trình Xử Lý

1. Lọc theo điều kiện database (category, price, discount, views, rating, stock)
2. Áp dụng fuzzy search nếu có từ khóa tìm kiếm
3. Sắp xếp kết quả
4. Phân trang

### 3. Model Database

```javascript
{
  id: INTEGER (Primary Key),
  name: STRING(255),
  description: TEXT,
  price: FLOAT,
  category: STRING(100),
  image: STRING(500),
  discount: FLOAT (0-100),
  views: INTEGER,
  stock: INTEGER,
  rating: FLOAT (0-5),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

## Danh Mục Sản Phẩm

- Thời trang
- Điện tử
- Sách
- Gia dụng
- Thể thao
- Làm đẹp

## Use Cases

### 1. Trang tìm kiếm chính

```javascript
// Tìm kiếm với từ khóa người dùng nhập
fetch("/api/products/search?q=" + searchQuery);
```

### 2. Bộ lọc nâng cao

```javascript
// Kết hợp nhiều filter
const params = new URLSearchParams({
  category: selectedCategory,
  minPrice: minPrice,
  maxPrice: maxPrice,
  hasDiscount: showDiscountOnly,
  sortBy: "price",
  sortOrder: "asc",
});
fetch("/api/products/search?" + params);
```

### 3. Sản phẩm HOT/Trending

```javascript
// Lấy sản phẩm nhiều lượt xem nhất
fetch("/api/products/search?minViews=500&sortBy=views&sortOrder=desc&limit=10");
```

### 4. Sản phẩm khuyến mãi

```javascript
// Lấy sản phẩm giảm giá cao
fetch("/api/products/search?minDiscount=20&sortBy=discount&sortOrder=desc");
```

### 5. Sản phẩm bán chạy

```javascript
// Lấy sản phẩm đánh giá cao và nhiều lượt xem
fetch("/api/products/search?minRating=4.5&minViews=300&sortBy=views&sortOrder=desc");
```

## Testing với cURL

```bash
# Tìm kiếm đơn giản
curl "http://localhost:8080/api/products/search?q=tai%20nghe"

# Lọc theo danh mục
curl "http://localhost:8080/api/products/search?category=Điện%20tử"

# Lọc theo giá
curl "http://localhost:8080/api/products/search?minPrice=100000&maxPrice=1000000"

# Lọc sản phẩm có khuyến mãi
curl "http://localhost:8080/api/products/search?hasDiscount=true&sortBy=discount&sortOrder=desc"

# Lọc sản phẩm HOT
curl "http://localhost:8080/api/products/search?minViews=500&minRating=4.5&sortBy=views&sortOrder=desc"

# Tìm kiếm kết hợp
curl "http://localhost:8080/api/products/search?q=giày&category=Thời%20trang&minPrice=200000&maxPrice=800000&inStock=true&sortBy=price&sortOrder=asc"
```

## Performance

- Fuzzy search được thực hiện trên dữ liệu đã lọc từ database
- Phân trang giúp giảm tải dữ liệu trả về
- Index trên các trường thường xuyên query (category, price, discount, views)

## Lưu Ý

1. Fuzzy search hoạt động tốt nhất với từ khóa tiếng Việt có dấu
2. Threshold 0.4 cho phép sai lệch vừa phải (1-2 ký tự sai)
3. Nên kết hợp nhiều filter để có kết quả chính xác hơn
4. Sử dụng pagination để tránh tải quá nhiều dữ liệu
5. Rate limiting được áp dụng cho tất cả API endpoints

## Dependencies

- **fuse.js**: ^7.0.0 - Fuzzy search library
- **sequelize**: ^6.37.7 - ORM for database
- **express**: ^5.1.0 - Web framework
