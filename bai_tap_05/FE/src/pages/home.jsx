import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Result icon={<CrownOutlined />} title="JSON Web Token (React/Node.JS) - iotstar.vn" />
      <h2>Danh sách sản phẩm</h2>
      <ProductList />
    </div>
  );
};

export default HomePage;
