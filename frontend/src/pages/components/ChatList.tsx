import React, { useState, useRef, type ChangeEvent } from "react";
import { Row, Form, Dropdown } from "react-bootstrap";
import type { messageListProps } from "../../types";
import { IoIosFlash, IoIosArrowForward } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsLayoutSidebar } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { deleteChat, renameChat } from "../../functions/chat";
import { UID, USER_NAME } from "../../functions/variables/common";
import { makeErrorToast } from "../../functions/common/common";
import Loader from "./Loader";
const ChatList: React.FC<messageListProps> = ({
  sidebar,
  setSidebar,
  setChatId,
  chatId,
  chatList,
  setChatList,
  isLoading,
}) => {
  const nav = useNavigate();
  const dropdownRef = useRef(null);
  const [openRename, setOpenRename] = useState<boolean>(true);
  const [renameValue, setRenameValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true); // Controls accordion open/close
  const [isRagOpen, setIsRagOpen] = useState(false); // Controls accordion open/close
  const toggleAccordion = () => setIsOpen((prev) => !prev);
  const ragToggleAccordion = () => setIsRagOpen((prev) => !prev);

  // set the chat id to the state and set the chat id value to the query params
  const handleRetrieveChat = async (docId: string, mode?: string) => {
    setOpenRename(true);
    setChatId(docId);
    nav(`?id=${docId}${mode ? `&mode=${mode}` : ""}`);

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width <= 768 && height <= 1024) {
      setSidebar(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRenameValue(value.trim());
  };

  // function to toggling the sidebar values
  const hideSidebar = () => {
    setSidebar(!sidebar);
  };

  // function for Rename the chat
  const handleRenameChat = async (e: any, chatId: string, chatName: string) => {
    try {
      e.preventDefault();
      if (chatName.trim() == renameValue.trim() || renameValue.trim() == "") {
        return true;
      }
      const response = await renameChat({
        userId: UID,
        c_id: chatId,
        c_n: renameValue,
      });
      if (response.code == 200 && response.success) {
        const updatedName = response.data.value;
        const updatedArray = chatList.map((data) => {
          if (data._id === chatId) {
            return { ...data, chatName: updatedName };
          }
          return data;
        });
        setChatList(updatedArray);
      }

      setRenameValue("");
      setOpenRename(true);
    } catch (error) {
      makeErrorToast("Failed to update chat name");
    }
  };

  // function for delete the chat
  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await deleteChat({ userId: UID, c_id: chatId });
      if (response.code == 200 && response.success) {
        const updatedChatList = chatList.filter(
          (data) => data._id != response.data.value
        );
        setChatList(updatedChatList);
        handleRetrieveChat("auto");
      }
    } catch (error) {
      makeErrorToast("Failed to delete chat");
    }
  };

  return (
    <>
      <Row
        className="ps-3 site-font"
        style={{
          height: "100% ",
          background: "#171717",
          flexDirection: "column",
          fontSize: "14px",
        }}
      >
        {/* Header */}
        <div
          style={{ minHeight: "40px"}}
          className="d-flex justify-content-between align-items-center mt-3"
        >
          <div
            className="p-2 d-flex justify-content-center align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => handleRetrieveChat("auto")}
          >
            <IoIosFlash size={24} color="#ffc51c" />
            <p className="text-white fw-bold mb-0">Storm AI</p>
          </div>

          <div
            className="hover-icons p-1"
            style={{ cursor: "pointer" }}
            onClick={hideSidebar}
          >
            <BsLayoutSidebar size={16} color="white" />
          </div>
        </div>

        <div>
          <div
            className="text-white d-flex gap-2 align-items-center chat-item"
            onClick={() => handleRetrieveChat("auto")}
          >
            <FiEdit size={17} style={{ strokeWidth: "1.3px" }} />
            <p className="mb-0">New chat</p>
          </div>

          <div
            className="text-white d-flex gap-2 align-items-center chat-item m-0"
            onClick={() => handleRetrieveChat("auto", "rag")}
          >
            <IoDocumentTextOutline size={17} style={{ strokeWidth: "1.3px" }} />
            <p className="mb-0">Document chat</p>
          </div>
        </div>

        <div
          className="chat-list-container"
          style={{ height: "72vh", overflowY: "auto" }}
        >
          {/* Rag chat */}
          <div
            className="chat-list-bar"
            style={{
              overflowY: "auto",
            }}
          >
            <div className="custom-accordion">
              {/* Accordion Header */}
              <div
                onClick={ragToggleAccordion}
                className="accordion-header d-flex justify-content-start gap-2 align-items-center ps-3  py-2 text-white"
                style={{ cursor: "pointer" }}
              >
                <span className="text-secondary" style={{ fontSize: "14px" }}>
                  Doc Assist
                </span>
                <span
                  style={{
                    transform: isRagOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  <IoIosArrowForward />
                </span>
              </div>

              {/* Accordion Body */}
              {isRagOpen && (
                <div>
                  {chatList
                    .filter((list) => list?.isRag == true)
                    ?.map((data, index) => (
                      <div
                        key={index}
                        style={{ height: "35px" }}
                        className={`d-flex justify-content-between align-items-center text-white ${
                          openRename ? "pe-2" : "pe-0"
                        } my-1 chat-item chat-item-${
                          data._id === chatId ? "active" : "inActive"
                        }`}
                      >
                        {data._id === chatId ? (
                          <Form
                            onSubmit={(e) =>
                              handleRenameChat(e, data._id, data.chatName)
                            }
                            style={{ width: "100%" }}
                          >
                            <Form.Control
                              type="text"
                              defaultValue={data.chatName}
                              readOnly={openRename}
                              className="ps-2"
                              onChange={handleChange}
                              style={{
                                background: "transparent",
                                border: openRename ? "none" : "1px solid white",
                                color: "white",
                                fontSize: "14px",
                              }}
                              onClick={(e) =>
                                handleRenameChat(e, data._id, data.chatName)
                              }
                            />
                          </Form>
                        ) : (
                          <p
                            className="my-2 p-2 w-100"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={() => handleRetrieveChat(data._id)}
                          >
                            {" "}
                            {data.chatName}
                          </p>
                        )}
                        {data._id === chatId && openRename && (
                          <Dropdown ref={dropdownRef}>
                            <Dropdown.Toggle
                              className="p-0"
                              style={{ background: "unset", border: "none" }}
                            >
                              <BiDotsHorizontalRounded />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => setOpenRename(false)}
                              >
                                Rename
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleDeleteChat(chatId)}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/*general Chat List */}
          <div
            className="chat-list-bar"
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            <div className="custom-accordion">
              {/* Accordion Header */}
              <div
                onClick={toggleAccordion}
                className="accordion-header d-flex justify-content-start gap-2 align-items-center ps-3  py-2 text-white"
                style={{ cursor: "pointer" }}
              >
                <span className="text-secondary" style={{ fontSize: "14px" }}>
                  Chats
                </span>
                <span
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  <IoIosArrowForward />
                </span>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div>
                  {chatList
                    .filter((list) => list?.isRag != true)
                    ?.map((data, index) => (
                      <div
                        key={index}
                        style={{ height: "35px" }}
                        className={`d-flex justify-content-between align-items-center text-white ${
                          openRename ? "pe-2" : "pe-0"
                        } my-1 chat-item chat-item-${
                          data._id === chatId ? "active" : "inActive"
                        }`}
                      >
                        {data._id === chatId ? (
                          <Form
                            onSubmit={(e) =>
                              handleRenameChat(e, data._id, data.chatName)
                            }
                            style={{ width: "100%" }}
                          >
                            <Form.Control
                              type="text"
                              defaultValue={data.chatName}
                              readOnly={openRename}
                              className="ps-2"
                              onChange={handleChange}
                              style={{
                                background: "transparent",
                                border: openRename ? "none" : "1px solid white",
                                color: "white",
                                fontSize: "14px",
                              }}
                              onClick={(e) =>
                                handleRenameChat(e, data._id, data.chatName)
                              }
                            />
                          </Form>
                        ) : (
                          <p
                            className="my-2 p-2 w-100"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={() => handleRetrieveChat(data._id)}
                          >
                            {" "}
                            {data.chatName}
                          </p>
                        )}
                        {data._id === chatId && openRename && (
                          <Dropdown ref={dropdownRef} className="storm-drop-down">
                            <Dropdown.Toggle
                              className="p-0"
                              style={{ background: "unset", border: "none" }}
                            >
                              <BiDotsHorizontalRounded />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => setOpenRename(false)}
                              >
                                Rename
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleDeleteChat(chatId)}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {isLoading && <Loader />}
          </div>
        </div>

        <div className="p-3 text-white d-flex user-profile-wrapper gap-2">
          <div className="user-profile">
            <div
              className="bg-warning rounded-pill d-flex justify-content-center align-items-center"
              style={{ height: "35px", width: "35px", fontSize: "1rem" }}
            >
              {USER_NAME?.slice(0, 1)}
            </div>
          </div>
          <div className="user-info">
            <p className="mb-0">{USER_NAME}</p>
            <span style={{ fontSize: "0.75rem" }}>Preview</span>
          </div>
        </div>
      </Row>
    </>
  );
};

export default ChatList;
