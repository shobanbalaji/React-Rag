import React, { useState, type ChangeEvent } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { loginUser } from "../../functions/login";
import type { loginType } from "../../types";
import { useNavigate } from "react-router-dom";
import { makeWarningToast } from "../../functions/common/common";
const Login: React.FC = () => {
  const [form, setForm] = useState<loginType>({ email: "", password: "" });
  const nav = useNavigate();

  // this function handle the submit functionality and make request to api to validate the user and also handle the exceptions
  // store the basic user value to session storage for quick access
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const login = await loginUser(form);
      if (login.success && login.code == 200 && login.data.length != 0) {
        sessionStorage.setItem("userCred", JSON.stringify(login.data[0]));
        nav("/chat");
      } else {
        makeWarningToast("Invalid Email or Password !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // this function handle the input onChange and set the value to the state
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-screen">
      <Container fluid>
        <Row className="login-wrapper">
          {/* Left Side with Image */}
          <Col md={6} className="login-left d-none d-md-block">
            <div className="login-left-content">
              <h2>
                Be a Part of <br />
                Something <strong>Beautiful</strong>
              </h2>
            </div>
          </Col>

          {/* Right Side with Form */}
          <Col md={6} className="login-right">
            <div className="login-form">
              <h3 className="login-title">Login</h3>
              <p className="login-subtitle">
                Enter your credentials to access your account
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check type="checkbox" label="Remember me" />
                </div>

                <Button type="submit" className="login-btn">
                  Login
                </Button>

                <p className="signup-text">
                  Not a member? <a href="#">Create an account</a>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
