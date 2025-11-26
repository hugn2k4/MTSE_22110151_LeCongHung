# Test Cases - Fuzzy Search API

## Các Test Case để kiểm tra chức năng

### 1. Test Fuzzy Search (Tìm kiếm mờ)

#### Test 1.1: Tìm kiếm chính xác

```bash
curl "http://localhost:8080/api/products/search?q=tai%20nghe"
```

**Expected**: Tìm thấy "Tai nghe Bluetooth ANC"

#### Test 1.2: Tìm kiếm với lỗi chính tả

```bash
curl "http://localhost:8080/api/products/search?q=tay%20nghe"
```

**Expected**: Vẫn tìm thấy "Tai nghe Bluetooth ANC" (fuzzy match)

#### Test 1.3: Tìm kiếm một phần

```bash
curl "http://localhost:8080/api/products/search?q=giay"
```

**Expected**: Tìm thấy "Giày thể thao"

### 2. Test Filter theo Danh mục

#### Test 2.1: Lọc sản phẩm Điện tử

```bash
curl "http://localhost:8080/api/products/search?category=Điện%20tử"
```

**Expected**: Chỉ hiển thị sản phẩm điện tử (Tai nghe, Sạc dự phòng, Chuột, Bàn phím, etc.)

#### Test 2.2: Lọc sản phẩm Thời trang

```bash
curl "http://localhost:8080/api/products/search?category=Thời%20trang"
```

**Expected**: Chỉ hiển thị áo, quần, giày, túi, váy

### 3. Test Filter theo Giá

#### Test 3.1: Lọc sản phẩm giá 100k - 500k

```bash
curl "http://localhost:8080/api/products/search?minPrice=100000&maxPrice=500000"
```

**Expected**: Chỉ hiển thị sản phẩm trong khoảng giá này

#### Test 3.2: Lọc sản phẩm dưới 200k

```bash
curl "http://localhost:8080/api/products/search?maxPrice=200000"
```

**Expected**: Sách, Son môi, Áo thun, Bóng đá

#### Test 3.3: Lọc sản phẩm trên 1 triệu

```bash
curl "http://localhost:8080/api/products/search?minPrice=1000000"
```

**Expected**: Đồng hồ thông minh, Tai nghe ANC, Túi xách da, Bộ nồi, Xe đạp

### 4. Test Filter theo Khuyến mãi

#### Test 4.1: Lọc sản phẩm có giảm giá

```bash
curl "http://localhost:8080/api/products/search?hasDiscount=true"
```

**Expected**: Tất cả sản phẩm có discount > 0

#### Test 4.2: Lọc sản phẩm giảm giá >= 20%

```bash
curl "http://localhost:8080/api/products/search?minDiscount=20"
```

**Expected**: Váy dạ hội (20%), Giày (25%), Tai nghe (30%), Đồng hồ (35%), etc.

#### Test 4.3: Lọc sản phẩm giảm giá cao nhất

```bash
curl "http://localhost:8080/api/products/search?minDiscount=30&sortBy=discount&sortOrder=desc"
```

**Expected**: Đồng hồ thông minh (35%), Tai nghe ANC (30%)

### 5. Test Filter theo Lượt xem

#### Test 5.1: Sản phẩm HOT (>500 views)

```bash
curl "http://localhost:8080/api/products/search?minViews=500"
```

**Expected**: Tai nghe (890), Đồng hồ (1234), Sách Clean Code (567), etc.

#### Test 5.2: Sản phẩm phổ biến nhất

```bash
curl "http://localhost:8080/api/products/search?sortBy=views&sortOrder=desc&limit=5"
```

**Expected**: Top 5 sản phẩm có views cao nhất

### 6. Test Filter theo Đánh giá

#### Test 6.1: Sản phẩm đánh giá cao (>= 4.5)

```bash
curl "http://localhost:8080/api/products/search?minRating=4.5"
```

**Expected**: Các sản phẩm có rating >= 4.5

#### Test 6.2: Sản phẩm tốt nhất

```bash
curl "http://localhost:8080/api/products/search?minRating=4.8&sortBy=rating&sortOrder=desc"
```

**Expected**: Đồng hồ (4.9), Tai nghe (4.9), Bàn phím (4.8), etc.

### 7. Test Filter Kết hợp

#### Test 7.1: Điện tử có giảm giá, giá dưới 1 triệu

```bash
curl "http://localhost:8080/api/products/search?category=Điện%20tử&hasDiscount=true&maxPrice=1000000"
```

**Expected**: Sạc dự phòng, Chuột gaming, Bàn phím, Webcam

#### Test 7.2: Tìm "áo" trong Thời trang, giá 100k-500k, có giảm giá

```bash
curl "http://localhost:8080/api/products/search?q=áo&category=Thời%20trang&minPrice=100000&maxPrice=500000&hasDiscount=true"
```

**Expected**: Áo thun, Áo sơ mi (nếu có giảm giá)

#### Test 7.3: Sản phẩm HOT (nhiều view, đánh giá cao)

```bash
curl "http://localhost:8080/api/products/search?minViews=500&minRating=4.5&sortBy=views&sortOrder=desc"
```

**Expected**: Đồng hồ thông minh, Tai nghe ANC, etc.

### 8. Test Sorting

#### Test 8.1: Sắp xếp theo giá tăng dần

```bash
curl "http://localhost:8080/api/products/search?sortBy=price&sortOrder=asc&limit=5"
```

