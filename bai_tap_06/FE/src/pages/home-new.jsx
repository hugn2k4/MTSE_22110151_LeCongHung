import { FireOutlined, SearchOutlined, TagsOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import "./home.css";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SearchOutlined style={{ fontSize: "32px" }} />,
      title: "Tìm Kiếm Thông Minh",
      description: "Fuzzy search giúp tìm chính xác ngay cả khi gõ sai chính tả",
    },
    {
      icon: <FireOutlined style={{ fontSize: "32px" }} />,
      title: "Giảm Giá HOT",
      description: "Cập nhật liên tục các deal giảm giá hấp dẫn",
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: "32px" }} />,
      title: "Tìm Kiếm Nhanh",
      description: "Kết quả tìm kiếm trong vài mili giây",
    },
    {
      icon: <TagsOutlined style={{ fontSize: "32px" }} />,
      title: "Lọc Nâng Cao",
      description: "8+ tiêu chí lọc để tìm sản phẩm hoàn hảo",
    },
  ];

  const quickSearches = [
    {
      label: "🔥 Giảm giá HOT",
      link: "/search?minDiscount=20&hasDiscount=true&sortBy=discount&sortOrder=desc",
      color: "#ff4757",
    },
    { label: "⚡ Bán chạy nhất", link: "/search?minViews=500&sortBy=views&sortOrder=desc", color: "#ffa502" },
    { label: "⭐ Đánh giá cao", link: "/search?minRating=4.5&sortBy=rating&sortOrder=desc", color: "#2ed573" },
    { label: "💰 Giá tốt", link: "/search?maxPrice=500000&sortBy=price&sortOrder=asc", color: "#1e90ff" },
  ];

  const categories = [
    { name: "Thời trang", icon: "👔", count: "100+", color: "#ff6b6b" },
    { name: "Điện tử", icon: "💻", count: "150+", color: "#4ecdc4" },
    { name: "Sách", icon: "📚", count: "200+", color: "#95a5a6" },
    { name: "Gia dụng", icon: "🏠", count: "80+", color: "#f39c12" },
    { name: "Thể thao", icon: "⚽", count: "120+", color: "#3498db" },
    { name: "Làm đẹp", icon: "💄", count: "90+", color: "#e91e63" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tìm Kiếm Sản Phẩm <span className="gradient-text">Thông Minh</span>
          </h1>
          <p className="hero-subtitle">Sử dụng công nghệ Fuzzy Search và AI để tìm sản phẩm hoàn hảo trong tích tắc</p>

          <div className="hero-search">
            <div className="search-box-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm... (VD: tai nghe, giày, sách)"
                className="hero-search-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/search?q=${e.target.value}`);
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                className="hero-search-btn"
                onClick={() => {
                  const input = document.querySelector(".hero-search-input");
                  navigate(`/search?q=${input.value}`);
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          <div className="quick-search-tags">
            <span className="tags-label">Tìm kiếm phổ biến:</span>
            {quickSearches.map((item, index) => (
              <Button
                key={index}
                className="quick-tag"
                style={{ borderColor: item.color, color: item.color }}
                onClick={() => navigate(item.link)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="hero-stats">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Sản phẩm"
                value={1000}
                suffix="+"
                valueStyle={{ color: "#667eea", fontWeight: "bold" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="Danh mục" value={6} valueStyle={{ color: "#764ba2", fontWeight: "bold" }} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Tìm kiếm/ngày"
                value={5000}
                suffix="+"
                valueStyle={{ color: "#ff6b6b", fontWeight: "bold" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Độ chính xác"
                value={99}
                suffix="%"
                valueStyle={{ color: "#2ed573", fontWeight: "bold" }}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-container">
          <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Danh Mục Nổi Bật</h2>
          <Row gutter={[16, 16]}>
            {categories.map((cat, index) => (
              <Col xs={12} sm={8} lg={4} key={index}>
                <Card
                  className="category-card"
                  hoverable
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
                  style={{ borderColor: cat.color }}
                >
                  <div className="category-icon" style={{ background: `${cat.color}20` }}>
                    <span style={{ fontSize: "48px" }}>{cat.icon}</span>
                  </div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-count" style={{ color: cat.color }}>
                    {cat.count} sản phẩm
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sẵn sàng khám phá?</h2>
          <p className="cta-subtitle">Hàng ngàn sản phẩm đang chờ bạn tìm kiếm</p>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={() => navigate("/search")}
            className="cta-button"
          >
            Bắt đầu tìm kiếm ngay
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="section-container">
          <h2 className="section-title">Sản Phẩm Mới Nhất</h2>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
