import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, InputNumber, message, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { getProductDetailApi } from "../util/api";
import cartAPI from "../util/graphql.client";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const resp = await getProductDetailApi(id);
      if (resp && resp.EC === 0) {
        setProduct(resp.data);
      } else {
        message.error(resp?.EM || "Không tải được sản phẩm");
      }
    } catch (e) {
      console.error("Load product error", e);
      message.error("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      const response = await cartAPI.addToCart(parseInt(id), quantity);

      if (response.EC === 0) {
        message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
        setQuantity(1); // Reset quantity
      } else {
        message.error(response.EM || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      message.error("Lỗi khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Card>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 400px" }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 400,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                Không có hình ảnh
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 28, marginBottom: 16 }}>{product.name}</h1>
            <div style={{ fontSize: 32, color: "#ff4d4f", fontWeight: 700, marginBottom: 24 }}>
              {product.price?.toLocaleString()} VND
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Danh mục">{product.category}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
              <Descriptions.Item label="Mã sản phẩm">#{product.id}</Descriptions.Item>
              {product.stock !== undefined && (
                <Descriptions.Item label="Tồn kho">
                  <span style={{ color: product.stock > 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
                    {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
                  </span>
                </Descriptions.Item>
              )}
              {product.discount > 0 && (
                <Descriptions.Item label="Giảm giá">
                  <span style={{ color: "#ff4d4f", fontWeight: 600 }}>{product.discount}%</span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Ngày tạo">
                {new Date(product.created_at).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Số lượng:</div>
                <InputNumber
                  min={1}
                  max={product.stock || 999}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  size="large"
                  style={{ width: 120 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={!product.stock || product.stock === 0}
                  style={{ width: "100%", maxWidth: 250 }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
              <Button
                size="large"
                onClick={handleBuyNow}
                disabled={!product.stock || product.stock === 0}
                style={{ width: "100%", maxWidth: 150 }}
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
