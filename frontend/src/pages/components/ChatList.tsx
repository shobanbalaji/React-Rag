import React from "react";
import { Row, Form } from "react-bootstrap";
import type { messageListProps } from "../../types";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { MdOutlineStorm } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const ChatList: React.FC<messageListProps> = ({
  sidebar,
  setSidebar,
  setChatId,
  chatId,
  chatList,
}) => {
  const nav = useNavigate();

  // retrieve chat
  const handleRetrieveChat = async (docId: string) => {
    setChatId(docId);
    nav(`?id=${docId}`);
  };

  const hideSidebar = () => {
    setSidebar(!sidebar);
  };

  const data = [
    {
      _id: "685f7719ce5127189af3c9cd",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:13.872000",
      updatedAt: "2025-06-28T05:01:13.872000",
    },
    {
      _id: "685f7731ce5127189af3c9ce",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:37.657000",
      updatedAt: "2025-06-28T05:01:37.657000",
    },
    {
      _id: "685f7731ce5127189af3c9cf",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:37.921000",
      updatedAt: "2025-06-28T05:01:37.921000",
    },
    {
      _id: "685f7732ce5127189af3c9d0",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.087000",
      updatedAt: "2025-06-28T05:01:38.087000",
    },
    {
      _id: "685f7732ce5127189af3c9d1",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.230000",
      updatedAt: "2025-06-28T05:01:38.230000",
    },
    {
      _id: "685f7732ce5127189af3c9d2",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.404000",
      updatedAt: "2025-06-28T05:01:38.404000",
    },
    {
      _id: "685f7732ce5127189af3c9d3",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.712000",
      updatedAt: "2025-06-28T05:01:38.712000",
    },
    {
      _id: "685f7732ce5127189af3c9d2",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.404000",
      updatedAt: "2025-06-28T05:01:38.404000",
    },
    {
      _id: "685f7732ce5127189af3c9d3",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.712000",
      updatedAt: "2025-06-28T05:01:38.712000",
    },
    {
      _id: "685f7732ce5127189af3c9d2",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.404000",
      updatedAt: "2025-06-28T05:01:38.404000",
    },
    {
      _id: "685f7732ce5127189af3c9d3",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.712000",
      updatedAt: "2025-06-28T05:01:38.712000",
    },
    {
      _id: "685f7732ce5127189af3c9d2",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.404000",
      updatedAt: "2025-06-28T05:01:38.404000",
    },
    {
      _id: "685f7732ce5127189af3c9d3",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.712000",
      updatedAt: "2025-06-28T05:01:38.712000",
    },
    {
      _id: "685f7732ce5127189af3c9d2",
      UId: "684e893de825599ec8d09cf9",
      chatName: "New Chat",
      createdAt: "2025-06-28T05:01:38.404000",
      updatedAt: "2025-06-28T05:01:38.404000",
    },
  ];

  return (
    <>
      <Row
        className="ps-3"
        style={{
          height: "100vh",
          background: "#171717",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{ height: "10%", minHeight: "60px" }}
          className="d-flex justify-content-between align-items-center"
        >
          <div
            className="p-2 hover-icons"
            onClick={() => nav("/chat?model=auto")}
          >
            <MdOutlineStorm size={22} color="white" />
          </div>

          <div
            className="hover-icons p-1"
            style={{ cursor: "pointer" }}
            onClick={hideSidebar}
          >
            <TbLayoutSidebarFilled size={25} color="white" />
          </div>
        </div>

        {/* Chat List */}
        <div
          className="chat-list-bar"
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {chatList?.map((data, index) => (
            <div
              key={index}
              style={{ height: "35px" }}
              className={`d-flex align-items-center text-white  my-1 chat-item chat-item-${
                data._id === chatId ? "active" : "inActive"
              }`}
              onClick={() => handleRetrieveChat(data._id)}
            >
              {data._id === chatId ? (
                <Form.Control
                  type="text"
                  defaultValue={data.chatName}
                  readOnly={true}
                  className="ps-2"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    height: "80%",
                  }}
                />
              ) : (
                <p className="my-2 ps-2"> {data.chatName}</p>
              )}
            </div>
          ))}
        </div>
      </Row>
    </>
  );
};

export default ChatList;
