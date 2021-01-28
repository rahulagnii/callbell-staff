import React from "react";
import { Form, Input, Button, Typography } from "antd";
import firebase from "firebase/app";
import "firebase/auth";
import { navigate } from "@reach/router";
import { NavBar } from "antd-mobile";

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
    <div>
      <NavBar mode="light">
        <Title level={2}>Call Bell</Title>
      </NavBar>
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
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
