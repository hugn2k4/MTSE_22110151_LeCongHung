import {
  AppstoreOutlined,
  BarsOutlined,
  ClearOutlined,
  EyeOutlined,
  FilterOutlined,
  FireOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Empty,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchProductsApi } from "../util/api";
import "./search.css";

const { Option } = Select;

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode
  const [viewMode, setViewMode] = useState("grid");
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [minDiscount, setMinDiscount] = useState(searchParams.get("minDiscount") || "");
  const [hasDiscount, setHasDiscount] = useState(searchParams.get("hasDiscount") === "true");
  const [minViews, setMinViews] = useState(searchParams.get("minViews") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "id");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "DESC");

  // Results state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [pageSize] = useState(12);
  const [searchTime, setSearchTime] = useState(0);

  const categories = [
    { name: "Thời trang", icon: "👔", color: "#ff6b6b" },
    { name: "Điện tử", icon: "💻", color: "#4ecdc4" },
    { name: "Sách", icon: "📚", color: "#95a5a6" },
    { name: "Gia dụng", icon: "🏠", color: "#f39c12" },
    { name: "Thể thao", icon: "⚽", color: "#3498db" },
    { name: "Làm đẹp", icon: "💄", color: "#e91e63" },
  ];

  const performSearch = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const filters = {
        q: searchQuery || undefined,
        category: category || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 5000000 ? priceRange[1] : undefined,
        minDiscount: minDiscount ? Number(minDiscount) : undefined,
        hasDiscount: hasDiscount || undefined,
        minViews: minViews ? Number(minViews) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        inStock: inStock || undefined,
        sortBy: sortBy || "id",
        sortOrder: sortOrder || "DESC",
        page: currentPage,
        limit: pageSize,
      };

      // Loại bỏ các giá trị undefined
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined || filters[key] === null || filters[key] === "") {
          delete filters[key];
        }
      });

      console.log("Search filters:", filters);
      const response = await searchProductsApi(filters);

      if (response && response.EC === 0) {
        setProducts(response.data.items || []);
        setTotal(response.data.total || 0);
        setSearchTime(((Date.now() - startTime) / 1000).toFixed(2));
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    updateURLParams();
    performSearch();
    setDrawerVisible(false);
  };

  const updateURLParams = () => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 5000000) params.maxPrice = priceRange[1];
    if (minDiscount) params.minDiscount = minDiscount;
    if (hasDiscount) params.hasDiscount = "true";
    if (minViews) params.minViews = minViews;
    if (minRating) params.minRating = minRating;
    if (inStock) params.inStock = "true";
    if (sortBy !== "id") params.sortBy = sortBy;
    if (sortOrder !== "DESC") params.sortOrder = sortOrder;
    params.page = currentPage;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setPriceRange([0, 5000000]);
    setMinDiscount("");
    setHasDiscount(false);
    setMinViews("");
    setMinRating("");
    setInStock(false);
    setSortBy("id");
    setSortOrder("DESC");
    setCurrentPage(1);
    setSearchParams({});
    setProducts([]);
    setTotal(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickFilters = [
    {
      label: "Giảm giá HOT",
      icon: <FireOutlined />,
      color: "#ff4757",
      onClick: () => {
        setMinDiscount("20");
        setHasDiscount(true);
        setSortBy("discount");
        setSortOrder("DESC");
        setTimeout(handleSearch, 100);
      },
    },
    {
      label: "Bán chạy",
      icon: <ThunderboltOutlined />,
      color: "#ffa502",
      onClick: () => {
        setMinViews("500");
        setSortBy("views");
        setSortOrder("DESC");
        setTimeout(handleSearch, 100);
      },
    },
    {
      label: "Đánh giá cao",
      icon: <TrophyOutlined />,
      color: "#2ed573",
      onClick: () => {
        setMinRating("4.5");
        setSortBy("rating");
        setSortOrder("DESC");
        setTimeout(handleSearch, 100);
      },
    },
    {
      label: "Giá tốt",
      icon: <TagsOutlined />,
      color: "#1e90ff",
      onClick: () => {
        setPriceRange([0, 500000]);
        setSortBy("price");
        setSortOrder("ASC");
        setTimeout(handleSearch, 100);
      },
    },
  ];

  const FilterPanel = () => (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 className="filter-title">
          <AppstoreOutlined /> Danh mục
        </h3>
        <div className="category-grid">
          <Button className={!category ? "category-btn active" : "category-btn"} onClick={() => setCategory("")} block>
            <span className="category-icon">🏷️</span>
            <span>Tất cả</span>
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.name}
              className={category === cat.name ? "category-btn active" : "category-btn"}
              onClick={() => setCategory(cat.name)}
              block
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Divider />

      <div className="filter-section">
        <h3 className="filter-title">💰 Khoảng giá</h3>
        <Slider
          range
          min={0}
          max={5000000}
          step={100000}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{
            formatter: (value) => `${(value / 1000).toFixed(0)}k`,
          }}
        />
        <div className="price-display">
          <span>{(priceRange[0] / 1000).toFixed(0)}k VND</span>
          <span>-</span>
          <span>{(priceRange[1] / 1000).toFixed(0)}k VND</span>
        </div>
      </div>

      <Divider />

      <div className="filter-section">
        <h3 className="filter-title">🎯 Giảm giá</h3>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio.Group value={minDiscount} onChange={(e) => setMinDiscount(e.target.value)} style={{ width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Radio value="">Tất cả</Radio>
              <Radio value="10">Từ 10%</Radio>
              <Radio value="20">Từ 20%</Radio>
              <Radio value="30">Từ 30%</Radio>
            </Space>
          </Radio.Group>
        </Space>
      </div>

      <Divider />

      <div className="filter-section">
        <h3 className="filter-title">⭐ Đánh giá</h3>
        <Space direction="vertical" style={{ width: "100%" }}>
          {[5, 4.5, 4, 3.5].map((rating) => (
            <Button
              key={rating}
              className={minRating === String(rating) ? "rating-btn active" : "rating-btn"}
              onClick={() => setMinRating(minRating === String(rating) ? "" : String(rating))}
              block
            >
              <Space>
                {[...Array(Math.floor(rating))].map((_, i) => (
                  <StarFilled key={i} style={{ color: "#faad14" }} />
                ))}
                {rating % 1 !== 0 && <StarOutlined style={{ color: "#faad14" }} />}
                <span>từ {rating} sao</span>
              </Space>
            </Button>
          ))}
        </Space>
      </div>

      <Divider />

      <div className="filter-section">
        <h3 className="filter-title">📊 Khác</h3>
        <Space direction="vertical">
          <Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)}>
            Chỉ còn hàng
          </Checkbox>
          <Checkbox checked={hasDiscount} onChange={(e) => setHasDiscount(e.target.checked)}>
            Có giảm giá
          </Checkbox>
        </Space>
      </div>

      <Divider />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} block size="large">
          Áp dụng bộ lọc
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleClearFilters} block>
          Xóa tất cả
        </Button>
      </Space>
    </div>
  );

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="header-top">
          <h1 className="page-title">
            <SearchOutlined />
            <span>Tìm kiếm sản phẩm</span>
          </h1>
          <div className="results-count">
            <Badge count={products.length} showZero style={{ backgroundColor: "#52c41a" }} />
            <span>kết quả</span>
          </div>
        </div>

        <Input.Search
          placeholder="Nhập tên hoặc mô tả sản phẩm để tìm kiếm..."
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          enterButton="Tìm kiếm"
          allowClear
          className="search-input"
        />

        <div className="quick-filters">
          {quickFilters.map((filter, index) => (
            <Button key={index} className="quick-filter-btn" icon={filter.icon} onClick={filter.onClick}>
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="search-container">
        <Row gutter={[28, 24]}>
          {/* Sidebar - Desktop Only */}
          <Col xs={0} sm={0} md={0} lg={7} xl={6}>
            <div className="sidebar-filters">
              <div className="filter-header">
                <FilterOutlined />
                <h2>Bộ lọc tìm kiếm</h2>
              </div>
              <FilterPanel />
            </div>
          </Col>

          {/* Main Products Area */}
          <Col xs={24} sm={24} md={24} lg={17} xl={18}>
            {/* Mobile Filter Toggle */}
            <div className="mobile-filter-toggle">
              <Button icon={<FilterOutlined />} onClick={() => setDrawerVisible(true)} size="large" block>
                Hiển thị bộ lọc
              </Button>
            </div>

            {/* Results Header */}
            {products.length > 0 && (
              <div className="results-header">
                <div className="results-left">
                  <div className="results-badge">
                    <Badge count={total} overflowCount={999} showZero style={{ backgroundColor: "#1890ff" }} />
                    <span>sản phẩm</span>
                  </div>
                  <Divider type="vertical" />
                  <div className="search-time">
                    <ThunderboltOutlined style={{ color: "#faad14" }} />
                    <span>{searchTime}s</span>
                  </div>
                </div>
                <div className="results-right">
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(value) => {
                      const [by, order] = value.split("-");
                      setSortBy(by);
                      setSortOrder(order);
                      setTimeout(handleSearch, 100);
                    }}
                    style={{ minWidth: 180 }}
                    placeholder="Sắp xếp theo"
                  >
                    <Option value="id-DESC">🎯 Mặc định</Option>
                    <Option value="price-ASC">💰 Giá tăng dần</Option>
                    <Option value="price-DESC">💎 Giá giảm dần</Option>
                    <Option value="views-DESC">🔥 Phổ biến nhất</Option>
                    <Option value="rating-DESC">⭐ Đánh giá cao</Option>
                    <Option value="discount-DESC">🎁 Giảm giá nhiều</Option>
                  </Select>
                  <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                    <Radio.Button value="grid">
                      <AppstoreOutlined />
                    </Radio.Button>
                    <Radio.Button value="list">
                      <BarsOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <Spin size="large" tip="Đang tìm kiếm sản phẩm..." />
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <Row gutter={[20, 20]}>
                  {products.map((product) => (
                    <Col
                      key={product.id}
                      xs={24}
                      sm={viewMode === "grid" ? 12 : 24}
                      md={viewMode === "grid" ? 8 : 24}
                      lg={viewMode === "grid" ? 8 : 24}
                      xl={viewMode === "grid" ? 6 : 24}
                    >
                      <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                        <div className="product-image-wrapper">
                          <img src={product.image} alt={product.name} className="product-image" />
                          {product.discount > 0 && <div className="discount-badge">🔥 -{product.discount}%</div>}
                          {product.stock === 0 && (
                            <div className="out-of-stock-overlay">
                              <span>Hết hàng</span>
                            </div>
                          )}
                          <div className="product-overlay">
                            <EyeOutlined style={{ fontSize: "24px" }} />
                          </div>
                        </div>
                        <div className="product-content">
                          <div className="product-tags">
                            <Tag color="blue">{product.category}</Tag>
                            {product.rating >= 4.5 && <Tag color="gold">⭐ Best</Tag>}
                          </div>

                          <h3 className="product-name">{product.name}</h3>

                          <div className="product-rating">
                            {[...Array(5)].map((_, i) => (
                              <StarFilled
                                key={i}
                                style={{ color: i < Math.floor(product.rating) ? "#faad14" : "#d9d9d9" }}
                              />
                            ))}
                            <span className="rating-value">{product.rating}</span>
                            <span className="views-count">
                              <EyeOutlined /> {product.views}
                            </span>
                          </div>

                          <div className="product-footer">
                            <div className="product-price">
                              <div className="current-price">{(product.price / 1000).toFixed(0)}k VND</div>
                              {product.discount > 0 && (
                                <div className="original-price">
                                  {(product.price / (1 - product.discount / 100) / 1000).toFixed(0)}k
                                </div>
                              )}
                            </div>

                            {product.stock > 0 ? (
                              <Tag color="success">Còn {product.stock}</Tag>
                            ) : (
                              <Tag color="error">Hết hàng</Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `Tổng ${total} sản phẩm`}
                    showQuickJumper
                  />
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="empty-state">
                <Empty
                  description={
                    <div className="empty-description">
                      <h3>Không tìm thấy sản phẩm</h3>
                      <p>Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={handleClearFilters} size="large">
                    🔄 Xóa tất cả bộ lọc
                  </Button>
                </Empty>
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title={
          <div className="drawer-title">
            <FilterOutlined style={{ color: "#1890ff" }} />
            <span>Bộ lọc tìm kiếm</span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
      >
        <FilterPanel />
      </Drawer>
    </div>
  );
};

export default SearchPage;
