import {
  ArrowLeftOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Rate,
  Row,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { getProductDetailApi } from "../util/api";
import cartAPI, { commentsAPI, favoritesAPI, productsAPI } from "../util/graphql.client";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [stats, setStats] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProduct();
    loadProductStats();
    loadSimilarProducts();
    loadComments();
    checkFavoriteStatus();
    recordView();
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

  const checkFavoriteStatus = async () => {
    if (!auth.isAuthenticated) return;
    try {
      const response = await favoritesAPI.checkFavorite(parseInt(id));
      if (response.EC === 0) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch (error) {
      console.error("Check favorite error:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!auth.isAuthenticated) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        const response = await favoritesAPI.removeFavorite(parseInt(id));
        if (response.EC === 0) {
          setIsFavorite(false);
          message.success("Đã xóa khỏi yêu thích");
          loadProductStats(); // Refresh stats
        }
      } else {
        const response = await favoritesAPI.addFavorite(parseInt(id));
        if (response.EC === 0) {
          setIsFavorite(true);
          message.success("Đã thêm vào yêu thích");
          loadProductStats(); // Refresh stats
        }
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  const loadProductStats = async () => {
    try {
      const response = await productsAPI.getProductStats(parseInt(id));
      if (response.EC === 0) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Load stats error:", error);
    }
  };

  const loadSimilarProducts = async () => {
    try {
      const response = await productsAPI.getSimilarProducts(parseInt(id), 6);
      if (response.EC === 0) {
        setSimilarProducts(response.data || []);
      }
    } catch (error) {
      console.error("Load similar products error:", error);
    }
  };

  const loadComments = async (page = 1) => {
    try {
      setLoadingComments(true);
      const response = await commentsAPI.getProductComments(parseInt(id), page, 5);
      if (response.EC === 0) {
        setComments(response.data.comments);
        setCommentsPage(response.data.currentPage);
        setCommentsTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Load comments error:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const recordView = async () => {
    try {
      await productsAPI.recordProductView(parseInt(id));
    } catch (error) {
      console.error("Record view error:", error);
    }
  };

  const handleAddComment = async (values) => {
    if (!auth.isAuthenticated) {
      message.warning("Vui lòng đăng nhập để bình luận");
      navigate("/login");
      return;
    }

    try {
      const response = await commentsAPI.addComment(parseInt(id), values.content, values.rating);
      if (response.EC === 0) {
        message.success("Đã thêm bình luận");
        form.resetFields();
        loadComments(1);
        loadProductStats();
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      console.error("Add comment error:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await commentsAPI.deleteComment(commentId);
      if (response.EC === 0) {
        message.success("Đã xóa bình luận");
        loadComments(commentsPage);
        loadProductStats();
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      message.error("Có lỗi xảy ra");
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
        <Row gutter={32}>
          <Col xs={24} md={10}>
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
          </Col>

          <Col xs={24} md={14}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Title level={2} style={{ marginBottom: 16 }}>
                {product.name}
              </Title>
              <Button
                type="text"
                size="large"
                icon={
                  isFavorite ? (
                    <HeartFilled style={{ color: "#ff4d4f", fontSize: 24 }} />
                  ) : (
                    <HeartOutlined style={{ fontSize: 24 }} />
                  )
                }
                onClick={handleToggleFavorite}
              />
            </div>

            <div
              style={{
                fontSize: 32,
                color: "#ff4d4f",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {product.price?.toLocaleString()} VND
            </div>

            {/* Product Stats */}
            {stats && (
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Statistic title="Lượt xem" value={stats.viewCount || 0} prefix={<EyeOutlined />} />
                </Col>
                <Col span={6}>
                  <Statistic title="Đã mua" value={stats.purchaseCount || 0} prefix={<ShoppingOutlined />} />
                </Col>
                <Col span={6}>
                  <Statistic title="Bình luận" value={stats.commentCount || 0} prefix={<MessageOutlined />} />
                </Col>
                <Col span={6}>
                  <Statistic title="Yêu thích" value={stats.favoriteCount || 0} prefix={<HeartOutlined />} />
                </Col>
              </Row>
            )}

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Danh mục">
                <Tag color="blue">{product.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
              {product.stock !== undefined && (
                <Descriptions.Item label="Tồn kho">
                  <span
                    style={{
                      color: product.stock > 0 ? "#52c41a" : "#ff4d4f",
                      fontWeight: 600,
                    }}
                  >
                    {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
                  </span>
                </Descriptions.Item>
              )}
              {product.discount > 0 && (
                <Descriptions.Item label="Giảm giá">
                  <Tag color="red">{product.discount}%</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
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
              <div style={{ flex: 1, minWidth: 200 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={!product.stock || product.stock === 0}
                  block
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
              <Button
                size="large"
                onClick={handleBuyNow}
                disabled={!product.stock || product.stock === 0}
                style={{ minWidth: 120 }}
              >
                Mua ngay
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Card title="Sản phẩm tương tự" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {similarProducts.map((item) => (
              <Col key={item.id} xs={12} sm={8} md={6} lg={4}>
                <Card
                  hoverable
                  cover={<img alt={item.name} src={item.image} style={{ height: 150, objectFit: "cover" }} />}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <Card.Meta
                    title={
                      <Text ellipsis style={{ fontSize: 14 }}>
                        {item.name}
                      </Text>
                    }
                    description={
                      <Text strong style={{ color: "#ff4d4f" }}>
                        {item.price?.toLocaleString()} VND
                      </Text>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Comments Section */}
      <Card title={`Đánh giá sản phẩm (${stats?.commentCount || 0})`} style={{ marginTop: 24 }}>
        {/* Add Comment Form */}
        {auth.isAuthenticated && (
          <Form form={form} onFinish={handleAddComment} layout="vertical">
            <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn đánh giá" }]}>
              <Rate />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung" },
                { min: 10, message: "Nội dung tối thiểu 10 ký tự" },
              ]}
            >
              <TextArea rows={4} placeholder="Nhập đánh giá của bạn..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>
        )}

        <Divider />

        {/* Comments List */}
        <List
          loading={loadingComments}
          dataSource={comments}
          locale={{ emptyText: "Chưa có đánh giá nào" }}
          pagination={
            commentsTotalPages > 1
              ? {
                  current: commentsPage,
                  total: commentsTotalPages * 5,
                  pageSize: 5,
                  onChange: loadComments,
                }
              : false
          }
          renderItem={(comment) => (
            <List.Item
              actions={
                auth.user?.id === comment.userId
                  ? [
                      <Button type="link" danger onClick={() => handleDeleteComment(comment.id)}>
                        Xóa
                      </Button>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={
                  <div>
                    <Text strong>{comment.user?.name || "Người dùng"}</Text>
                    <Rate disabled value={comment.rating} style={{ marginLeft: 16, fontSize: 14 }} />
                  </div>
                }
                description={
                  <div>
                    <Paragraph>{comment.content}</Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(comment.createdAt).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ProductDetailPage;
