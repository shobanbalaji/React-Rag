import { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";

// UI Components
import { Row, Col, Spinner} from "react-bootstrap";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { MdOutlineStorm } from "react-icons/md";

// Components
import MessageBar from "../components/MessageBar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";

// Functions
import { fetchConversation, getUserChats } from "../../functions/chat";
import { makeErrorToast } from "../../functions/common/common";

// Constants & Types
import { UI_ERROR_MESSAGE, UID } from "../../functions/variables/common";
import type { chatListProps, conversationDataProps } from "../../types";
import ChatViewer from "../components/ChatViewer";

const index = () => {
  const [message, setMessage] = useState<string>("");
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string>("");
  const [chatList, setChatList] = useState<chatListProps[]>([]);
  const [sidebarPointer, setSidebarPointer] = useState<boolean>(false);
  const [conversationData, setConversationData] = useState<conversationDataProps[]>([]);
  const [requestProgress, setRequestProgress] = useState<boolean>(false)
  const [autoScroll, setAutoScroll] = useState <Boolean>(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // get the chat id based on the params values
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get("id");
    if (paramValue) {
      setChatId(paramValue);
    }
  }, []);

  // fetch the user conversation based on chat and user ids / this useEffect render everyTime when the chatId change
  useEffect(() => {
    if (!chatId) return; // prevent fetch on initial/default state
  
    const fetchConversationData = async () => {
      try {
        const response = await fetchConversation({ chatId, userId: UID });
        setConversationData(response.data);
      } catch (error) {
        makeErrorToast(UI_ERROR_MESSAGE);
      }
    };
  
    fetchConversationData();
  }, [chatId]);

  // get all user chat data for side bar - this render one time
  useEffect(() => {
    const getChatData = async () => {
      try {
        const { code, success, data } = await getUserChats({ userId: UID });
        if (code === 500 && !success) {
          makeErrorToast("Failed to fetch chat history");
        }
        setChatList(data);
      } catch (error) {
        makeErrorToast(UI_ERROR_MESSAGE);
      }
    };
    getChatData();
  }, [chatId]);

  // useEffect for scroll down the page to the bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationData]);



  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData, requestProgress, autoScroll]);




  return (
    <div
      className="rag-container"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Row className="justify-content-between" style={{ height: "100%" }}>
        {/* Sidebar */}
        <Col
          md={sidebar ? 2 : 1}
          className="p-0"
          style={{
            ...(!sidebar && {
              width: "50px",
              background: "transparent",
              borderRight: "1px solid #0000002b",
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
                setSidebarPointer(false);
              }}
            >
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
              setChatList={setChatList}
            />
          )}
        </Col>

        {/* Main Chat Area */}
        <Col className="px-0 flex flex-column" md={sidebar && 10}>
          <ChatHeader />

          {/* Scrollable Chat Content */}
          <div
            className="flex-grow-1 d-flex justify-content-center chat-viewer"
            ref={scrollContainerRef}
            style={{
              overflowY: "auto",
              overflowX:"hidden"
            }}
          >
            <div className="ms-5 ps-4 mt-3" style={{height: conversationData.length === 0 ? "25vh" : "65vh"}}>
              {conversationData?.length > 0 ? (
                conversationData.map((data, index) => (
                  <div key={index}>
                  <ChatViewer key={index} response={data.response} request = {data.message} responsive = {data.responsive} viewContainerRef = {bottomRef}  />
                  </div>
                ))
              ) : ( conversationData?.length ==0  &&
                <h3 className="text-center text-white py-5 mt-5">
                  What are you working on?
                </h3>
              )}
              {
                requestProgress && 
              <div className="blink-progress my-3"/>
              }
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Message Bar Fixed at Bottom */}
          <div className="px-5 ms-5 py-2 d-grid justify-content-center">
            <MessageBar
              setMessage={setMessage}
              message={message}
              setChatId={setChatId}
              chatId={chatId}
              setConversationData={setConversationData}
              setRequestProgress={setRequestProgress}
            />
            <p style={{fontSize:"11px"}} className=" mt-1 text-white text-center">Storm is Created by Human — It will Never Surpass Human Intelligence</p>
          </div>

        </Col>
      </Row>
    </div>
  );
};

export default index;
