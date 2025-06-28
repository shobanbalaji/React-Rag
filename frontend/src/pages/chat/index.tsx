import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Components
import { Row, Col } from "react-bootstrap";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { MdOutlineStorm } from "react-icons/md";

// Components
import MessageBar from "../components/MessageBar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";

// Functions
import { createChat, getUserChats } from "../../functions/chat";
import { makeErrorToast } from "../../functions/common/common";

// Constants & Types
import { UI_ERROR_MESSAGE, UID } from "../../functions/variables/common";
import type { chatListProps } from "../../types";

const index = () => {
  const [message, setMessage] = useState<string>("");
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("auto");
  const [chatList, setChatList] = useState<chatListProps[]>([]);
  const [sidebarPointer, setSidebarPointer] = useState<boolean>(false);
  const nav = useNavigate();

  // get all user chat data
  const getChatData = async () => {
    try {
      const { code, success, data } = await getUserChats({ userId: UID });
      if (code === 500 && !success) {
        makeErrorToast("Failed to fetch chat history");
      }
      setChatList(data);
    } catch (error) {
      console.error(error);
      makeErrorToast(UI_ERROR_MESSAGE);
    }
  };

  const createNewChat = async () => {
    try {
      nav("?model=auto");
      const response = await createChat({ userId: UID });
    } catch (error) {
      console.error(error);
      makeErrorToast(UI_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    getChatData();
  }, []);

  return (
    <div className="rag-container">
      <Row>
        <Col
          md={sidebar ? 2 : 1}
          className="p-0"
          style={{
            ...(!sidebar && {
              width: "50px",
              background: "transparent",
              borderRight: "1px solid #0000002b",
              height: "100vh",
            }),
          }}
        >
          {!sidebar && (
            <div
              className="p-1 hover-icons w-75 text-center mt-3 ms-1"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setSidebarPointer(true)}
              onMouseLeave={() => setSidebarPointer(false)}
              onClick={() => {
                setSidebar(!sidebar);
                setSidebarPointer(false)
              }}
            >
              {" "}
              {sidebarPointer ? (
                <TbLayoutSidebarFilled size={22} color="white" />
              ) : (
                <MdOutlineStorm size={22} color="white" />
              )}
            </div>
          )}

          {sidebar && (
            <ChatList
              sidebar={sidebar}
              setSidebar={setSidebar}
              setChatId={setChatId}
              chatId={chatId}
              chatList={chatList}
            />
          )}
        </Col>

        <Col className="ps-0" md={sidebar && 10}>
          <ChatHeader />
          <h3 className="text-center text-white py-5">
            What are you working on ?
          </h3>
          <div className="d-flex justify-content-center">
            <MessageBar
              setMessage={setMessage}
              message={message}
              setChatId={setChatId}
              chatId={chatId}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default index;
