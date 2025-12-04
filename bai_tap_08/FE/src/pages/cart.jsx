import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Empty, InputNumber, message, Popconfirm, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import cartAPI from "../util/graphql.client";

const CartPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();

      if (response.EC === 0 && response.data) {
        // Transform data để phù hợp với format của thư viện
        const transformedItems = response.data.items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image || "https://via.placeholder.com/100",
          quantity: item.quantity,
          selected: item.selected,
          stock: item.product.stock,
          description: item.product.description,
          discount: item.product.discount || 0,
        }));

        setCartData({
          items: transformedItems,
          totalItems: response.data.totalItems,
          totalPrice: response.data.totalPrice,
          selectedTotalPrice: response.data.selectedTotalPrice,
        });
      } else {
        message.error(response.EM || "Không thể lấy giỏ hàng");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      message.error("Lỗi khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login");
      return;
    }
    fetchCart();
  }, [auth.isAuthenticated]);

  // Handle update quantity
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await cartAPI.updateCartItem(cartItemId, newQuantity);

      if (response.EC === 0) {
        message.success("Cập nhật số lượng thành công");
        await fetchCart(); // Reload cart
      } else {
        message.error(response.EM || "Không thể cập nhật");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Lỗi khi cập nhật số lượng");
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await cartAPI.removeFromCart(cartItemId);

      if (response.EC === 0) {
        message.success("Đã xóa sản phẩm khỏi giỏ hàng");
        await fetchCart(); // Reload cart
      } else {
        message.error(response.EM || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Lỗi khi xóa sản phẩm");
    }
  };

  // Handle select items
  const handleSelectItems = async (cartItemIds, selected) => {
    try {
      const response = await cartAPI.selectCartItems(cartItemIds, selected);

      if (response.EC === 0) {
        await fetchCart(); // Reload cart to update selection
      } else {
        message.error(response.EM || "Không thể cập nhật lựa chọn");
      }
    } catch (error) {
      console.error("Error selecting items:", error);
      message.error("Lỗi khi chọn sản phẩm");
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const response = await cartAPI.checkout();

      if (response.EC === 0 && response.data) {
        message.success(
          `Thanh toán thành công ${response.data.itemCount} sản phẩm. ` +
            `Tổng tiền: ${response.data.totalAmount.toLocaleString("vi-VN")} VNĐ`
        );
        await fetchCart(); // Reload cart
      } else {
        message.error(response.EM || "Không thể thanh toán");
      }
    } catch (error) {
      console.error("Error checking out:", error);
      message.error("Lỗi khi thanh toán");
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading && !cartData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  const allSelected = cartData?.items.length > 0 && cartData.items.every((item) => item.selected);

  const selectedItems = cartData?.items.filter((item) => item.selected) || [];
  const selectedCount = selectedItems.length;

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "24px",
        minHeight: "calc(100vh - 64px)",
        background: "#f5f7fa",
      }}
    >
      {/* Header */}
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: 0,
            color: "#667eea",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <ShoppingCartOutlined /> Giỏ hàng của bạn
        </h1>
      </Card>

      {cartData && cartData.items.length > 0 ? (
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          {/* Cart Items */}
          <div style={{ flex: 1 }}>
            {/* Select All */}
            <Card
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            >
              <Checkbox
                checked={allSelected}
                onChange={(e) => {
                  const allItemIds = cartData.items.map((item) => item.id);
                  handleSelectItems(allItemIds, e.target.checked);
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "16px" }}>
                  Chọn tất cả ({cartData.items.length} sản phẩm)
                </span>
              </Checkbox>
            </Card>

            {/* Cart Items List */}
            {cartData.items.map((item) => (
              <Card
                key={item.id}
                style={{
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: item.selected ? "2px solid #667eea" : "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  {/* Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={item.selected}
                      onChange={(e) => handleSelectItems([item.id], e.target.checked)}
                    />
                  </div>

                  {/* Image */}
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => handleProductClick(item.productId)}
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "18px",
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "#333",
                      }}
                      onClick={() => handleProductClick(item.productId)}
                    >
                      {item.name}
                    </h3>
                    {item.description && (
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                    <div style={{ marginBottom: "12px" }}>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#ff4d4f",
                        }}
                      >
                        {item.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                      {item.discount > 0 && (
                        <span
                          style={{
                            marginLeft: "12px",
                            fontSize: "14px",
                            color: "#ff4d4f",
                            background: "#fff1f0",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px" }}>Tồn kho: {item.stock} sản phẩm</div>
                  </div>

                  {/* Quantity & Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      minWidth: "150px",
                    }}
                  >
                    {/* Quantity Control */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => {
                          if (item.quantity > 1) {
                            handleUpdateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        disabled={item.quantity <= 1}
                      />
                      <InputNumber
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(value) => {
                          if (value && value >= 1 && value <= item.stock) {
                            handleUpdateQuantity(item.id, value);
                          }
                        }}
                        style={{ width: "60px" }}
                      />
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          if (item.quantity < item.stock) {
                            handleUpdateQuantity(item.id, item.quantity + 1);
                          }
                        }}
                        disabled={item.quantity >= item.stock}
                      />
                    </div>

                    {/* Subtotal */}
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#667eea",
                      }}
                    >
                      {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </div>

                    {/* Delete Button */}
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có chắc muốn xóa sản phẩm này?"
                      onConfirm={() => handleRemoveItem(item.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} size="small">
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card
            style={{
              width: "350px",
              position: "sticky",
              top: "80px",
              borderRadius: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Tóm tắt đơn hàng
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Tổng sản phẩm:</span>
                <span style={{ fontWeight: 600 }}>{cartData.totalItems}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Đã chọn:</span>
                <span style={{ fontWeight: 600, color: "#667eea" }}>{selectedCount} sản phẩm</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>Tổng tiền hàng:</span>
                <span style={{ fontWeight: 600 }}>{cartData.totalPrice.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "1px solid #f0f0f0",
                  marginTop: "16px",
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 600 }}>Tổng thanh toán:</span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                  }}
                >
                  {cartData.selectedTotalPrice.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              style={{
                height: "50px",
                fontSize: "16px",
                fontWeight: "bold",
                background: selectedCount === 0 ? undefined : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              Thanh toán ({selectedCount})
            </Button>

            <Button size="large" block onClick={() => navigate("/")} style={{ marginTop: "12px", height: "50px" }}>
              Tiếp tục mua sắm
            </Button>
          </Card>
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: "60px 20px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <h2 style={{ color: "#666", marginBottom: "16px" }}>Giỏ hàng trống</h2>
                <p style={{ marginBottom: "24px", color: "#999" }}>
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                height: "45px",
                padding: "0 32px",
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default CartPage;
