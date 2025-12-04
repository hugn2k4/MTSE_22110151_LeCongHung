# GraphQL API Documentation - Giỏ hàng (Cart)

## Endpoint

`http://localhost:8080/graphql`

## Authentication

Tất cả các query và mutation yêu cầu JWT token trong header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Schema Overview

### Types

#### Product

```graphql
type Product {
  id: Int!
  name: String!
  description: String
  price: Float!
  category: String!
  image: String
  discount: Float
  views: Int
  stock: Int
  rating: Float
}
```

#### CartItem

```graphql
type CartItem {
  id: Int!
  cartId: Int!
  productId: Int!
  quantity: Int!
  selected: Boolean!
  product: Product!
  createdAt: String!
  updatedAt: String!
}
```

#### Cart

```graphql
type Cart {
  id: Int!
  userId: Int!
  items: [CartItem!]!
  totalItems: Int!
  totalPrice: Float!
  selectedTotalPrice: Float!
  createdAt: String!
  updatedAt: String!
}
```

---

## Queries

### 1. Xem giỏ hàng (Get Cart)

**Query:**

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

**Response Success:**

```json
{
  "data": {
    "getCart": {
      "EC": 0,
      "EM": "Lấy giỏ hàng thành công",
      "data": {
        "id": 1,
        "userId": 1,
        "totalItems": 5,
        "totalPrice": 250000,
        "selectedTotalPrice": 150000,
        "items": [
          {
            "id": 1,
            "quantity": 2,
            "selected": true,
            "product": {
              "id": 1,
              "name": "Sản phẩm A",
              "price": 50000,
              "image": "image.jpg",
              "stock": 10
            }
          }
        ]
      }
    }
  }
}
```

---

## Mutations

### 1. Thêm sản phẩm vào giỏ hàng (Add to Cart)

**Mutation:**

```graphql
mutation {
  addToCart(input: { productId: 1, quantity: 2 }) {
    EC
    EM
    data {
      id
      quantity
      selected
      product {
        id
        name
        price
        stock
      }
    }
  }
}
```

**Response Success:**

```json
{
  "data": {
    "addToCart": {
      "EC": 0,
      "EM": "Thêm sản phẩm vào giỏ hàng thành công",
      "data": {
        "id": 1,
        "quantity": 2,
        "selected": false,
        "product": {
          "id": 1,
          "name": "Sản phẩm A",
          "price": 50000,
          "stock": 10
        }
      }
    }
  }
}
```

---

### 2. Cập nhật số lượng sản phẩm (Update Cart Item)

**Mutation:**

```graphql
mutation {
  updateCartItem(input: { cartItemId: 1, quantity: 5 }) {
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

**Response Success:**

```json
{
  "data": {
    "updateCartItem": {
      "EC": 0,
      "EM": "Cập nhật giỏ hàng thành công",
      "data": {
        "id": 1,
        "quantity": 5,
        "product": {
          "name": "Sản phẩm A",
          "price": 50000
        }
      }
    }
  }
}
```

---

### 3. Xóa sản phẩm khỏi giỏ hàng (Remove from Cart)

**Mutation:**

```graphql
mutation {
  removeFromCart(cartItemId: 1) {
    EC
    EM
  }
}
```

**Response Success:**

```json
{
  "data": {
    "removeFromCart": {
      "EC": 0,
      "EM": "Xóa sản phẩm khỏi giỏ hàng thành công"
    }
  }
}
```

---

### 4. Chọn sản phẩm để thanh toán (Select Cart Items)

**Mutation:**

```graphql
mutation {
  selectCartItems(input: { cartItemIds: [1, 2, 3], selected: true }) {
    EC
    EM
    data {
      id
      totalItems
      selectedTotalPrice
      items {
        id
        selected
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

**Response Success:**

```json
{
  "data": {
    "selectCartItems": {
      "EC": 0,
      "EM": "Lấy giỏ hàng thành công",
      "data": {
        "id": 1,
        "totalItems": 5,
        "selectedTotalPrice": 250000,
        "items": [
          {
            "id": 1,
            "selected": true,
            "quantity": 2,
            "product": {
              "name": "Sản phẩm A",
              "price": 50000
            }
          }
        ]
      }
    }
  }
}
```

---

### 5. Thanh toán (Checkout)

**Mutation:**

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

**Response Success:**

```json
{
  "data": {
    "checkout": {
      "EC": 0,
      "EM": "Thanh toán thành công",
      "data": {
        "totalAmount": 250000,
        "itemCount": 3,
        "selectedItems": [
          {
            "id": 1,
            "quantity": 2,
            "product": {
              "name": "Sản phẩm A",
              "price": 50000
            }
          }
        ]
      }
    }
  }
}
```

---

## Error Codes

| EC  | Description                                       |
| --- | ------------------------------------------------- |
| 0   | Thành công                                        |
| 1   | Lỗi chung (không đăng nhập, không tìm thấy, v.v.) |
| 2   | Lỗi số lượng tồn kho không đủ                     |

---

## Testing với GraphQL Playground

1. Khởi động server: `npm run dev`
2. Truy cập: `http://localhost:8080/graphql`
3. Đăng nhập để lấy JWT token:
   ```
   POST http://localhost:8080/v1/api/login
   {
     "email": "user@example.com",
     "password": "password"
   }
   ```
4. Thêm token vào HTTP Headers trong GraphQL Playground:
   ```json
   {
     "Authorization": "Bearer YOUR_JWT_TOKEN"
   }
   ```

---

## Flow hoàn chỉnh

1. **Đăng nhập** → Lấy JWT token
2. **Xem giỏ hàng** → Query `getCart`
3. **Thêm sản phẩm** → Mutation `addToCart`
4. **Cập nhật số lượng** → Mutation `updateCartItem`
5. **Chọn sản phẩm thanh toán** → Mutation `selectCartItems`
6. **Thanh toán** → Mutation `checkout`
7. **Xóa sản phẩm** → Mutation `removeFromCart`
