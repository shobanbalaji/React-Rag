import React, { useState, type ChangeEvent } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { loginUser } from "../../functions/login";
import type { loginType } from "../../types";
import { useNavigate } from "react-router-dom";
import { makeWarningToast } from "../../functions/common/common";

const Login = () => {
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
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          width: "100vw",
          backgroundImage: "linear-gradient(315deg, #0073cf 0%, #f2f0ef 74%)",
        }}
      >
        <Card
          className="rounded shadow-lg"
          style={{ height: "auto", width: "450px" }}
        >
          <Card.Body>
            <h4>Login</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="text"
                onChange={handleChange}
              ></Form.Control>

              <Form.Label className="my-2">Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                onChange={handleChange}
              ></Form.Control>

              <span
                className="p-1"
                style={{
                  fontSize: "13px",
                  width: "fit-content",
                  float: "right",
                }}
              >
                Forgot Password ?
              </span>

              <Button
                className="my-4 w-100 border b-0 px-5 rounded-pill bg-dark"
                type="submit"
              >
                click
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;
