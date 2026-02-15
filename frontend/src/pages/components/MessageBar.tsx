import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Form } from "react-bootstrap";
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
  // message,
  chatId,
  setChatId,
  setConversationData,
  setRequestProgress,
  chatMode,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendMessage, setSendMessage] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>();
  const [localMessage, setLocalMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const handleChange = (e: any) => {
    setLocalMessage(e.target.value);
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [localMessage]);

  const handleClick = async (
    e?: React.FormEvent | React.KeyboardEvent
  ) => {
    try {
      e?.preventDefault();
      if (!localMessage.trim()) return;

      resetHeight();

      const file = fileContent;
      const messageRequest = localMessage.trim();

      setFileContent(null);
      setLocalMessage("");
      setMessage("");
      setRequestProgress(true);
      setSendMessage(true);

      const tempId = `temp-${Date.now()}`;

      setConversationData((prev) => [
        ...prev,
        {
          chatId: tempId,
          message: messageRequest,
          response: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          responsive: false,
        },
      ]);

      const { code, success, data } = await sendConversion({
        message: messageRequest,
        chatId: chatId,
        type: file ? "doc" : "nor",
        file: file,
        mode: chatMode == "rag" ? "true" : "false",
      });

      if (code === 200 && success) {
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
          prev.map((item) =>
            item.chatId === tempId ? responseData : item
          )
        );
      }

      if (code === 500 && !success) {
        makeErrorToast(UI_ERROR_MESSAGE);
      }

      setSendMessage(false);
      setRequestProgress(false);
    } catch (error) {
      setRequestProgress(false);
      setSendMessage(false);
      setFileContent(null);
      makeErrorToast(UI_ERROR_MESSAGE);
    }
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) setFileContent(file);
  };

  return (
    <div className="message-bar">
      <Form
        onSubmit={(e) => handleClick(e)}
        className="d-flex align-items-center ps-2 pe-3"
      >
        <Form.Control
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Dropdown className="storm-drop-down">
          <Dropdown.Toggle
            className="p-0"
            style={{ background: "unset", border: "none" }}
          >
            <FiPlus size={25} color="#fff" className="more-tool-icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenFile}>
              Upload File
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Form.Control
          as="textarea"
          ref={textareaRef}
          value={localMessage}
          placeholder="Ask anything..."
          className="message-input py-3 pe-4 ps-0 me-2 flex-grow-1"
          onChange={(e) => {
            handleChange(e);
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
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleClick(e);
            }

            if (e.key === "Enter" && e.shiftKey) {
              setTimeout(() => adjustHeight(), 0);
            }
          }}
        />

        <div className="d-flex gap-3 justify-content-end align-items-center">
          {!localMessage.trim() && (
            <LuAudioLines
              size={15}
              color="white"
              className="more-tool-icon"
              style={{ cursor: "pointer" }}
            />
          )}

          {localMessage ? (
            <Button
              type="submit"
              className="p-0"
              style={{ background: "none", border: "none" }}
            >
              <FaCircleArrowUp
                size={25}
                color="white"
                className={
                  localMessage.trim().length > 0
                    ? "enable-submit"
                    : "disable-submit"
                }
                style={{ cursor: "pointer" }}
              />
            </Button>
          ) : (
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
  );
};

export default MessageBar;
