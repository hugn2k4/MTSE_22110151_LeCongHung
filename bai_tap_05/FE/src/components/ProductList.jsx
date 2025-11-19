import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "../util/api";
import { Button, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const ProductCard = ({ p }) => {
  const navigate = useNavigate();
  
  return (
    <Card
      hoverable
      style={{ width: 280, margin: 12 }}
      cover={
        <div style={{ height: 200, overflow: "hidden", background: "#f5f5f5" }}>
          {p.image ? (
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Không có hình
            </div>
          )}
        </div>
      }
    >
      <div style={{ minHeight: 120 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600 }}>{p.name}</h4>
        <div style={{ color: "#666", fontSize: 13, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {p.description}
        </div>
        <div style={{ fontSize: 18, color: "#ff4d4f", fontWeight: 700, marginBottom: 12 }}>
          {p.price?.toLocaleString()} VND
        </div>
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
  const categories = Array.from(
    new Set([...(products.map((p) => p.category).filter(Boolean)), ...defaultCategories])
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontSize: 16, fontWeight: 500 }}>Danh mục:</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px 12px", fontSize: 14, borderRadius: 4, border: "1px solid #d9d9d9", minWidth: 150 }}
        >
          <option value="">Tất cả</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
        {products.length === 0 && !loading ? (
          <div style={{ width: "100%", textAlign: "center", padding: 40, fontSize: 16 }}>
            Không có sản phẩm
          </div>
        ) : null}
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 24, marginBottom: 24 }}>
        {loading ? (
          <div style={{ fontSize: 16, color: "#1890ff" }}>Đang tải...</div>
        ) : null}
        {!loading && hasMore ? (
          <Button type="primary" size="large" onClick={handleLoadMoreButton}>
            Tải thêm sản phẩm
          </Button>
        ) : null}
        {!hasMore && products.length > 0 && (
          <div style={{ fontSize: 14, color: "#999" }}>Đã hiển thị tất cả sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
