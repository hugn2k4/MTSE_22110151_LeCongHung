import { HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, message, Pagination, Row, Spin, Tag, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import cartAPI, { favoritesAPI } from "../util/graphql.client";

const { Title, Text } = Typography;

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
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
    loadFavorites(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async (page = 1) => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getFavorites(page, pageSize);
      if (response.EC === 0 && response.data) {
        setFavorites(response.data.favorites || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
      } else {
        message.error(response.EM || "Không thể tải danh sách yêu thích");
      }
    } catch (error) {
      console.error("Load favorites error:", error);
      message.error("Có lỗi xảy ra khi tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await favoritesAPI.removeFavorite(productId);
      if (response.EC === 0) {
        message.success("Đã xóa khỏi yêu thích");
        // Reload current page
        loadFavorites(currentPage);
      } else {
        message.error(response.EM || "Không thể xóa");
      }
    } catch (error) {
      console.error("Remove favorite error:", error);
      message.error("Có lỗi xảy ra");
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
    loadFavorites(page);
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
          <HeartFilled style={{ color: "#ff4d4f", marginRight: 8 }} />
          Sản phẩm yêu thích
        </Title>
        <Text type="secondary">{totalItems} sản phẩm</Text>
      </div>

      {favorites.length === 0 ? (
        <Empty description="Bạn chưa có sản phẩm yêu thích nào" style={{ marginTop: 60 }}>
          <Button type="primary" onClick={() => navigate("/")}>
            Khám phá sản phẩm
          </Button>
        </Empty>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {favorites.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{ position: "relative", cursor: "pointer" }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      <img
                        alt={item.product?.name}
                        src={item.product?.image}
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                        }}
                      />
                      {item.product?.discount > 0 && (
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
                          -{item.product.discount}%
                        </Tag>
                      )}
                    </div>
                  }
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<HeartFilled />}
                      onClick={() => handleRemoveFavorite(item.productId)}
                    >
                      Bỏ thích
                    </Button>,
                    <Button
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => handleAddToCart(item.productId, e)}
                      disabled={!item.product?.stock || item.product?.stock === 0}
                    >
                      Giỏ hàng
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Text ellipsis={{ rows: 2 }} style={{ height: 44, fontSize: 15 }}>
                        {item.product?.name}
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
                          {item.product?.price?.toLocaleString()} VND
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Tag color={item.product?.stock > 0 ? "green" : "red"}>
                            {item.product?.stock > 0 ? "Còn hàng" : "Hết hàng"}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.product?.category}
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

export default FavoritesPage;