**Expected**: Áo thun (120k), Son môi (180k), Sách NodeJS (180k)...

#### Test 8.2: Sắp xếp theo giá giảm dần

```bash
curl "http://localhost:8080/api/products/search?sortBy=price&sortOrder=desc&limit=5"
```

**Expected**: Xe đạp (3.5tr), Đồng hồ (2.1tr), Tai nghe (1.45tr)...

#### Test 8.3: Sắp xếp theo lượt xem

```bash
curl "http://localhost:8080/api/products/search?sortBy=views&sortOrder=desc&limit=5"
```

**Expected**: Top 5 sản phẩm nhiều lượt xem nhất

#### Test 8.4: Sắp xếp theo giảm giá

```bash
curl "http://localhost:8080/api/products/search?sortBy=discount&sortOrder=desc&limit=5"
```

**Expected**: Đồng hồ (35%), Tai nghe (30%), Giày (25%)...

### 9. Test Pagination

#### Test 9.1: Trang 1, 6 items/page

```bash
curl "http://localhost:8080/api/products/search?page=1&limit=6"
```

**Expected**: 6 sản phẩm đầu tiên, totalPages tính toán đúng

#### Test 9.2: Trang 2, 6 items/page

```bash
curl "http://localhost:8080/api/products/search?page=2&limit=6"
```

**Expected**: 6 sản phẩm tiếp theo

### 10. Test Stock Filter

#### Test 10.1: Chỉ sản phẩm còn hàng

```bash
curl "http://localhost:8080/api/products/search?inStock=true"
```

**Expected**: Tất cả sản phẩm có stock > 0

### 11. Test Edge Cases

#### Test 11.1: Tìm kiếm chuỗi rỗng

```bash
curl "http://localhost:8080/api/products/search?q="
```

**Expected**: Trả về tất cả sản phẩm

#### Test 11.2: Tìm kiếm không tồn tại

```bash
curl "http://localhost:8080/api/products/search?q=xyz123abc"
```

**Expected**: Không tìm thấy sản phẩm nào (items: [])

#### Test 11.3: Filter không hợp lệ

```bash
curl "http://localhost:8080/api/products/search?minPrice=10000000"
```

**Expected**: Không có sản phẩm nào thỏa mãn

### 12. Test Complex Scenarios

#### Test 12.1: Tìm quà tặng giá rẻ

```bash
curl "http://localhost:8080/api/products/search?maxPrice=300000&hasDiscount=true&minRating=4.0&sortBy=discount&sortOrder=desc"
```

**Expected**: Sản phẩm giá rẻ, có giảm giá, đánh giá tốt

#### Test 12.2: Tìm sản phẩm cao cấp

```bash
curl "http://localhost:8080/api/products/search?minPrice=2000000&minRating=4.8"
```

**Expected**: Xe đạp, Đồng hồ thông minh

#### Test 12.3: Tìm deal hot

```bash
curl "http://localhost:8080/api/products/search?minDiscount=25&inStock=true&sortBy=discount&sortOrder=desc"
```

**Expected**: Sản phẩm giảm giá mạnh, còn hàng

## Test với Postman

### Collection Variables

```json
{
  "baseUrl": "http://localhost:8080/api",
  "searchEndpoint": "/products/search"
}
```

### Test Scripts

```javascript
// Test response structure
pm.test("Response has correct structure", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("EC");
  pm.expect(response).to.have.property("EM");
  pm.expect(response).to.have.property("data");
});

// Test success code
pm.test("Success code is 0", function () {
  const response = pm.response.json();
  pm.expect(response.EC).to.equal(0);
});

// Test data structure
pm.test("Data has required fields", function () {
  const data = pm.response.json().data;
  pm.expect(data).to.have.property("items");
  pm.expect(data).to.have.property("total");
  pm.expect(data).to.have.property("page");
  pm.expect(data).to.have.property("limit");
});

// Test product structure
pm.test("Products have required fields", function () {
  const items = pm.response.json().data.items;
  if (items.length > 0) {
    const product = items[0];
    pm.expect(product).to.have.property("name");
    pm.expect(product).to.have.property("price");
    pm.expect(product).to.have.property("category");
    pm.expect(product).to.have.property("discount");
    pm.expect(product).to.have.property("views");
    pm.expect(product).to.have.property("stock");
    pm.expect(product).to.have.property("rating");
  }
});
```

## Performance Tests

### Load Test

```bash
# Using Apache Bench
ab -n 1000 -c 10 "http://localhost:8080/api/products/search?q=tai%20nghe"
```

### Stress Test

```bash
# Test with complex filters
ab -n 500 -c 5 "http://localhost:8080/api/products/search?q=áo&category=Thời%20trang&minPrice=100000&maxPrice=500000&hasDiscount=true&minRating=4.0&sortBy=price&sortOrder=asc"
```

## Expected Results Summary

- ✅ Fuzzy search phải hoạt động với lỗi chính tả (threshold 0.4)
- ✅ Filter theo category phải chính xác 100%
- ✅ Price range filter phải bao gồm min và max
- ✅ Discount filter phải lọc đúng sản phẩm
- ✅ Sorting phải hoạt động với tất cả các trường
- ✅ Pagination phải tính toán đúng totalPages
- ✅ Response time < 500ms cho hầu hết queries
- ✅ API phải handle edge cases một cách graceful
