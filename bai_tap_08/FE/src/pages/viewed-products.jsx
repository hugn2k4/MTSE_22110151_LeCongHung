import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, message, Pagination, Row, Spin, Tag, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import cartAPI, { productsAPI } from "../util/graphql.client";

const { Title, Text } = Typography;

const ViewedProductsPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    if (!auth.isAuthenticated) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }
    loadViewedProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadViewedProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productsAPI.getViewedProducts(page, pageSize);
      if (response.EC === 0 && response.data) {
        setProducts(response.data.products || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
      } else {
        message.error(response.EM || "Không thể tải danh sách sản phẩm đã xem");
      }
    } catch (error) {
      console.error("Load viewed products error:", error);
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      const response = await cartAPI.addToCart(productId, 1);
      if (response.EC === 0) {
        message.success("Đã thêm vào giỏ hàng");
      } else {
        message.error(response.EM || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadViewedProducts(page);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>
          <EyeOutlined style={{ marginRight: 8 }} />
          Sản phẩm đã xem
        </Title>
        <Text type="secondary">{totalItems} sản phẩm</Text>
      </div>

      {products.length === 0 ? (
        <Empty description="Bạn chưa xem sản phẩm nào" style={{ marginTop: 60 }}>
          <Button type="primary" onClick={() => navigate("/")}>
            Khám phá sản phẩm
          </Button>
        </Empty>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{ position: "relative", cursor: "pointer" }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                        }}
                      />
                      {product.discount > 0 && (
                        <Tag
                          color="red"
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          -{product.discount}%
                        </Tag>
                      )}
                      <Tag
                        color="blue"
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                        }}
                      >
                        <EyeOutlined /> {product.views || 0}
                      </Tag>
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={!product.stock || product.stock === 0}
                    >
                      Thêm giỏ hàng
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Text ellipsis={{ rows: 2 }} style={{ height: 44, fontSize: 15 }}>
                        {product.name}
                      </Text>
                    }
                    description={
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#ff4d4f",
                            marginBottom: 8,
                          }}
                        >
                          {product.price?.toLocaleString()} VND
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Tag color={product.stock > 0 ? "green" : "red"}>
                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {product.lastViewedAt ? new Date(product.lastViewedAt).toLocaleDateString("vi-VN") : ""}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewedProductsPage;
