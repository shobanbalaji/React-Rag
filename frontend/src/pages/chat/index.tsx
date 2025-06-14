import { useState } from "react";
import MessageBar from "../components/MessageBar";
import { Row, Col } from "react-bootstrap";
import ChatList from "../components/ChatList";
import { TbLayoutSidebarFilled } from "react-icons/tb";

const index = () => {
  const [message, setMessage] = useState<string>("");
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string>("auto");

  // get chat data
  const getChatData = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rag-container">
      <Row>
        {sidebar && (
          <Col md={sidebar && 2} className="p-0">
            {" "}
            <ChatList
              sidebar={sidebar}
              setSidebar={setSidebar}
              setChatId={setChatId}
              chatId={chatId}
            />
          </Col>
        )}

        <Col md={sidebar && 10}>
          {!sidebar && (
            <div className="d-flex my-2">
              <div
                className="px-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                {" "}
                <TbLayoutSidebarFilled size={25} color="white" />
              </div>
            </div>
          )}
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
