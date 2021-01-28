import React from "react";
import { Card, Form, Input, Button, Typography, Image } from "antd";
import firebase from "firebase/app";
import "firebase/auth";
import { navigate } from "@reach/router";
import logo from "../bell.png";

const Login = () => {
  const auth = firebase.auth();
  const [form] = Form.useForm();
  const { Title } = Typography;

  auth.onAuthStateChanged((user) => {
    if (user) {
      navigate(`/user/${user.uid}`);
    }
  });

  const onFinish = (values) => {
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then(({ user }) => {
        form.resetFields();
        navigate(`/user/${user.uid}`);
      });
    form.resetFields();
  };

  return (
    <div className="center">
      <Image width={100} src={logo} style={{ marginTop: "30%" }} />
      <Title style={{ color: "white" }} level={2}>
        Call Bell
      </Title>
      <Card className="card" style={{ marginTop: "10%", paddingTop: "20px" }}>
        <Form
          form={form}
          name="basic"
          className="container center"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" style={{width:150, fontSize: "16px", borderRadius:10}} htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
