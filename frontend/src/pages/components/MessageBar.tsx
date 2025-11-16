import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Dropdown, Form } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { LuAudioLines } from "react-icons/lu";
import { FaCircleArrowUp } from "react-icons/fa6";
import { FaSquare } from "react-icons/fa";
import type { MessageBarProps } from "../../types";
import { sendConversion } from "../../functions/chat";
import { makeErrorToast } from "../../functions/common/common";
import { UI_ERROR_MESSAGE } from "../../functions/variables/common";

const MessageBar: React.FC<MessageBarProps> = ({
  setMessage,
  message,
  chatId,
  setChatId,
  setConversationData,
  setRequestProgress,
  chatMode
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>();
  const [localMessage, setLocalMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  // this function handles the onchange value of the message bar value and set the value into state
  const handleChange = (e: any) => {
    const { value } = e.target;
    setLocalMessage(value);
  };

  // this function handle to make a request to api and store the response values to the relevant state and handle exceptions
  const handleClick = async (e?: React.FormEvent | React.KeyboardEvent) => {
    try {
      e?.preventDefault();
      if (localMessage.trim().length == 0) {
        return true;
      }
      resetHeight()
      const file = fileContent;
      const messageRequest = localMessage.trim();
      setFileContent(null);
      setLocalMessage("");
      setMessage("");
      setRequestProgress(true);
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
          responsive: false,
        },
      ]);

      const { code, success, data } = await sendConversion({
        message: request.trim(),
        chatId: chatId,
        type: file ? "doc" : "nor",
        file: file,
        mode: chatMode=="rag"? "true": "false"
      });

      if (code == 200 && success) {
        const responseData = {
          chatId: data.chatId,
          message: data.message,
          response: data.response,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          responsive: true,
        };
        nav(`?id=${data.chatId}`);
        setChatId(data.chatId);

        setConversationData((prev) =>
          prev.map((item) => (item.chatId === tempId ? responseData : item))
        );
      }
      setRequestProgress(false);
      if (code === 500 && !success) {
        makeErrorToast(UI_ERROR_MESSAGE);
        setSendMessage(false);
        return;
      }
      setSendMessage(false);
    } catch (error) {
      setRequestProgress(false);
      makeErrorToast(UI_ERROR_MESSAGE);
      setSendMessage(false);
      setFileContent(null);
    }
  };

  const handleOpenFile = () => {
    try {
      fileInputRef.current?.click();
    } catch (error) {}
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileContent(file);
      // your upload logic here
    }
  };

  // this useEffect handle the message bar height and scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      textarea.style.maxHeight = `200px`; // Set new height
      textarea.style.overflowY = `scroll`; // Set new height
    }
  }, [message]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";       // reset first
    el.style.height = el.scrollHeight + "px"; // apply natural height
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };


  return (
    <>
    <div className="message-bar">
      <Form
        onSubmit={(e) => handleClick(e)}
        className="d-flex align-items-end ps-2 pe-3"
      >
        <Form.Control ref={fileInputRef}  type="file" onChange={handleFileChange} style={{display:"none"}}/>
        <Dropdown className="storm-drop-down">
          <Dropdown.Toggle
            className="p-0"
            style={{ background: "unset", border: "none" }}
          >
            <FiPlus size={25} color="#fff" className="more-tool-icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenFile}> Upload File</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control
          as="textarea"
          ref={textareaRef}
          value={localMessage}
          placeholder="Ask anything..."
          className="message-input py-3 pe-4 ps-0 me-2"
          onChange={(e) => {
            handleChange(e);
            adjustHeight();
          }}
          rows={1}
          style={{
            resize: "none",
            overflow: "hidden",
            minHeight: "48px",
            maxHeight: "280px",
            transition: "height 0.15s ease", 
            lineHeight: "24px",
          }}
          onKeyDown={(e) => {
            // Enter = Submit
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleClick(e);
              return;
            }

            // Shift + Enter = New Line + dynamic height
            if (e.key === "Enter" && e.shiftKey) {
              setTimeout(() => adjustHeight(), 0);
            }
          }}
        />

      <div className="d-flex gap-3 justify-content-end align-items-center mb-2">

        {/* Audio Icon (only when no message) */}
        {!localMessage.trim() && (
          <LuAudioLines
            size={15}
            color="white"
            className="more-tool-icon"
            style={{ cursor: "pointer" }}
          />
        )}

        {/* If there is a message → show submit button */}
        {localMessage ? (
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
          /* If no message → show stop square (only when sendMessage === true) */
          sendMessage && (
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
              />
            </div>
          )
        )}
      </div>
      </Form>
    </div>
    </>
  );
};

export default MessageBar;
