import { HomeOutlined, SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">> check auth:", auth);
  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated
      ? [
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
    console.log("click ", e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default Header;
