import { HomeOutlined, SettingOutlined, ShoppingCartOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/search">🔍 Tìm Kiếm</Link>,
      key: "search",
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/cart">Giỏ hàng</Link>,
            key: "cart",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: <Link to="/users">Users</Link>,
            key: "user",
            icon: <UsergroupAddOutlined />,
          },
        ]
      : []),
    {
      label: `Welcome ${auth.user?.email ?? ""}`,
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.clear("access_token");
                      setAuth({
                        isAuthenticated: false,
                        user: {
                          email: "",
                          name: "",
                        },
                      });
                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
              },
            ]
          : []),
        ...(!auth.isAuthenticated
          ? [
              {
                label: <Link to="/login">Đăng nhập</Link>,
                key: "login",
              },
            ]
          : []),
      ],
    },
  ];

  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          style={{
            background: "transparent",
            borderBottom: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 500,
          }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Header;
