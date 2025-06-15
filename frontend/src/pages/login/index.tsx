import React, { useState, type ChangeEvent } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { loginUser } from "../../functions/login";
import type { loginType } from "../../types";
const Login = () => {
  const [form, setForm] = useState<loginType>({ email: "", password: "" });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const login = await loginUser(form);
      console.log(login,"login")
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setForm((prev)=>({...prev, [name]:value}))
  }

  return (
    <div
      className="bg-white pe-5"
      style={{
        height: "100vh",
        backgroundColor: " #0073cf",
        backgroundImage: "linear-gradient(315deg, #0073cf 0%, #f2f0ef 74%)",
        display: "grid",
        alignItems: "normal",
        alignContent: "center",
      }}
    >
      <Row>
        <Col
          md={8}
          className="d-flex justify-content-center align-items-center"
        >
          <h5>Strom AI</h5>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4>Login</h4>

              <Form onSubmit={handleSubmit}>
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="text" onChange={handleChange}></Form.Control>
                <Form.Label className="my-2">Password</Form.Label>
                <Form.Control name="password" type="password" onChange={handleChange}></Form.Control>
                <Button
                  className="mt-4 border b-0 px-5 rounded-pill"
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(315deg, #0073cf 0%, #f2f0ef 74%)",
                  }}
                >
                  {" "}
                  click
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
