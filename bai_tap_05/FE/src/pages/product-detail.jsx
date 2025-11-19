import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetailApi } from "../util/api";
import { Button, Spin, Card, Descriptions, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
              <Descriptions.Item label="Ngày tạo">
                {new Date(product.created_at).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Button type="primary" size="large" style={{ marginRight: 8 }}>
                Thêm vào giỏ hàng
              </Button>
              <Button size="large">Mua ngay</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
