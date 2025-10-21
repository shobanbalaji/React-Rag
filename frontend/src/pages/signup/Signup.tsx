import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createUser } from "../../functions/login";
import {
  makeErrorToast,
  makeSuccessToast,
} from "../../functions/common/common";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    profession: "",
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createUser(formData);
    if (res.success) {
      sessionStorage.setItem("userCred", JSON.stringify(res.data[0]));
      localStorage.setItem("userCred", JSON.stringify(res.data[0]));
      makeSuccessToast(res?.message);
      nav("/");
    } else {
      makeErrorToast(res?.message);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-light login-right">
      <Row className="w-100 justify-content-start">
        <Col xs={12} sm={8} md={4} lg={4}>
          <div className="text-white  p-4 shadow-sm">
            <h3 className="text-center mb-4 fw-bold">Create Account</h3>

            <Form onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group className="mb-2" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-2" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Profession Dropdown */}
              <Form.Group className="mb-4" controlId="profession">
                <Form.Label>Profession</Form.Label>
                <Form.Select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select profession</option>
                  <option value="student">Student</option>
                  <option value="engineer">Engineer</option>
                  <option value="architect">Architect</option>
                  <option value="designer">Designer</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 rounded-3 bg-dark"
                style={{ border: "none" }}
              >
                {loading && <Spinner size="sm" className="mx-2" />}
                Sign Up
              </Button>

              {/* Already have an account */}
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-decoration-none text-primary fw-semibold"
                >
                  Login
                </Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
