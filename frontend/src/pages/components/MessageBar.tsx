import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";
import { FaCircleArrowUp } from "react-icons/fa6";
import { FaSquare } from "react-icons/fa";
import { LuAudioLines } from "react-icons/lu";
import type { MessageBarProps } from "../../types";

const MessageBar: React.FC<MessageBarProps> = ({ setMessage, message }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleClick = () => {
    try {
      setSendMessage(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    }
  }, [message]);

  return (
    <div className="message-bar ">
      <Form onSubmit={handleClick}>
        <Form.Control
          type="text"
          as={"textarea"}
          className="message-input"
          placeholder="Ask anything"
          onChange={handleChange}
          value={message}
          ref={textareaRef}
          style={{ resize: "none", overflowX: "hidden" }}
        />
      </Form>

      {/* actions */}
      <Row className="justify-content-between mt-3">
        <Col>
          <div className="d-flex gap-3 ">
            <FiPlus size={20} color="white" style={{ cursor: "pointer" }} />
            <LuSettings2
              size={20}
              color="white"
              style={{ cursor: "pointer" }}
            />{" "}
            <span className="text-white">Tools </span>
          </div>
        </Col>

        <Col>
          <div className="d-flex gap-3 justify-content-end align-items-center">
            <LuAudioLines
              size={22}
              color="white"
              style={{ cursor: "pointer" }}
            />
            {!sendMessage ? (
              <FaCircleArrowUp
                size={25}
                color="white"
                type="submit"
                onClick={handleClick}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div
                className="p-1 d-flex justify-content-center align-items-center"
                style={{
                  background: "#000",
                  borderRadius: "100%",
                  height: "30px",
                  width: "30px",
                }}
              >
                <FaSquare
                  size={12}
                  color="white"
                  fill="white"
                  stroke="white"
                  onClick={() => setSendMessage(false)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MessageBar;
