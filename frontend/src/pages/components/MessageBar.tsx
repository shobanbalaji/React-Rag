import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { LuSettings2, LuAudioLines } from "react-icons/lu";
import { FaCircleArrowUp } from "react-icons/fa6";
import { FaSquare } from "react-icons/fa";
import type { MessageBarProps } from "../../types";
import { sendConversion } from "../../functions/chat";
import { makeErrorToast } from "../../functions/common/common";
import { UI_ERROR_MESSAGE, UID } from "../../functions/variables/common";

const MessageBar: React.FC<MessageBarProps> = ({
  setMessage,
  message,
  chatId,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(false);

  // this function handles the onchange value of the message bar value and set the value into state
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  // this function handle to make a request to api and store the response values to the relevant state and handle exceptions
  const handleClick = async () => {
    try {
      if (message.trim().length == 0) {
        return true;
      }
      setSendMessage(true);
      const { code, success, data } = await sendConversion({
        message: message.trim(),
        userId: UID,
        chatId: chatId,
      });
      if (code === 500 && !success) {
        makeErrorToast(UI_ERROR_MESSAGE);
        setSendMessage(false);
        return;
      }
      setMessage("");
      setSendMessage(false);
    } catch (error) {
      console.error(error);
      makeErrorToast(UI_ERROR_MESSAGE);
      setSendMessage(false);
    }
  };

  // this useEffect handle the message bar height and scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      // textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      // textarea.style.maxHeight = `180px`; // Set new height
    }
  }, [message]);

  return (
    <div className="message-bar" style={{maxHeight:"200px"}}>
      <Form onSubmit={handleClick}>
        <Form.Control
          type="text"
          as={"textarea"}
          className="message-input"
          placeholder="Ask anything"
          onChange={handleChange}
          value={message}
          ref={textareaRef}
          style={{ resize: "none", overflowX: "hidden", minHeight:"75px", maxHeight:"280px"}}
        />
      </Form>

      {/* actions */}
      <Row className="justify-content-between">
        <Col>
          <div className="d-flex gap-3 ">
            <FiPlus
              className="hover-icons p-1"
              size={25}
              color="white"
              style={{ cursor: "pointer" }}
            />
            <div className="hover-icons ps-1 pe-2">
              <LuSettings2
                size={25}
                className="p-1 "
                color="white"
                style={{ cursor: "pointer" }}
              />{" "}
              <span className="text-white">Tools </span>
            </div>
          </div>
        </Col>

        <Col>
          <div className="d-flex gap-3 justify-content-end align-items-center">
            <LuAudioLines
              size={25}
              color="white"
              className="p-1 hover-icons"
              style={{ cursor: "pointer" }}
            />
            {!sendMessage ? (
              <FaCircleArrowUp
                size={25}
                color="white"
                type="submit"
                className={`${
                  message.trim().length > 0 ? "enable-submit" : "disable-submit"
                }`}
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
