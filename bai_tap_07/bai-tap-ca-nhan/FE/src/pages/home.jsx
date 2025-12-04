import { CrownOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "40px 20px" }}>
        <Result
          icon={<CrownOutlined style={{ color: "#667eea" }} />}
          title={
            <span
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              JSON Web Token (React/Node.JS) - iotstar.vn
            </span>
          }
        />

        {/* Search Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "40px 20px",
            borderRadius: "16px",
            marginBottom: "30px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1 style={{ color: "white", fontSize: "32px", marginBottom: "16px" }}>🔍 Tìm Kiếm Sản Phẩm Thông Minh</h1>
          <p style={{ fontSize: "18px", marginBottom: "24px", opacity: 0.9 }}>
            Sử dụng Fuzzy Search và bộ lọc nâng cao để tìm sản phẩm hoàn hảo
          </p>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={() => navigate("/search")}
            style={{
              height: "50px",
              fontSize: "18px",
              padding: "0 40px",
              background: "white",
              color: "#667eea",
              border: "none",
              fontWeight: 600,
            }}
          >
            Bắt đầu tìm kiếm
          </Button>
          <div style={{ marginTop: "20px", fontSize: "14px", opacity: 0.8 }}>
            ✨ Hỗ trợ tìm kiếm mờ • 🎯 Lọc theo nhiều tiêu chí • ⚡ Tìm kiếm nhanh chóng
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📦 Danh sách sản phẩm nổi bật
          </h2>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
