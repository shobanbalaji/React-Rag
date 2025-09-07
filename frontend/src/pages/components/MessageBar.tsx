import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
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
  setChatId,
  setConversationData,
  setRequestProgress
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localMessage, setLocalMessage] = useState<string>("")
  const nav = useNavigate();

  // this function handles the onchange value of the message bar value and set the value into state
  const handleChange = (e: any) => {
    const { value } = e.target;
    setLocalMessage(value);
  };

  // this function handle to make a request to api and store the response values to the relevant state and handle exceptions
  const handleClick = async(e?: React.FormEvent | React.KeyboardEvent) => {
    try {
      e?.preventDefault();
      if (localMessage.trim().length == 0) {
        return true;
      }
      const file = fileContent;
      const messageRequest = localMessage.trim();
      setFileContent(null)
      setLocalMessage("");
      setMessage("");
      setRequestProgress(true)
      setSendMessage(true);
      const tempId = `temp-${Date.now()}`;
      const request = messageRequest;

      // set request first in the state for user identification
      setConversationData((prev) => [
        ...prev,
        {
          chatId: tempId,
          message: request,
          response: "", // empty until response arrives
          createdAt: new Date(),
          updatedAt: new Date(),
          responsive:false,
        },
      ]);

      const { code, success, data } = await sendConversion({
        message: request.trim(),
        userId: UID,
        chatId: chatId,
        type: file ? "doc" : "nor",
        file: file 
      });

      if(code==200 && success){
        const responseData = {
          chatId: data.chatId,
          message: data.message,
          response: data.response,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          responsive:true
        };
        nav(`?id=${data.chatId}`);
        setChatId(data.chatId)

       setConversationData((prev) =>
         prev.map((item) => (item.chatId === tempId ? responseData : item))
       );
      }
      setRequestProgress(false)
      if (code === 500 && !success) {
        makeErrorToast(UI_ERROR_MESSAGE);
        setSendMessage(false);
        return;
      }
      setSendMessage(false);
    } catch (error) {
      setRequestProgress(false)
      makeErrorToast(UI_ERROR_MESSAGE);
      setSendMessage(false);
      setFileContent(null)
    }
  };

  const handleOpenFile = () => {
    try {
      fileInputRef.current?.click();
    } catch (error) {
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileContent(file);
      // your upload logic here
    }
  };

  const handleOpenImage = ()=>{}

  // this useEffect handle the message bar height and scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      textarea.style.maxHeight = `120px`; // Set new height
      textarea.style.overflowY = `scroll`; // Set new height
    }
  }, [message]);

  return (
    <div className="message-bar" style={{ maxHeight: "200px" }}>
      <Form onSubmit={(e) => handleClick(e)}>
        <Form.Control
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="file-card"
          style={{ display: "none" }}
        />

        {fileContent && (
          <div className="file-card">
            <div className="remove-btn" onClick={() => setFileContent(null)}>
              <FiPlus
                size={16}
                color="white"
                style={{ transform: "rotate(45deg)" }}
              />
            </div>
            <div className="filename">{fileContent?.name}</div>
          </div>
        )}

        <Form.Control
          type="text"
          as={"textarea"}
          className="message-input"
          placeholder="Ask anything"
          onChange={handleChange}
          value={localMessage}
          ref={textareaRef}
          style={{
            resize: "none",
            overflowX: "hidden",
            minHeight: "75px",
            maxHeight: "280px",
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents new line
              handleClick(e); // Call your submit function
            }
          }}
        />

        {/* actions */}
        <Row className="justify-content-between">
          <Col>
            <div className="d-flex gap-3 ">
              <Dropdown>
                <Dropdown.Toggle
                  className="p-0"
                  style={{ background: "unset", border: "none" }}
                >
                  <FiPlus
                    className="hover-icons p-1"
                    size={25}
                    color="white"
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleOpenFile}>
                    {" "}
                    Upload File
                  </Dropdown.Item>
                  {/* <Dropdown.Item onClick={handleOpenImage}> Upload Image</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>

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
                <Button
                  type="submit"
                  className="p-0"
                  style={{ background: "none", border: "none" }}
                >
                  <FaCircleArrowUp
                    size={25}
                    color="white"
                    type="submit"
                    className={`${
                      localMessage.trim().length > 0
                        ? "enable-submit"
                        : "disable-submit"
                    }`}
                    onClick={(e) => handleClick(e)}
                    style={{ cursor: "pointer" }}
                  />
                </Button>
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
      </Form>
    </div>
  );
};

export default MessageBar;
