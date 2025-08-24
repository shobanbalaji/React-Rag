import React from "react";
import { Row, Col } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";

const ChatHeader: React.FC = () => {
  return (
    <>
      <Row
        className="align-items-center justify-content-between ms-3 text-white"
        style={{ borderBottom: "1px solid rgb(76 74 74)", height: "60px" }}
      >
        <Col md={10}>
          <p className="fw-bold mb-0">Storm AI</p>
        </Col>

        <Col md={2}>
          <div className="d-flex align-items-center justify-content-end gap-3">
            <p className="mb-0">Share</p>
            <span>
              <BsThreeDots />
            </span>
            <img
              // src=""
              alt="Profile"
              className="rounded-pill border"
              style={{ width: "25px", height: "25px" }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChatHeader;
