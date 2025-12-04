# 🛒 GraphQL API cho Giỏ hàng

## 📋 Tổng quan

Dự án này triển khai đầy đủ GraphQL API cho hệ thống giỏ hàng (Shopping Cart) với các chức năng:

✅ **Xem giỏ hàng** - Query để lấy thông tin giỏ hàng của user  
✅ **Thêm sản phẩm vào giỏ hàng** - Mutation để thêm sản phẩm  
✅ **Sửa giỏ hàng** - Mutation để cập nhật số lượng sản phẩm  
✅ **Xóa giỏ hàng** - Mutation để xóa sản phẩm khỏi giỏ  
✅ **Chọn sản phẩm thanh toán** - Mutation để chọn 1 hoặc nhiều sản phẩm  
✅ **Thanh toán** - Mutation để thanh toán các sản phẩm đã chọn

## 🏗️ Cấu trúc dự án

```
BE/
├── src/
│   ├── graphql/
│   │   ├── schema.js          # GraphQL Type Definitions
│   │   └── resolvers.js       # GraphQL Resolvers
│   ├── models/
│   │   ├── cart.js            # Cart Model
│   │   ├── cartItem.js        # CartItem Model
│   │   ├── product.js         # Product Model
│   │   ├── user.js            # User Model
│   │   └── index.js           # Model Relationships
│   ├── services/
│   │   ├── cartService.js     # Cart Business Logic
│   │   └── userService.js     # User Service
│   ├── middleware/
│   │   └── auth.js            # JWT Authentication
│   ├── config/
│   │   └── database.js        # Sequelize Config
│   └── server.js              # Main Server với Apollo
├── GRAPHQL_CART_API.md        # API Documentation
├── graphql-cart-test.html     # Web Testing Interface
└── package.json
```

## 🔧 Cài đặt

### 1. Install Dependencies

```bash
npm install apollo-server-express graphql graphql-tag --legacy-peer-deps
```

### 2. Cấu hình Database

Đảm bảo file `.env` có cấu hình:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
PORT=8080
```

### 3. Khởi động Server

```bash
npm run dev
```

Server sẽ chạy tại:

- REST API: `http://localhost:8080/v1/api/`
- GraphQL: `http://localhost:8080/graphql`

## 📊 Database Schema

### Bảng `carts`

```sql
CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Bảng `cart_items`

```sql
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🔐 Authentication

Tất cả GraphQL queries và mutations yêu cầu JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Lấy Token

```bash
POST http://localhost:8080/v1/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📖 API Documentation

### Queries

#### 1. Xem giỏ hàng

```graphql
query {
  getCart {
    EC
    EM
    data {
      id
      userId
      totalItems
      totalPrice
      selectedTotalPrice
      items {
        id
        quantity
        selected
        product {
          id
          name
          price
          image
          stock
        }
      }
    }
  }
}
```

### Mutations

#### 1. Thêm sản phẩm vào giỏ hàng

```graphql
mutation {
  addToCart(input: { productId: 1, quantity: 2 }) {
    EC
    EM
    data {
      id
      quantity
      product {
        name
        price
      }
    }
  }
}
```

#### 2. Cập nhật số lượng

```graphql
mutation {
  updateCartItem(input: { cartItemId: 1, quantity: 5 }) {
    EC
    EM
    data {
      id
      quantity
    }
  }
}
```

#### 3. Xóa sản phẩm

```graphql
mutation {
  removeFromCart(cartItemId: 1) {
    EC
    EM
  }
}
```

#### 4. Chọn sản phẩm thanh toán

```graphql
mutation {
  selectCartItems(input: { cartItemIds: [1, 2, 3], selected: true }) {
    EC
    EM
    data {
      selectedTotalPrice
      items {
        id
        selected
      }
    }
  }
}
```

#### 5. Thanh toán

```graphql
mutation {
  checkout {
    EC
    EM
    data {
      totalAmount
      itemCount
      selectedItems {
        id
        quantity
        product {
          name
          price
        }
      }
    }
  }
}
```

## 🧪 Testing

### Option 1: GraphQL Playground

1. Truy cập: `http://localhost:8080/graphql`
2. Thêm token vào HTTP Headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Option 2: Web Testing Interface

1. Mở file `graphql-cart-test.html` trong browser
2. Đăng nhập để lấy token
3. Test các chức năng bằng giao diện web

### Option 3: cURL

```bash
# Get Cart
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"query { getCart { EC EM data { totalItems } } }"}'

# Add to Cart
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"mutation { addToCart(input: {productId: 1, quantity: 2}) { EC EM } }"}'
```

## 🎯 Features

### ✨ Tính năng chính

- **Authentication**: JWT-based authentication cho tất cả operations
- **Real-time Calculations**: Tự động tính tổng tiền, tổng sản phẩm
- **Stock Management**: Kiểm tra số lượng tồn kho trước khi thêm/cập nhật
- **Transaction Support**: Sử dụng database transactions cho checkout
- **Error Handling**: Xử lý lỗi chi tiết với mã lỗi EC và thông báo EM
- **Flexible Selection**: Chọn nhiều sản phẩm để thanh toán

### 🔒 Security Features

- JWT Authentication cho tất cả GraphQL operations
- Input validation
- Rate limiting (từ REST API config)
- SQL Injection protection (Sequelize ORM)
- XSS protection (Helmet middleware)

## 📝 Error Codes

| EC  | Ý nghĩa                                           |
| --- | ------------------------------------------------- |
| 0   | Thành công                                        |
| 1   | Lỗi chung (không đăng nhập, không tìm thấy, v.v.) |
| 2   | Lỗi số lượng tồn kho không đủ                     |

## 🔄 Flow hoàn chỉnh

```
1. User đăng nhập → Nhận JWT token
2. User xem giỏ hàng → getCart query
3. User thêm sản phẩm → addToCart mutation
4. User cập nhật số lượng → updateCartItem mutation
5. User chọn sản phẩm → selectCartItems mutation
6. User thanh toán → checkout mutation
   - Kiểm tra tồn kho
   - Trừ số lượng trong kho
   - Xóa items đã thanh toán
7. User xóa sản phẩm → removeFromCart mutation
```

## 🚀 Tech Stack

- **Backend Framework**: Express.js
- **GraphQL Server**: Apollo Server Express
- **ORM**: Sequelize
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS
- **Development**: Nodemon, Babel

## 📚 Documentation Files

- `GRAPHQL_CART_API.md` - Chi tiết API documentation
- `graphql-cart-test.html` - Web-based testing interface
- `README.md` - File này

## 🤝 Contributing

Dự án này là bài tập cá nhân. Mọi đóng góp và feedback đều được chào đón!

## 📄 License

ISC

---

**Developed with ❤️ for Bài tập 07 - Công nghệ phần mềm mới**
