import React, { useState, type ChangeEvent } from "react";
import { Col, Container, Row, Spinner} from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { loginUser } from "../../functions/login";
import type { loginType } from "../../types";
import { useNavigate } from "react-router-dom";
import { makeWarningToast } from "../../functions/common/common";

const Login: React.FC = () => {
  const [form, setForm] = useState<loginType>({ email: "", password: "" });
  const nav = useNavigate();
  const[loading, setLoading] = useState<boolean>(false)

  // this function handle the submit functionality and make request to api to validate the user and also handle the exceptions
  // store the basic user value to session storage for quick access
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true)
      const login = await loginUser(form);
      if (login.success && login.code == 200 && login.data.length != 0) {
        sessionStorage.setItem("userCred", JSON.stringify(login.data[0]));
        localStorage.setItem("userCred", JSON.stringify(login.data[0]));
        setLoading(false)
        nav("/chat");
      } else {
        makeWarningToast("Invalid Email or Password !");
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
    }
  };

  // this function handle the input onChange and set the value to the state
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-right">
      <Container fluid>
        <Row className="login-wrapper justify-content-between align-items-center" style={{
              height: "100vh",
            }}>

            <h5 className="text-white" style={{position:"absolute", top:"2%"}}>Storm AI</h5>


          {/* Right Side with Form */}
          <Col md={6} className="text-white mt-5 login-card" style={{width:"40%"}}>
            <div className="login-form px-4 py-3 mx-5" id="login-form-card" style={{borderRadius:"15px"}}>
              <h5 className="login-title py-4">Welcome back</h5>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  {/* <Form.Label>Username</Form.Label> */}
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Mail"
                    style={{backgroundColor:"transparent", border:"1px solid #aaa"}}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  {/* <Form.Label>Password</Form.Label> */}
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    style={{backgroundColor:"transparent", border:"1px solid #aaa"}}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" className="w-100 bg-dark" disabled = {loading} style={{border:"none"}}>

                  {loading && <Spinner size="sm" className="mx-1"/> }
                  
                  Login
                </Button>

                <p className="signup-text">
                  Does not have a account? <a href="#">Sign up for free</a>
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
