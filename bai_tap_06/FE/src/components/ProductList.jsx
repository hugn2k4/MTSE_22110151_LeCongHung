import { EyeOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../util/api";

const ProductCard = ({ p }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{
        width: 280,
        margin: 12,
        borderRadius: "16px",
        overflow: "hidden",
        border: "2px solid #e8e8e8",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
      styles={{
        body: { padding: "20px" },
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.3)";
        e.currentTarget.style.borderColor = "#667eea";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor = "#e8e8e8";
      }}
      cover={
        <div style={{ height: 200, overflow: "hidden", background: "#f5f5f5" }}>
          {p.image ? (
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Không có hình
            </div>
          )}
        </div>
      }
    >
      <div style={{ minHeight: 120 }}>
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              background: "#1890ff",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 12,
              marginRight: 4,
            }}
          >
            {p.category}
          </span>
          {p.discount > 0 && (
            <span
              style={{
                background: "#ff4d4f",
                color: "white",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              -{p.discount}%
            </span>
          )}
        </div>
        <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600 }}>{p.name}</h4>
        <div
          style={{
            color: "#666",
            fontSize: 13,
            marginBottom: 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {p.description}
        </div>
        <div style={{ fontSize: 18, color: "#ff4d4f", fontWeight: 700, marginBottom: 8 }}>
          {p.price?.toLocaleString()} VND
        </div>
        {(p.rating !== undefined || p.views !== undefined || p.stock !== undefined) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              padding: "8px 0",
              borderTop: "1px solid #f0f0f0",
              fontSize: 12,
              color: "#666",
            }}
          >
            {p.rating !== undefined && <span>⭐ {p.rating}</span>}
            {p.views !== undefined && <span>👁️ {p.views}</span>}
            {p.stock !== undefined && <span>📦 {p.stock}</span>}
          </div>
        )}
        <Button type="primary" icon={<EyeOutlined />} block onClick={() => navigate(`/product/${p.id}`)}>
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
};

const ProductList = () => {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const observer = useRef();

  useEffect(() => {
    // initial load
    resetAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loading) return;
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (scrolledToBottom) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, nextCursor]);

  const resetAndLoad = () => {
    setProducts([]);
    setPage(1);
    setNextCursor(null);
    setHasMore(true);
    load({ reset: true });
  };

  const load = async ({ reset = false } = {}) => {
    try {
      setLoading(true);
      // If we have a cursor we prefer cursor-based infinite load
      const cursor = reset ? null : nextCursor;
      const resp = await getProductsApi(category || undefined, page, limit, cursor);
      if (resp && resp.EC === 0) {
        const data = resp.data;
        // cursor response
        if (data.nextCursor !== undefined) {
          const items = data.items || [];
          setProducts((prev) => (reset ? items : [...prev, ...items]));
          setNextCursor(data.nextCursor);
          setHasMore(!!data.nextCursor && items.length >= limit);
        } else {
          // pagination response
          const items = data.items || [];
          setProducts((prev) => (reset ? items : [...prev, ...items]));
          const total = data.total || 0;
          const nextPage = reset ? 2 : page + 1;
          setPage(nextPage);
          setHasMore((reset ? items.length : products.length + items.length) < total);
        }
      }
    } catch (e) {
      console.error("Load products error", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loading) return;
    // if using cursor, page parameter is ignored on backend when cursor present
    load();
  };

  // for manual pagination fallback
  const handleLoadMoreButton = () => {
    loadMore();
  };

  // derive categories from loaded products (quick demo) and include defaults without duplicates
  const defaultCategories = ["Thời trang", "Điện tử", "Sách"];
  const categories = Array.from(new Set([...products.map((p) => p.category).filter(Boolean), ...defaultCategories]));

  return (
    <div>
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          borderRadius: "12px",
          border: "2px solid #e8e8e8",
        }}
      >
        <label
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#333",
          }}
        >
          📂 Danh mục:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px 16px",
            fontSize: 15,
            borderRadius: 8,
            border: "2px solid #d9d9d9",
            minWidth: 180,
            background: "white",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          <option value="">🏷️ Tất cả</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {products.length === 0 && !loading ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "80px 40px",
              fontSize: 18,
              color: "#999",
              background: "#f5f5f5",
              borderRadius: "16px",
            }}
          >
            📦 Không có sản phẩm
          </div>
        ) : null}
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          marginBottom: 24,
        }}
      >
        {loading ? (
          <div
            style={{
              fontSize: 18,
              color: "#667eea",
              fontWeight: 600,
              padding: "20px",
              background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            ⏳ Đang tải...
          </div>
        ) : null}
        {!loading && hasMore ? (
          <Button
            type="primary"
            size="large"
            onClick={handleLoadMoreButton}
            style={{
              height: "48px",
              padding: "0 40px",
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "24px",
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
            }}
          >
            📥 Tải thêm sản phẩm
          </Button>
        ) : null}
        {!hasMore && products.length > 0 && (
          <div
            style={{
              fontSize: 15,
              color: "#999",
              padding: "16px",
              background: "#f5f5f5",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            ✅ Đã hiển thị tất cả sản phẩm
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
