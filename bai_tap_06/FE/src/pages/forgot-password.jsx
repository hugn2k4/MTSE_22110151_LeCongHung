import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../util/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email } = values;
    const res = await forgotPasswordApi(email);

    if (res && res.EC === 0) {
      notification.success({
        message: "Quên Mật Khẩu",
        description: res.EM || "Mật khẩu mới đã được gửi. Kiểm tra console để xem mật khẩu tạm thời.",
        duration: 5,
      });

      // Show temp password in notification (only for demo)
      if (res.tempPassword) {
        notification.info({
          message: "Mật khẩu tạm thời (Demo)",
          description: `Mật khẩu mới của bạn là: ${res.tempPassword}`,
          duration: 10,
        });
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      notification.error({
        message: "Quên Mật Khẩu",
        description: res?.EM || "Email không tồn tại trong hệ thống",
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Quên Mật Khẩu</legend>
          <Form name="forgotPassword" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lấy Lại Mật Khẩu
              </Button>
            </Form.Item>
          </Form>

          <Link to="/login">
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
